---
title: Dialing In Espresso, and Sending the Whole House to ClickHouse
pubDatetime: 2026-06-18T18:00:00Z
author: Jordan Simonovski
description: 
tags:
  - opentelemetry
  - observability
  - embedded
  - esp32
  - coffee
featured: false
draft: true
--- 

Last time I bolted OpenTelemetry onto my espresso machine and called it a tiny
industrial process worth instrumenting. The signals were good: gauges for the
boiler and pump, a span per shot, exemplars stapling metrics back to traces.
What I didn't have was two things that turned out to matter more than any of the
clever bits. A way to actually *set* the variables I was instrumenting, and
somewhere durable to put all the data once it left the machine.

So this is the follow-up. Two halves: the grind-and-dose UX that closes the loop
on the device, and a custom OpenTelemetry Collector running in Home Assistant
that funnels both the Gaggia and the rest of my house into ClickHouse.

## Part one: the machine now knows what a grinder is

The shot span always carried `coffee.grind.level`, `coffee.dose.weight_g` and
`coffee.brew.ratio`. The embarrassing detail I glossed over is that there was no
good way to enter those numbers. You'd dial the grinder on the grinder, scoop a
dose onto a scale, and the machine knew none of it. The most important inputs to
a shot were the two it couldn't see.

Now the firmware ships a grinder catalogue. You pick your grinder once in
settings and the machine learns its scale:

```
Custom / Generic              0–100, step 1
Varia VS3                     0–20,  step 0.1   (stepless dial)
Niche Zero                    0–50,  step 1
Baratza Encore / Encore ESP   1–40,  step 1
Fellow Ode Gen 2              1–11,  step 1
1Zpresso (J/JX/K)             0–100, step 1     clicks
Comandante C40                0–50,  step 1     clicks
…and a few more
```

Each entry is just a min, a max, a step, and an optional unit suffix. That's the
whole abstraction, and it's enough. The brew screen grows a grind/dose pane: two
pairs of plus/minus buttons, one for grind level, one for dose. Grind nudges by
the grinder's own step (so a Varia moves in `0.1`, an Encore in whole numbers)
and snaps to that step relative to its minimum, clamped to the dial's range. Dose
moves in `0.5g` and clamps to a sane `0.1–60g`. Below them sits a live brew
ratio, `1:2.0` and friends, computed from the target yield over the dose.

The same controls exist in the Web UI, because squinting at a 2.4-inch screen
is a punishment, not a workflow. There's one source of truth, though: the grinder
table lives in the firmware (`Grinders.h`) and is mirrored byte-for-byte in the
Web UI (`grinders.js`), same order so the index *is* the id. Pick "Niche Zero"
in the browser, the firmware agrees on what "Niche Zero" means.

The point of all this isn't the buttons. It's that the numbers I was already
exporting are now real, set-on-the-device values instead of guesses. The grinder
model rides along as a resource attribute (`coffee.grinder.model`), the grind
level and dose land on every shot span, and while a shot pulls the live gauges
get tagged with the current grind level, phase, and a `coffee.shot.id` that *is*
the shot's trace id. That last one is the join key: every boiler-temperature and
pump-flow sample taken mid-shot carries the same id as the span it belongs to, so
a gauge reading and the shot trace are one `WHERE coffee.shot.id = …` apart.
"Too sour" finally has a
grind setting attached to it, and "ran too much water through too little coffee"
is now a ratio I can sort by. The instrumentation was always there; this is the
half that makes it honest.

## Part two: where all the data actually goes

The original post hand-waved the backend with "point it at whatever OTLP
collector you like." Fine for a demo. In practice I wanted the espresso data to
live next to the rest of the house, the temperature sensors and the energy meter
and the zigbee swarm, so I could ask questions that span both. The kitchen being
cold and the shot running long are not unrelated events, and I'd like to prove it.

That backend is its own project now: [`ha-otelcol`](https://github.com/jordan-simonovski/ha-otelcol),
a Home Assistant add-on that runs a **custom-built** OpenTelemetry Collector.
Custom-built, because the upstream `collector-contrib` distribution does not ship
an MQTT receiver and no maintained third-party one exists. Home Assistant speaks
MQTT for half of everything, so a collector that can't read MQTT is a collector
that can't see my house.

### Building a collector that didn't exist

The fix is the [OpenTelemetry Collector Builder](https://opentelemetry.io/docs/collector/extend/ocb/).
You hand OCB a manifest of the components you want and it compiles a bespoke
collector binary. Mine pulls the usual OTLP and Prometheus receivers, the batch
and memory-limiter processors, the ClickHouse / OTLP / file / debug exporters,
and one component that isn't on the menu: a small in-repo Go MQTT receiver.

```yaml
receivers:
  - gomod: go.opentelemetry.io/collector/receiver/otlpreceiver
  - gomod: github.com/local/mqttreceiver v0.0.0   # in-repo, replaced locally
exporters:
  - gomod: .../exporter/clickhouseexporter
  - gomod: go.opentelemetry.io/collector/exporter/otlpexporter
```

The MQTT receiver is the interesting bit. It subscribes to the broker and turns
messages into OTel signals on the fly. As metrics, a JSON object becomes one
gauge per numeric field (nested objects flattened with dotted names, non-numbers
skipped), a bare number becomes a single gauge named after the topic, and a
boolean becomes a `1`/`0`. As logs, each message becomes one record with
`mqtt.topic`, `mqtt.qos`, `mqtt.retained` and `mqtt.message_id` attributes. The
factory implements both `CreateMetrics` and `CreateLogs`, so the same receiver
can sit in a metrics pipeline and a logs pipeline at once if you want your
zigbee chatter as both numbers and audit trail.

The whole thing builds in CI and publishes prebuilt multi-arch images to GHCR, so
installing the add-on is a download, not a twenty-minute on-device Go build. Same
principle as the firmware's OTA story: the user shouldn't have to compile anything
to get a working thing.

### Two streams, one database

The pipeline is deliberately boring. Two sources feed in:

- the **Gaggia**, over OTLP/HTTP, exactly as the last post described;
- **Home Assistant's MQTT broker**, every sensor that publishes to it.

Both run through a batch processor and a memory limiter (this is a Raspberry Pi,
not a datacentre) and land in the same place:

```yaml
exporters:
  - type: clickhouse
    endpoint: "clickhouse:9000"
    database: otel
    ttl: 720h
```

ClickHouse, because it's a columnar database that eats high-cardinality
time-series for breakfast and lets me ask questions in SQL instead of a
proprietary query language I'll forget by next week. The collector's ClickHouse
exporter creates its own schema, one set of tables for metrics, one for logs, one
for traces, and just writes to it.

The high-cardinality part is what makes `coffee.shot.id` safe to attach in the
first place. On a traditional TSDB, every distinct attribute value forks a new
time series, so stamping a unique id onto a metric is the classic way to blow up
your active series count and your bill. That's the cardinality bomb everyone warns
you about. ClickHouse doesn't play that game: attributes are just columns in a
`Map`, a new shot id is a few more rows and not a new series, and the engine is
built to filter and group over exactly that kind of wide, high-cardinality data.
So the constraint that would normally make a per-shot id a bad idea simply
doesn't apply here. The id is one more value in a wide event, and the wide event
is what OLAP was made for. (It helps that I pull maybe five shots a day, but the
point stands at far larger volumes.)

The result is the thing I actually wanted. My espresso shots and my house live in
the same database, on the same clock, queryable in one join. I can line up a
shot's `temp.stability_c` against the kitchen ambient temperature MQTT was
reporting at 7am. I can check whether the grinder's circuit drew its usual spike
right before a shot, or whether the board's WiFi disconnects correlate with the
microwave. None of these are questions a coffee app would ever let me ask,
because to the database none of it is coffee. It's just metrics and logs and
spans with a timestamp, which is the entire point.

## What I've got now

A machine that knows my grinder and my dose, so the data it ships is grounded in
real settings instead of vibes. A custom collector that reads both OTLP and the
MQTT firehose that runs my house. And one ClickHouse instance where a shot of
espresso and a temperature sensor are the same kind of row, finally sitting close
enough together that I can blame the right one.

The grind is still usually the problem. But now I can prove it with a `JOIN`.

---

*Previously: [I Put OpenTelemetry in My Espresso Machine (and You Can Too)](opentelemetry-in-everything.md).*
