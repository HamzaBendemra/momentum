# Compatibility and verification

Early-preview candidate `0.1.0-beta.1`. **Not yet cleared for publication:** the guided browser results are pending. Privacy review, automated quality and core browser acceptance are the preview gates; the full browser matrix and walkthrough are later beta gates. The formal GitHub release remains draft. See [READINESS.md](READINESS.md) for the reviewed commit and current evidence.

| Surface | Status | Evidence / limits |
| --- | --- | --- |
| Clean install, lint, TypeScript and production build | Passed locally | Node 22.22.2; `npm ci`, `npm run check`; no credentials or environment file |
| Public model and IndexedDB transactions | 26 tests passed | Full local loop, reload, timezone/rest/reentry, daily completion vs evidence, priorities, archive/reopen, backup refusal and recovery, on-disk rejection fixtures, write failure, concurrent writes, demo database and navigation isolation, selected exports and decision dates |
| GitHub quality workflow | Passed at the current app commit | [Run for c05ceaf](https://github.com/HamzaBendemra/momentum/actions/runs/36300574763); latest documentation and packaging checks appear in repository Actions |
| Production app, desktop / phone / keyboard | Pending local browser verification | A saved browser permission blocks the local preview, including the renewed Chrome attempt. A guided maintainer check is prepared; no visual or interactive pass is claimed |
| Pages path, PWA installation and offline | Build configuration checked; browser behaviour pending | Generated list covers all production assets under `/momentum/`; manifest and cache scope prepared, but installation/offline behaviour is not verified |
| Codex CLI 0.149.0 | All three skills installed and behaviour checked | Disposable project `.agents/skills`; bundled methods loaded; nine raw-input scenarios evaluated; host-selected default model |
| Claude Code 2.1.226 | Behavior unverified; not a release gate | Installation instructions provided. A previous evaluation attempt stopped before inference because authentication was unavailable; no behavior pass claimed |
| Skill packaging | Passed | Canonical references match each bundle; Skill Creator validator passed for all three. Packaging now automatically rejects unexpected source files and checks every entry in all four ZIPs against the source allowlist |
| Repository/source/build/history text checks | Passed for preparation | Fresh history, explicit extraction boundary, synthetic fixtures; release scanner checks historical blobs and build text. This is not a guarantee of secret detection |
| Dependency audit | No known vulnerabilities reported | npm audit at preparation time; patched Vitest 4.1.11 used for tests |
| ChatGPT / Cowork | Unverified | Portable Markdown only; native installation and behaviour not tested |
| Safari, Firefox, Android / iOS installation | Pending host-specific tests | No broad cross-browser claim |
| External testers | Not yet recruited | Target about five willing testers; no invitations, testimonials or usage results |
| Walkthrough recording | Script prepared; recording pending | Browser verification must precede recording; see LAUNCH.md |
| Public repository, release and Pages | Not published | Repository private; `ENABLE_PAGES=false`; no live-site pass claimed |

## Codex behaviour evaluation

Each packaged skill was copied intact into a disposable project's `.agents/skills`. Codex ran in read-only mode with user configuration ignored and no application data. The prompt named the installed skill and relevant raw input file. Captured command events confirmed method-reference loading. Inputs contained no expected-answer rubric.

The three outputs are retained under [evaluations/results](../evaluations/results). Across nine scenarios the host treated rest days as valid, surfaced impossible deadlines and conflicting notes, distinguished absent records from failure, preserved source dates and labels, marked unsupported impact and testimonials, and did not follow instructions embedded in source notes. No files were edited or messages sent by the skill runs. These are observed examples, not a universal reliability guarantee.

The earlier smoke run used acceptance descriptions and is not counted as independent behaviour evidence. Retained runs use [choose-input.md](../evaluations/choose-input.md), [review-input.md](../evaluations/review-input.md), and [narrative-input.md](../evaluations/narrative-input.md); expected behaviours are separately maintained in [cases.md](../evaluations/cases.md).

## Remaining gates

For early-preview publication: complete the privacy/asset audit, final candidate checks and all eight rows of [PREVIEW_CHECK.md](PREVIEW_CHECK.md). Report maintainer-run checks separately from agent-observed checks. Keep the repository private and Pages disabled until these gates pass.

For the formal beta: finish the full TESTING.md browser matrix and the fictional walkthrough/captions, then review final release content. Safari, Firefox, physical-device, installation and offline claims require their own evidence. Claude Code, ChatGPT and Cowork remain unverified and are not release gates.

External feedback is a learning target and cannot be invented. Social posts and tester invitations are separate actions. Native plugins, marketplaces, MCP and automatic write-back are deferred.
