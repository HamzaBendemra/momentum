import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
// Keep the original license and production dependency notices with hosted assets.
for (const name of ["LICENSE", "THIRD_PARTY_NOTICES.md"])
  await writeFile(`dist/${name}`, await readFile(name));
async function files(dir) {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map(async (e) =>
        e.isDirectory() ? files(`${dir}/${e.name}`) : `${dir}/${e.name}`,
      ),
    )
  ).flat();
}
const paths = (await files("dist"))
  .filter((p) => !p.endsWith("/sw.js") && !p.endsWith("/offline-assets.json"))
  .sort();
const hash = createHash("sha256");
for (const p of paths) hash.update(p).update(await readFile(p));
const base = "/momentum/";
const assets = [base, ...paths.map((p) => base + p.slice(5))];
const prefix = `momentum-public:${base}:`;
const cache = prefix + hash.digest("hex").slice(0, 16);
await writeFile(
  "dist/offline-assets.json",
  JSON.stringify({ base, cache, assets }, null, 2),
);
await writeFile(
  "dist/sw.js",
  `/* Generated from every production asset. Scope and cache ownership are project-specific. */
const BASE=${JSON.stringify(base)}, PREFIX=${JSON.stringify(prefix)}, CACHE=${JSON.stringify(cache)}, ASSETS=${JSON.stringify(assets)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(BASE))return;
  if(event.request.mode==='navigate') { event.respondWith(fetch(event.request).catch(()=>caches.open(CACHE).then(cache=>cache.match(BASE))));return; }
  if(ASSETS.includes(url.pathname)) event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(url.pathname))||fetch(event.request)));
});
`,
);
console.log(`Offline cache generated: ${assets.length} assets, ${cache}`);
