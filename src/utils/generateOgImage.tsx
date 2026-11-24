import satori from "satori";
import type { SatoriOptions } from "satori";
import { SITE } from "@config";
import { writeFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";
import { SERIES, type SeriesKey } from "./series";
import smartQuotes from "./smartQuotes";

// Satori can't read woff2, so fetch the site's faces as woff from a pinned
// fontsource release.
const font = (file: string) =>
  fetch(
    `https://cdn.jsdelivr.net/npm/@fontsource/cabin@5.3.0/files/${file}`
  ).then(res => {
    if (!res.ok) throw new Error(`OG font fetch failed: ${file}`);
    return res.arrayBuffer();
  });

const [cabinBold, cabinMedium] = await Promise.all([
  font("cabin-latin-700-normal.woff"),
  font("cabin-latin-500-normal.woff"),
]);

const INK = "#16181D";
const MUTED = "#545A65";

export interface OgCard {
  title: string;
  series?: SeriesKey;
  number?: string;
  /** Line under the title on the site card (no series). */
  subtitle?: string;
}

// The post page's first viewport as a card: series band with the wordmark, a
// white title sheet with the series mark in the margin, and the closing rule.
const ogImage = ({ title, series, number, subtitle }: OgCard) => {
  const info = series ? SERIES[series] : undefined;
  const band = info?.band ?? INK;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        fontFamily: "Cabin",
        color: INK,
      }}
    >
      <div
        style={{
          height: 96,
          background: band,
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 72px",
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        <span>{SITE.title}</span>
        {info && (
          <span style={{ fontSize: 26, fontWeight: 500 }}>{info.name}</span>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", padding: "64px 72px 0" }}>
        {info && (
          <div
            style={{
              width: 260,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: band,
              }}
            >
              {info.name}
            </span>
            <span style={{ fontSize: 112, fontWeight: 700, lineHeight: 1 }}>
              {number}
            </span>
          </div>
        )}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingBottom: 40,
          }}
        >
          <span
            style={{
              fontSize: info ? 64 : 88,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1,
              maxHeight: 300,
              overflow: "hidden",
            }}
          >
            {smartQuotes(title)}
          </span>
          <span style={{ fontSize: 28, fontWeight: 500, color: MUTED }}>
            {smartQuotes(subtitle ?? SITE.author)}
          </span>
        </div>
      </div>

      <div style={{ height: 16, background: band }} />
    </div>
  );
};

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    { name: "Cabin", data: cabinBold, weight: 700, style: "normal" },
    { name: "Cabin", data: cabinMedium, weight: 500, style: "normal" },
  ],
};

const generateOgImage = async (fileName: string, card: OgCard) => {
  const svg = await satori(ogImage(card), options);

  // render png in production mode
  if (import.meta.env.MODE === "production") {
    const pngBuffer = new Resvg(svg).render().asPng();
    console.info("Output PNG Image  :", `${fileName}.png`);
    await writeFile(`./dist/${fileName}.png`, pngBuffer);
  }

  return svg;
};

export default generateOgImage;
