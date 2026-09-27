# Compatibility and verification

Private beta candidate `0.1.0-beta.1`, checked 27 September 2026. **Not yet cleared for publication.** The maintainer requested continued private preparation while Claude Code login is deferred.

| Surface | Status | Evidence / limits |
| --- | --- | --- |
| Clean install, lint, TypeScript and production build | Passed locally | Node 22.22.2; `npm ci`, `npm run check`; no credentials or environment file |
| Public model and IndexedDB transactions | 23 tests passed | Full local loop, reload, timezone/rest/reentry, daily completion vs evidence, priorities, archive/reopen, backup refusal and recovery, write failure, concurrent writes, demo database and navigation isolation, selected exports and decision dates |
| GitHub quality workflow | Initial build passed | [Initial run](https://github.com/HamzaBendemra/momentum/actions/runs/36295835357); latest result appears in repository Actions |
| Production app, desktop / phone / keyboard | Pending local browser verification | The browser tool denied access to the local preview; no visual or interactive pass is claimed |
| Pages path, PWA installation and offline | Build configuration checked; browser behaviour pending | Generated list covers all production assets under `/momentum/`; manifest and cache scope prepared, but installation/offline behaviour is not verified |
| Codex CLI 0.149.0 | All three skills installed and behaviour checked | Disposable project `.agents/skills`; bundled methods loaded; nine raw-input scenarios evaluated; host-selected default model |
| Claude Code 2.1.226 | Blocked by expired OAuth session | Disposable `.claude/skills` installation staged; invocation returned an authentication error before inference; no behaviour pass claimed |
| Skill packaging | Passed | Canonical references match each bundle; Skill Creator validator passed for all three; four ZIP archives contain only source-identical skill files and licenses |
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

## Remaining release gates

1. Sign in to Claude Code and repeat all three installed-skill evaluations.
2. Allow local browser access and complete TESTING.md, including storage failure, phone, keyboard, installation and offline checks. Fix demonstrated failures.
3. Record and inspect the 75-second fictional walkthrough.
4. Recheck the final source history, build, archives and media. Update this record to actual results.
5. Publish only after mandatory gates pass and the maintainer is ready to leave private preparation. Then enable Pages and verify live routes and release downloads.

External feedback is a learning target; it must not be invented to clear a gate. Social posting and tester invitations remain separate actions. Native plugins, marketplace submissions, MCP and automatic write-back are deferred.
