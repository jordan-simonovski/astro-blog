// Writes this blog's Standard.site records to the author's atproto (Bluesky) account: the
// publication, a document per post, and deletes for posts that are gone. Unchanged records are left
// alone. It reads the live site's manifest, so it only ever publishes posts whose pages are already
// up to confirm them; .github/workflows/standard-site.yml runs it after each production deploy.
//
//   node scripts/standard-site.mjs --dry-run                      # what would change; no sign-in
//   node scripts/standard-site.mjs --from dist/standard-site.json --dry-run   # a local build instead
//   ATPROTO_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/standard-site.mjs
//
// Use an app password (Bluesky: Settings, Privacy and security, App passwords), never the account's.
// More than a few deletes at once (a broken build, say) are refused unless --allow-deletes is given.
import { readFile } from "node:fs/promises";

const args = process.argv.slice(2);
const dry = args.includes("--dry-run");
const allowDeletes = args.includes("--allow-deletes");
const at = args.indexOf("--from");
const from =
  at >= 0 ? args[at + 1] : "https://blog.jordansimonov.ski/standard-site.json";
const password = process.env.ATPROTO_APP_PASSWORD;
if (!dry && !password)
  throw new Error("ATPROTO_APP_PASSWORD is not set (or pass --dry-run)");

/** fetch, but never waiting minutes on a server that has stopped answering. */
const get = async (url, init = {}) => {
  const res = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`${url}: ${res.status} ${await res.text()}`);
  return res.json();
};

const manifest = /^https?:/.test(from)
  ? await get(from)
  : JSON.parse(await readFile(from, "utf8"));
if (!manifest.documents?.length)
  throw new Error(`${from} lists no posts: refusing to delete every record`);
const { did } = manifest;
const plc = await get(`https://plc.directory/${did}`);
const pds = plc.service?.find(s => s.id === "#atproto_pds")?.serviceEndpoint;
if (!pds) throw new Error(`No PDS for ${did}`);

let token;
const xrpc = (nsid, { query, body } = {}) =>
  get(`${pds}/xrpc/${nsid}${query ? `?${new URLSearchParams(query)}` : ""}`, {
    method: body ? "POST" : "GET",
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body && JSON.stringify(body),
  });

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
const deletes = writes.filter(w => w.$type.endsWith("#delete")).length;
if (deletes > 3 && !allowDeletes)
  throw new Error(
    `${deletes} posts would be deleted: rerun with --allow-deletes if that's intended`
  );
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
