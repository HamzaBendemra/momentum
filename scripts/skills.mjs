import { mkdir, readFile, writeFile, readdir, rm, cp } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const check = process.argv.includes("--check");
const names = [
  "momentum-choose-outcome",
  "momentum-review-week",
  "momentum-build-narrative",
];
const skillFiles = ["LICENSE", "SKILL.md", "references/METHOD.md"];
async function listFiles(dir, prefix = "") {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${prefix}${entry.name}`;
    if (entry.isDirectory())
      files.push(...(await listFiles(`${dir}/${entry.name}`, `${path}/`)));
    else if (entry.isFile()) files.push(path);
    else throw new Error(`Unsupported skill entry: ${dir}/${entry.name}`);
  }
  return files.sort();
}
async function inspectArchive(archive, expectedFiles) {
  const entries = execFileSync("unzip", ["-Z1", archive], {
    encoding: "utf8",
  })
    .trim()
    .split("\n");
  const expectedDirectories = new Set();
  for (const path of expectedFiles.keys()) {
    const parts = path.split("/");
    for (let i = 1; i < parts.length; i++)
      expectedDirectories.add(`${parts.slice(0, i).join("/")}/`);
  }
  if (new Set(entries).size !== entries.length)
    throw new Error(`Duplicate archive entries: ${archive}`);
  for (const path of entries) {
    if (expectedDirectories.has(path)) continue;
    const source = expectedFiles.get(path);
    if (!source) throw new Error(`Unexpected archive entry: ${archive}: ${path}`);
    const actual = execFileSync("unzip", ["-p", archive, path]);
    if (!actual.equals(await readFile(source)))
      throw new Error(`Archive differs from source: ${archive}: ${path}`);
  }
  for (const path of expectedFiles.keys())
    if (!entries.includes(path))
      throw new Error(`Missing archive entry: ${archive}: ${path}`);
}
const method = await readFile("method/METHOD.md", "utf8");
const license = await readFile("LICENSE", "utf8");
for (const name of names) {
  const dir = `skills/${name}`;
  const skill = await readFile(`${dir}/SKILL.md`, "utf8");
  if (
    !skill.startsWith(`---\nname: ${name}\ndescription: `) ||
    skill.length > 12000 ||
    !/\n---\n/.test(skill)
  )
    throw new Error(`Invalid skill metadata: ${name}`);
  if (!skill.includes("references/METHOD.md"))
    throw new Error(`Missing method reference: ${name}`);
  if (check) {
    if ((await readFile(`${dir}/references/METHOD.md`, "utf8")) !== method)
      throw new Error(`Stale generated method: ${name}`);
    if ((await readFile(`${dir}/LICENSE`, "utf8")) !== license)
      throw new Error(`Missing license: ${name}`);
  } else {
    await mkdir(`${dir}/references`, { recursive: true });
    await writeFile(`${dir}/references/METHOD.md`, method);
    await writeFile(`${dir}/LICENSE`, license);
  }
  if (JSON.stringify(await listFiles(dir)) !== JSON.stringify(skillFiles))
    throw new Error(`Unexpected files in skill folder: ${name}`);
  for (const match of skill.matchAll(/\]\(([^)]+)\)/g))
    if (!match[1].includes("://")) await readFile(`${dir}/${match[1]}`);
}
if (!check) {
  await mkdir("release", { recursive: true });
  await rm("release/momentum-skills", { recursive: true, force: true });
  await mkdir("release/momentum-skills");
  for (const name of names) {
    await cp(`skills/${name}`, `release/momentum-skills/${name}`, {
      recursive: true,
    });
    await rm(`release/${name}.zip`, { force: true });
    execFileSync("zip", ["-q", "-r", `../release/${name}.zip`, name], {
      cwd: "skills",
    });
  }
  // zip paths are anchored to this repository, independent of the caller's shell.
  await rm("release/momentum-skills.zip", { force: true });
  execFileSync("zip", ["-q", "-r", "momentum-skills.zip", "momentum-skills"], {
    cwd: "release",
  });
  const combinedFiles = new Map();
  for (const name of names) {
    const individualFiles = new Map();
    for (const file of skillFiles) {
      const source = `skills/${name}/${file}`;
      individualFiles.set(`${name}/${file}`, source);
      combinedFiles.set(`momentum-skills/${name}/${file}`, source);
    }
    await inspectArchive(`release/${name}.zip`, individualFiles);
  }
  await inspectArchive("release/momentum-skills.zip", combinedFiles);
  const sums = [];
  for (const f of (await readdir("release"))
    .filter((f) => f.endsWith(".zip"))
    .sort())
    sums.push(
      `${createHash("sha256")
        .update(await readFile(`release/${f}`))
        .digest("hex")}  ${f}`,
    );
  await writeFile("release/SHA256SUMS", sums.join("\n") + "\n");
}
console.log(
  `${names.length} self-contained skills ${check ? "validated" : "packaged; all four archives match the source allowlist"}.`,
);
