---
title: Wide Events Didn't Make My RCA Cheaper (They Made It Right)
pubDatetime: 2026-07-04T10:00:00Z
author: Jordan Simonovski
description: I built an eval harness to prove wide events would make agentic root-cause analysis dramatically cheaper than three pillars. An adversarial audit killed the cost story. What replaced it mattered a lot more.
tags:
  - observability
  - wide-events
  - ai
  - sre
  - opentelemetry
featured: true
draft: true
---

I went into this convinced of the wrong thing.

The pitch for wide events is that you put everything about a request (latency, status,
and every scrap of high-cardinality context) into a single fat row, so investigating an
incident is one `GROUP BY` instead of a scavenger hunt across three separate systems. I
believed that, and I believed the obvious corollary: point an agent at wide events and it'll
reach the root cause for a fraction of the tokens a three-pillars stack would burn. Cheaper,
faster, done. I built an eval harness to prove it.

The harness proved me wrong on the part I was most sure about, and right on a part I'd
undersold. The cost win I expected mostly evaporated the moment I made the comparison fair.
What survived was accuracy, and for root-cause analysis, accuracy is the only number that
was ever going to matter.

Every AI SRE vendor will quote you an accuracy figure. Almost none of them will show you the
rubric. So this is the benchmark I wish they'd publish, including the part where it embarrassed
me.

## What I was actually trying to solve

Agentic RCA is a genuinely appealing idea: an incident fires, an LLM investigates with real
tools against real telemetry, and hands you a root cause instead of a dashboard to squint at.
The hard incidents (the ones that page you at 3am) are almost never "the whole service is
down." They're "the service is fine _except_ for one cohort," and the thing that defines that
cohort is high-cardinality: a feature flag, a tenant ID, a build, a single misbehaving pod.

That is exactly the context that pre-aggregated RED metrics throw away. Nobody puts
`build_id` or `feature_flag` on a Prometheus histogram (the cardinality would melt it), so a
metrics-first view can tell you _that_ p99 is up and _nothing_ about _who_ it's up for. To
recover the "who," a three-pillars agent has to pivot: notice the spike in metrics, jump to
logs, filter to the failing requests, pull a trace, read the spans, and stitch the correlation
back together across three systems that don't share a query language.

Wide events collapse that. The high-cardinality attribute is sitting in the same row as the
latency and the status code, so the cohort falls out of a single aggregation. That's the
thesis. The question I wanted answered wasn't whether it's _nicer_ (it obviously is) but
whether it makes an _agent measurably better_, and by how much, on a test built to try and
prove it wrong.

## How the harness works

The falsifiable claim is: **give an agent wide-events tooling and it will find high-cardinality
root causes at least as reliably as, and more efficiently than, the same agent driving three
separate pillars.** If a narrower toolset wins on either axis, the claim is dead for that
scenario, and I built the harness to make that outcome possible rather than to flatter the one
I wanted. The whole thing (harness, trace generator, scenarios, fairness checks) is on GitHub
at [github.com/jordan-simonovski/heatmap-panel](https://github.com/jordan-simonovski/heatmap-panel),
under `eval/` and `trace-generator/`, if you want to run it or take it apart.

The shape of it:

- A telemetry generator I tuned to emit real outage scenarios: eight of them (S1-S8),
  each a plausible production incident with a known ground-truth root cause. Some are
  high-cardinality (a feature flag tanking one region's checkout, a bad build throwing 503s on
  a subset of pods); some deliberately aren't (a region-only slowdown that metrics _can_ see).
  The mix matters. A benchmark that's all softballs for your thesis isn't a benchmark.
- Three arms that differ in one thing only, the tools. `wide-sql` gets raw SQL over one
  wide-event table. `bubble-up` gets that same SQL plus the compare/rank primitives from an
  event comparison UI I built based on [Honeycomb's BubbleUp](https://www.honeycomb.io/platform/bubbleup):
  pick a slow cohort, and it ranks which attributes most distinguish it from the baseline.
  `pillars` gets one tool per pillar (PromQL, LogQL, TraceQL)
  and no cross-pillar join. Identical system prompt, identical symptom prompt, identical model,
  identical trial count. The only independent variable is the shape of the data the agent can
  reach.
- A blind judge on a different model. Each trial's verdict is scored against the scenario's
  rubric by a separate, more capable model that is never told which arm produced the answer,
  never shown token counts or timing, and grades against a fixed rubric rather than vibes.

The part that makes this a fair fight is that both stacks are fed from one source. A single Go
service emits synthetic OpenTelemetry spans, logs, and metrics for each scenario, and one OTel
Collector fans that identical stream out two ways. The wide arm reads ClickHouse, where every
span lands as one fat `otel_traces` row with all its attributes on it. The pillars arm reads the
standard trio the same telemetry is exported to: Prometheus for RED metrics, Loki for logs, Tempo
for traces. Neither side gets a private, tidied-up copy. The only thing that differs is what each
storage model keeps, and the one difference that matters is real: Prometheus aggregates the
high-cardinality attributes away the moment it turns spans into RED metrics, because that is what
pre-aggregated metrics do. Reproducing that loss faithfully is the whole point; removing it would
be the thumb on the scale.

So the only way I could accidentally rig this is by starving the pillars arm of data it would
genuinely have in production. One invariant guards against exactly that: every high-cardinality
discriminator has to be _absent_ from the RED metrics and _present_ in the logs and traces the
pillars arm actually queries. A script (`verify-inv1.sh`) checks it against the live stack before
I spend a cent on API calls: it reads every label on the span-metrics series and asserts that none
of `app_feature_flag`, `app_build_id`, `k8s_pod_name`, `app_tenant_id`, or `app_platform` appears
there, then asserts those same keys _are_ present in Loki's structured metadata and on Tempo's
spans. `host.region` is deliberately allowed in metrics, because region is a legitimate
low-cardinality label and pretending otherwise would rig the test the other way. If a
high-cardinality key ever showed up as a Prometheus label, the script fails and so does the run.

The eight scenarios, and what each one hides from a metrics-only view:

| Scenario | Symptom the agent is handed                                | Root-cause discriminator                                        | Reachable from RED metrics alone?             |
| -------- | ---------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------- |
| S1       | `/cart/checkout` p99 up ~1.5s, no errors                   | `feature_flag=new-checkout-flow` _and_ `region=eu-west-1`       | No (flag is high-cardinality)                 |
| S2       | Burst of fast HTTP 500s on `/api/orders`                   | `build_id=build-7a3` on `platform=ios`                          | No                                            |
| S3       | `user-service` reads p99 ~650ms, one region                | `region=ap-southeast-1`, Redis timing out to Postgres           | Region yes; the Redis mechanism is trace-only |
| S4       | `/api/search` 500s (~3s ES timeout), one customer          | `tenant=tenant-initech` _and_ `feature_flag=dark-launch-search` | No                                            |
| S5       | Clustered 503s on `/api/auth`, subset of pods              | `build_id=build-7a3` on `pod-abc-7`/`pod-abc-8` (memory leak)   | No                                            |
| S6       | `/cart/checkout` 504s after ~5s, some users                | `region=us-west-2` payment-provider timeout                     | Yes (region-only, the expected tie)           |
| S7       | One customer ~150ms slower on every route                  | `tenant=tenant-umbrella` (EU compliance overhead)               | No                                            |
| S8       | Slow writes (~500ms) on `POST /api/products`, one customer | `tenant=tenant-globex` batch import                             | No                                            |

Six of the eight turn on a high-cardinality attribute; S3 hides its mechanism on trace spans
rather than in metrics; only S6 is solvable from metrics alone, and it is scored as a tie. But
the three where the wide arms actually pull away are S1, S4, and S5, whose answer is a
_conjunction_ of two attributes that no single surface carries together. Hold that distinction;
it turns out to be the whole result.

## The cost win I was sure about, and the audit that took it away

The first run looked spectacular. Wide events reached the root cause using **4-20x fewer
tokens** than three pillars. That was the headline I wanted, and it was exactly the kind of
number I'd have happily put in a talk.

So before I published it, I did the thing you're supposed to do and tried to break it. Five
adversarial audits (telemetry fidelity, scenario discriminability, tool fairness, the judge,
reproducibility), each one hunting for the way a sceptic would dismantle the result. They found
it, and it was mostly my fault:

The token gap was largely a serialisation artefact. The pillars backends return verbose JSON
where ClickHouse returns compact TSV. An identical `GROUP BY` was 384 bytes from ClickHouse
versus 4,608 bytes from Loki, a 12x tax on the same information, and because the whole message
history is re-fed as input on every turn, that verbose payload got _re-billed_ over and over.
Most of my beautiful 4-20x was re-serialised JSON, not the agent doing less thinking.

Worse, I'd crippled the pillars arm without noticing. Its trace tool returned no span
attributes and had no fetch-by-ID, so trace-only root causes were literally unguessable. Its
logs carried no status code, so it couldn't even filter to the failing requests. I'd built a
strawman and then beaten it.

So I fixed all of it. I gave the pillars arm a real `get_trace`, server-side trace metrics,
status codes on its logs (every fix made my _opponent stronger_), and I added an output-only
token column that measures reasoning effort without the serialisation tax. Then I re-ran the
whole matrix.

The cost win did not come back. Measured by output tokens, what the agent actually generated,
the arms are comparable, and on several scenarios pillars is _cheaper_. One pillars trial spent
353k total tokens but only 6.9k of them on output; the other ~98% was re-fed JSON. **I can't
claim wide events use fewer tokens, and I won't.** Reporting the raw total as a cost win would be
the exact number a sceptic takes apart, because I just did.

This, incidentally, is the part the vendors never show you. Rootly's marketing quotes MTTR
reductions of 30%, 40%, up to 70%, and up to 80% depending on which page you land on; Middleware
claims "6-10x faster" than competing agents; and Komodor advertises a suspiciously round ">95%
accuracy" with no public rubric attached. Speed is easy to market and a wrong
answer delivered quickly is still wrong. The honest players publish _methodology_ and pointedly
withhold the score: Datadog wrote a whole engineering post about their replayable eval platform
without quoting a single pass-rate, and incident.io _recommends_ precision above 80% and recall
around 60% as targets without claiming to have hit them. When I killed my own cost number, I was
just doing in public what the serious teams already do in private.

## What actually survived: accuracy

The run that matters, pass-rate over scored trials:

| arm       | overall | needs cross-surface stitching (S1 / S4 / S5) | single-pivot (S2/S3/S6/S7/S8) |
| --------- | ------- | -------------------------------------------- | ----------------------------- |
| wide-sql  | **87%** | 33% / 100% / 78%                             | all 90-100%                   |
| bubble-up | **89%** | 56% / 63% / 90%                              | all 100%                      |
| pillars   | **61%** | **11%** / **20%** / **20%**                  | 78-100%                       |

The wide-events arms are ~26 points more accurate overall, but the aggregate _understates_ the
story, because the gap lives almost entirely in three scenarios, and they share something
specific. S1 (a feature flag _and_ a region), S4 (a tenant _and_ a flag), and S5 (a build _and_
a set of pods) each hinge on exactly that two-attribute conjunction. To land the answer the
pillars agent has to filter one surface, pivot to another, and
hold the join in its head, and even with its now-fully-armed trace tools it mostly failed to
stitch that together, landing at 11-20%. Where both attributes sit in the same row the cohort
falls out of one `GROUP BY`, and the wide arms ran far ahead on all three: 100% on S4, 90% on S5,
and even hard-for-everyone S1 at 56% against the pillars arm's 11%.

The other five scenarios turn
on a single discriminator you can reach with one pivot (a region, a build, a tenant, several of
them just as high-cardinality), and there the pillars arm keeps pace. So the win was never wide
events beating metrics across the board. Colocation collapses a multi-surface correlation into
one query, and the gap opens precisely where that correlation is hardest.

Turn it around and it's starker: the pillars agent reached a _wrong_ root cause about **39% of
the time**, versus **12%** for wide events. This is why I stopped caring about the token
question. The seductive framing of AI RCA is speed (cut your MTTR, resolve faster), but a
confidently wrong root cause has effectively _infinite_ MTTR, because it sends a human down the
wrong remediation path at the worst possible moment. incident.io put a cost on exactly this: a
wrong root cause at 3am burns 10 to 15 minutes of the on-call's time chasing and dismissing the
false lead before the real investigation even starts, and the deeper tax is trust: feed engineers
enough confident-but-wrong answers and they stop believing the tool, at which point you're paying
for shelfware. Two out of five times, the metrics-first agent would have done exactly that. That's
the real MTTR story, and it isn't about time.

The obvious objection is the judge: if it's lenient, the whole table is inflated. So I
validated it against a human-reviewed gold set: **precision 1.00**, meaning it never once passed
a wrong answer. If anything it errs slightly strict, applied identically across every arm, which
can only _narrow_ the wide-versus-pillars gap, not manufacture it. I'll be honest about the
edges too: with ~10 trials a cell the aggregate confidence intervals do brush against each
other, and these models expose no temperature setting so exact figures wobble run to run. But a
per-scenario split of 100% versus 20% isn't noise you explain away, and the ordering has
survived every re-run. (The dense version, with every fairness fix, the significance maths, and the one
rubric I'm still unhappy with, is in the eval write-up for anyone who wants to attack it
properly. Please do.)

## Why it wins, and what it costs you

The mechanism is almost boringly simple, which is how I know it's real. When latency, status,
and `feature_flag` live in the same row, "which flag is slow?" is one aggregation. When they
live in three systems, it's the same five-hop scavenger hunt from the top of this post, ending
in a correlation the agent has to _hold in its head_ across all of it, and every one of those
hops is a place to lose the thread. The agent is no smarter with wide events; it just
gets to answer the question in one step, and one step is a lot harder to get wrong than five.

But that win has a hard prerequisite, and it's the same prerequisite the vendors quietly depend
on: **the high-cardinality attribute has to actually be in your telemetry.** A wide event with
nothing but `service` and `status` on it is just an expensive log line. The entire reason my
agent could find the bad feature flag is that some human had the foresight to _put the flag on
the span_. The accuracy ceiling of every one of these tools (mine, Datadog's, the ones quoting
you 95%) is set by the quality of your instrumentation, not the cleverness of the model. That's
why the round numbers with no rubric should make you suspicious: accuracy measured on somebody
else's beautifully-instrumented benchmark tells you nothing about what it'll do on _your_
half-instrumented reality.

Which lands me somewhere I didn't expect when I started. I set out to prove wide events were
cheaper for agents, and they aren't, not in the way I meant. What they are is _colocated_, and
colocation is what turns a five-hop cross-system correlation into a single query an agent can
actually get right. The payoff is an agent that hands you the correct cohort on the incidents
that were always going to be the hardest to debug.

Same instinct I keep coming back to: instrument your systems with intent, put the
high-cardinality context where your investigation can reach it, and the tooling (agentic or
otherwise) gets to be right instead of merely fast. I was wrong about the money. I'm glad I
checked before I said it out loud.

## References

The vendor claims cited above, for anyone who wants to check them:

- Rootly, MTTR-reduction figures quoted at 30% to 80% across different pages: [AI SRE autonomous agents (up to 80%)](https://rootly.com/sre/ai-sre-explained-autonomous-agents-slash-mttr-80), [log and metric insights (40%)](https://rootly.com/sre/ai-powered-log-metric-insights-cut-mttr-40)
- Middleware OpsAI, "6-10x faster than competing AI SRE agents on identical prompts": [OpsAI: the AI SRE agent for production issues](https://middleware.io/blog/ops-ai-sre-agent/)
- Komodor Klaudia, ">95% RCA accuracy": [The autonomous AI SRE platform](https://komodor.com/ai-sre-2026/)
- Datadog, an evaluation-platform engineering post that quotes no agent pass-rate: [How we built a real-world evaluation platform for autonomous SRE agents at scale](https://www.datadoghq.com/blog/engineering/bits-ai-eval-platform/)
- incident.io, precision above 80% and recall around 60% recommended as targets: [AI root cause analysis: accuracy testing guide](https://incident.io/blog/ai-root-cause-analysis-accuracy-testing-guide)
- incident.io, the cost of AI false positives: [Rootly AI root cause analysis accuracy: verified claims vs reality](https://incident.io/blog/rootly-ai-accuracy-vs-competitors)
