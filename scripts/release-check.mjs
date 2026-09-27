import { readdir, readFile, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
const ignored = new Set([".git", "node_modules", "test-results", "coverage"]);
async function files(dir = ".") {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true }))
        .filter((e) => !ignored.has(e.name))
        .map(async (e) =>
          e.isDirectory() ? files(`${dir}/${e.name}`) : `${dir}/${e.name}`,
        ),
    )
  ).flat();
}
const forbiddenPaths =
  /(^|\/)(\.env[^/]*|content\.local\.js|sources|backups|supabase|\.vercel|\.netlify)(\/|$)/i;
const checks = [
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  [
    "token",
    /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|sk-(?:proj-)?[A-Za-z0-9_-]{30,})\b/,
  ],
  ["machine-path", /\/Users\/[^/\s]+\//],
  ["private-seed", /content\.local\.js/],
];
let count = 0;
function inspect(path, buf) {
  if (forbiddenPaths.test(path))
    throw new Error(`Excluded path in release: ${path}`);
  if (/\.(png|mp4|zip)$/.test(path)) return;
  const text = buf.toString("utf8");
  for (const [name, pattern] of checks)
    if (pattern.test(text))
      throw new Error(`Release check: ${name} in ${path}`);
  count++;
}
for (const file of await files()) inspect(file, await readFile(file));
let commits = [];
try {
  commits = execFileSync("git", ["rev-list", "--all"], { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);
} catch {
  /* Before the first commit, the worktree scan is the available check. */
}
const blobs = new Set();
for (const commit of commits) {
  const entries = execFileSync("git", ["ls-tree", "-r", commit], {
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .filter(Boolean);
  for (const line of entries) {
    const [head, path] = line.split("\t");
    const sha = head.split(" ")[2];
    if (forbiddenPaths.test(path))
      throw new Error(`Excluded history path: ${path}`);
    if (!blobs.has(sha)) {
      inspect(path, execFileSync("git", ["cat-file", "blob", sha]));
      blobs.add(sha);
    }
  }
}
for (const required of [
  "dist/index.html",
  "dist/sw.js",
  "dist/offline-assets.json",
  "LICENSE",
  "THIRD_PARTY_NOTICES.md",
  "docs/COMPATIBILITY.md",
])
  await stat(required);
const offline = JSON.parse(await readFile("dist/offline-assets.json"));
if (
  offline.base !== "/momentum/" ||
  !offline.cache.startsWith("momentum-public:/momentum/:") ||
  offline.assets.some((x) => !x.startsWith("/momentum/"))
)
  throw new Error("Offline asset scope escaped the project");
console.log(
  `Release content checked: ${count} text artifacts, ${commits.length} commits, ${blobs.size} historical blobs. Review media and archives separately before publishing.`,
);
