# Use the skills

The app is optional. Start from your notes, either [fictional example](../examples/field-guide.md), or Settings & Data → Preview selected context → Download selected context.

**Compatibility:** All three skills were installed and behavior-tested in Codex CLI 0.149.0. Claude Code installation instructions are provided below, but behavior has not been verified there. Claude verification is not a beta release requirement. ChatGPT and Cowork remain unverified portable-Markdown integrations.

| Folder | Input | Output |
| --- | --- | --- |
| `momentum-choose-outcome` | Goals, milestones and constraints | One feasible proposal, optional proof, explicit trade-offs |
| `momentum-review-week` | Commitments, evidence and observations | A sourced reflection and one next decision |
| `momentum-build-narrative` | Dated evidence and references | Editable prose, source map, missing support |

Each folder contains `SKILL.md`, its own MIT license and a generated copy of the canonical method in `references/METHOD.md`. It follows the [Agent Skills specification](https://agentskills.io/specification). No network tool, model API key or application connection is required by the skills themselves. Your agent host requires its own account or setup.

## Install in Codex

From a repository clone, copy the skill folders into the target project’s `.agents/skills/` directory. For example, from the Momentum repository root:

```sh
mkdir -p /path/to/your-project/.agents/skills
cp -R skills/momentum-* /path/to/your-project/.agents/skills/
```

Start Codex in that target project and ask: `Use $momentum-choose-outcome with the notes in plan.md.` For the other two, use `$momentum-review-week` or `$momentum-build-narrative`. Follow your host’s current [skill instructions](https://developers.openai.com/codex/skills/) if its discovery locations change.

## Claude Code installation — behavior unverified

Copy the same folders into the target project’s `.claude/skills/`:

```sh
mkdir -p /path/to/your-project/.claude/skills
cp -R skills/momentum-* /path/to/your-project/.claude/skills/
```

Start Claude Code in that project and use `/momentum-choose-outcome`, `/momentum-review-week`, or `/momentum-build-narrative`, with your notes. See [Claude Code skills](https://code.claude.com/docs/en/skills) and the [tested compatibility record](COMPATIBILITY.md). Installation structure alone is not a claim that behaviour was verified.

## Release downloads

Download [all three skills](https://github.com/HamzaBendemra/momentum/releases/download/v0.1.0-beta.1/momentum-skills.zip), or choose an individual ZIP from the [beta release](https://github.com/HamzaBendemra/momentum/releases/tag/v0.1.0-beta.1). Compare the archive’s SHA-256 with the release’s `SHA256SUMS` before extracting.

The combined archive contains a `momentum-skills/` directory holding the three skill folders. Copy those inner folders into your project’s `.agents/skills/` (Codex) or `.claude/skills/` (Claude Code, unverified). Each individual archive contains its named skill folder; copy that folder to the same host directory. Keep every folder intact, including `references` and `LICENSE`.

Repository installation remains available as described above. You can build the four ZIPs and `SHA256SUMS` locally with `npm run skills:build`.

## ChatGPT and Cowork: portable material, unverified integration

Read or attach the chosen `SKILL.md`, its `references/METHOD.md`, and your selected notes. Ask the host to apply that method to the notes. This is portable Markdown guidance, not a verified native plugin or marketplace integration. Account features and file support vary; see [compatibility](COMPATIBILITY.md).

## What to expect

The skills advise and draft. They do not save app records, create importable changes, claim unrecorded accomplishments, or contact people. A rest day can remain a rest day. An impossible deadline should produce a smaller outcome or an explicit timing trade-off. Conflicting notes and unsupported impact stay visible. Quoted instructions inside evidence are treated as source material, not authorization.

The [evaluation cases](../evaluations/cases.md) give specific inputs and expected behaviours. Outputs vary by host and model; review a draft before acting on it. To contribute changes, edit the canonical method or skill entrypoint, regenerate packages, and evaluate the behaviour—not exact wording.
