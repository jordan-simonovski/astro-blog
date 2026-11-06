// Writes this blog's Standard.site records to the author's atproto (Bluesky) account, from the
// manifest a build leaves in dist/standard-site.json: the publication, a document per post, and
// removes documents for posts that are gone. Unchanged records are left alone.
//
//   npm run build && node scripts/standard-site.mjs --dry-run   # what would change; no sign-in
//   ATPROTO_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/standard-site.mjs
//
// Use an app password (Bluesky: Settings, Privacy and security, App passwords), never the account's.
import { readFile } from "node:fs/promises";

const dry = process.argv.includes("--dry-run");
const password = process.env.ATPROTO_APP_PASSWORD;
if (!dry && !password)
  throw new Error("ATPROTO_APP_PASSWORD is not set (or pass --dry-run)");

const manifest = JSON.parse(
  await readFile(new URL("../dist/standard-site.json", import.meta.url), "utf8")
);
const { did } = manifest;
const plc = await (await fetch(`https://plc.directory/${did}`)).json();
const pds = plc.service.find(s => s.id === "#atproto_pds").serviceEndpoint;

let token;
async function xrpc(nsid, { query, body } = {}) {
  const res = await fetch(
    `${pds}/xrpc/${nsid}${query ? `?${new URLSearchParams(query)}` : ""}`,
    {
      method: body ? "POST" : "GET",
      headers: {
        ...(body ? { "content-type": "application/json" } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: body && JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`${nsid}: ${res.status} ${await res.text()}`);
  return res.json();
}

/** The same JSON whatever order the keys come back in. */
const stable = v =>
  Array.isArray(v)
    ? `[${v.map(stable).join(",")}]`
    : v && typeof v === "object"
      ? `{${Object.keys(v)
          .sort()
          .map(k => `${JSON.stringify(k)}:${stable(v[k])}`)
          .join(",")}}`
      : JSON.stringify(v);

async function existing(collection) {
  const out = new Map();
  let cursor;
  do {
    const page = await xrpc("com.atproto.repo.listRecords", {
      query: {
        repo: did,
        collection,
        limit: "100",
        ...(cursor ? { cursor } : {}),
      },
    });
    for (const r of page.records) out.set(r.uri.split("/").pop(), r.value);
    cursor = page.records.length ? page.cursor : undefined;
  } while (cursor);
  return out;
}

const [pubs, docs] = await Promise.all([
  existing("site.standard.publication"),
  existing("site.standard.document"),
]);
const publicationUri = `at://${did}/site.standard.publication/${manifest.publication.rkey}`;
const writes = [];
const put = (collection, { rkey, record }, have) => {
  if (!have.has(rkey) || stable(have.get(rkey)) !== stable(record))
    writes.push({
      $type: `com.atproto.repo.applyWrites#${have.has(rkey) ? "update" : "create"}`,
      collection,
      rkey,
      value: record,
    });
};
put("site.standard.publication", manifest.publication, pubs);
for (const d of manifest.documents) put("site.standard.document", d, docs);
const wanted = new Set(manifest.documents.map(d => d.rkey));
for (const [rkey, value] of docs)
  if (value.site === publicationUri && !wanted.has(rkey))
    writes.push({
      $type: "com.atproto.repo.applyWrites#delete",
      collection: "site.standard.document",
      rkey,
    });

for (const w of writes)
  console.log(
    `${w.$type.split("#")[1]} ${w.collection}/${w.rkey}${w.value?.title ? `  ${w.value.title}` : ""}`
  );
if (!writes.length) console.log("Standard.site records are up to date.");
if (dry || !writes.length) process.exit(0);

token = (
  await xrpc("com.atproto.server.createSession", {
    body: { identifier: did, password },
  })
).accessJwt;
// applyWrites takes up to 200 at a time.
for (let i = 0; i < writes.length; i += 200)
  await xrpc("com.atproto.repo.applyWrites", {
    body: { repo: did, writes: writes.slice(i, i + 200) },
  });
console.log(`Wrote ${writes.length} Standard.site record change(s).`);
