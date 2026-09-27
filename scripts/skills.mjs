import { mkdir, readFile, writeFile, readdir, rm, cp } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const check = process.argv.includes("--check");
const names = [
  "momentum-choose-outcome",
  "momentum-review-week",
  "momentum-build-narrative",
];
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
  `${names.length} self-contained skills ${check ? "validated" : "packaged"}.`,
);
