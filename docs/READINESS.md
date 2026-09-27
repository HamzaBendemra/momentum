# Early-preview readiness

**Public early preview published on 27 September 2026.** Eight core browser checks passed according to the maintainer; the agent observed the separate hosted smoke check passing. The formal beta release remains draft.

## Candidate

- Version: `0.1.0-beta.1`; public workspace schema 1.
- Preparation started from `16b7831836fbc44a9dd9667dc0f662feaa3673f5`.
- Browser candidate commit: `37e7417d26a31ff89e91f42c3778a344b7307906` (light navy palette). The production preview has been rebuilt from this application code. Subsequent evidence-only documentation commits do not change that browser candidate.
- This candidate replaces purple presentation with a light navy palette, updates favicon/install icons and browser theme colours, and retains version `0.1.0-beta.1`. No runtime dependencies, storage schema, application APIs or workspace records changed.

Review date: 27 September 2026. The original full audit below applies to `c05ceafe24ca7171382993aa6fdbfa4705b956a5` and its five-commit history. The navy candidate has the incremental review recorded below; original clean-clone and CI evidence is not represented as a new-candidate run.

## Gate evidence

| Gate | Status | Evidence |
| --- | --- | --- |
| Full source/history, metadata and remote-content review | Passed for the reviewed candidate | Five commits / 102 historical blobs scanned; current application, removed historical content, examples, evaluation records, manifests and scripts reviewed. No private-content findings in the reviewed material |
| MIT and dependency notices | Passed after correction | Retained the exact license texts for all seven production packages and verified notices/LICENSE are copied into the build |
| Clean-clone automated suite and packaging | Passed | Node 22.22.2; npm ci, npm run check, npm run skills:build and release:check; 26 tests pass, including all three on-disk rejection files. npm reported zero known vulnerabilities |
| Draft asset hashes | Passed | All four ZIPs match the source allowlist; five uploaded asset hashes match the reviewed local files. Draft notes match the checked-in text |
| Navy candidate GitHub CI | Passed | [Run 36304213179](https://github.com/HamzaBendemra/momentum/actions/runs/36304213179) at cc40852; quality passed, deployment skipped |
| Core Chrome acceptance | 8/8 PASS — maintainer-reported | Navy build and fresh disposable Chrome profile confirmed; environment and provenance recorded in PREVIEW_CHECK.md. Not agent-observed |
| Publication / hosted smoke check | Passed | Repository public; private vulnerability reporting enabled; Pages workflow deployed d076e02; HTTPS assets and Chrome navigation/refresh verified |

## Audit scope and findings

- Every reachable commit uses the intended public author identity and GitHub noreply address. The repository has fresh Momentum history; no private predecessor history was imported. The historical review includes content removed by later commits, not just the current tree.
- Examples, demo records, tests and retained skill outputs describe fictional field-guide/workshop scenarios. The intentionally invalid private-format fixture is fabricated with empty arrays, never derived from a real backup.
- Reviewed six GitHub issue bodies with no comments, zero Discussions and zero pull requests. All five completed workflow logs, including the candidate run, contained no matches for the checked credential/private-content patterns. There were no stored Actions artifacts. Draft notes and archive entries were inspected.
- Corrected two readiness findings: unpublished-release download links in the app/skills documentation, and missing transitive-dependency notices for scheduler 0.23.2, loose-envify 1.4.0 and js-tokens 4.0.0. No dependency versions or application/storage interfaces changed. Existing skill/method bytes and Codex evaluation inputs/outputs are unchanged.
- Runtime source has no backend, telemetry, model calls or external asset loads. GitHub links are explicit navigation. Library diagnostic/schema URLs in the bundle do not initiate application network calls. Production fetch handling is same-origin and limited to `/momentum/`.
- The generated offline manifest lists all 10 precached assets under `/momentum/`; cache cleanup is restricted to `momentum-public:/momentum/:`. This is a source/build inspection, not a claim that browser offline behaviour passed.
- The two PNG icons and SVG contain only the original Momentum mark. PNG chunks are IHDR/IDAT/IEND with no textual or EXIF metadata. No screenshots or recordings are included. All dependency resolutions use registry.npmjs.org; the lockfile's install scripts belong to esbuild and fsevents.

These checks reduce publication risk; finite scans and manual review are not a guarantee of secret detection or a security certification. Recheck any new commits and assets before publication.

## Navy candidate verification

- Reviewed the incremental source diff: shared CSS colour variables, HTML/manifest theme colours, and the same SVG mark rasterized at 192 and 512 pixels. White surfaces, typography, layout and warm error styling are retained. No skill, method, evaluation or draft-release archive bytes changed.
- `npm run check` passed locally on Node 22.22.2: lint, TypeScript, all 26 tests, production build, skill validation and release-content checks. No new dependencies or data migrations.
- Calculated contrast: white on navy 11.25:1; white on hover 14.23:1; slate text on pale blue 5.46:1; ink on pale blue 12.62:1; focus blue on pale blue 4.90:1. Functional control borders use a darker slate than decorative borders and reach 3.34:1 against pale blue. These are palette calculations, not a browser accessibility audit.
- Source and built CSS/HTML/manifest/SVG inspected for previous purple literals: none remain. Both PNGs were regenerated from the unchanged SVG geometry; the 512-pixel icon was visually inspected. Generated metadata was stripped; only IHDR, IDAT and IEND chunks remain.
- New production cache: `momentum-public:/momentum/:2167653d73362e0b`; 10 assets. The existing build generator and `/momentum/` scope/cleanup rules are unchanged.
- Agent visual browser checks remain blocked by the saved permission restriction. The maintainer subsequently reported all eight core checks passed and confirmed the navy build in a fresh disposable Chrome profile. This does not claim that the full accessibility, narrow-layout or offline matrix passed.
- At the navy preparation stage the repository remained private and Pages disabled. Publication subsequently passed the checks recorded below; the existing beta release stays draft.

## Publication recheck

On 27 September 2026, a fresh clone of cc40852 passed npm ci, npm run check (26 tests), skill packaging and release-content validation; the tree stayed clean and npm reported zero known vulnerabilities. The generated cache matches the navy build above. All eight reachable commits / 111 historical blobs passed the content scanner; incremental source and icon changes were reviewed. Both subsequent workflow logs were scanned without findings. Six issue bodies remain synthetic with no comments; there are no PRs, Discussions or Actions artifacts. All five existing draft asset hashes still match GitHub digests. The original dependency notices, method, skill sources and evaluation records are unchanged.

## Draft asset SHA-256 record

The draft remains unpublished. Hashes verified against GitHub asset digests on 27 September 2026:

```text
05143a2d7ce752c5502433570ea50aedf80de340ca39fb8fae97218069d2a84b  SHA256SUMS
18fe921b710f39c314783c9b87ec521d6ff2a591df6a652b17c1d90226fa4350  momentum-build-narrative.zip
dbe53357ce4561c248e7790ee6cb53d6451f00a747a8e2c941388ea0abb51357  momentum-choose-outcome.zip
16bcf7123cf8bfd9ad286a7211291f721cd4336ee0024c4f66f0f1e10c1bb847  momentum-review-week.zip
05a9d407dc69068379b20db0d435f14534e73148f9aee7753f246f49119922b1  momentum-skills.zip
```

## Browser result record

Provenance: maintainer-reported on 27 September 2026, eight passes and no failures reported. The maintainer confirmed the navy build and fresh disposable Chrome profile. Chrome 154.0.8037.57 and macOS 27.0 (26A428) were inspected on this machine; exact test timestamp and hash were not independently supplied. The applicable application commit is 37e7417, with documentation-only checkout cc40852. See PREVIEW_CHECK.md for the full record. Agent access to the local preview remains blocked. The core local passes are maintainer-reported; the separate hosted observations below are agent-observed.

## Hosted publication result

- Published commit: `d076e021e91161ce25962b91ea62ff33ecf68fa9`; application bytes match navy candidate `37e7417`. [Final private CI](https://github.com/HamzaBendemra/momentum/actions/runs/36306150101) passed before the visibility change; its log was scanned without findings.
- Repository visibility is public, private vulnerability reporting is enabled, and `ENABLE_PAGES=true`. [Quality-gated deployment](https://github.com/HamzaBendemra/momentum/actions/runs/36306222641) passed. The existing beta release and all packaged downloads remain draft/unpublished.
- Direct HTTPS at `https://bendemra.ai/momentum/`, all ten precache entries, service worker and offline manifest returned 200 and matched local build bytes. No DNS, account-domain or personal-site changes were made.
- Agent-observed hosted Chrome smoke check on 27 September 2026: landing renders; Try the app opens empty onboarding; Focus refresh works; demo is explicitly fictional and refreshes correctly; Use the skills displays all three repository installation links and honest compatibility disclosures. Early-preview version `0.1.0-beta.1` is displayed. The navy landing page was visually inspected.
- The local automation block remains; the hosted address is accessible. This hosted navigation check does not replace the maintainer's eight core checks and does not establish offline, installation, Safari/mobile or accessibility support.
- Non-blocking observation: landing/skills can retain the previous workspace browser-tab title after client-side navigation. Visible page content and routes render correctly; a title update is later polish.
- README hosted links were restored only after these checks. Subsequent publication-record edits do not change the application build.

## Later beta work

Full browser and physical-device coverage; keyboard/screen-reader checks; date transitions and storage-failure UI; installation/offline/cache isolation; fictional walkthrough, captions and screenshots; external feedback where available. Claude Code, ChatGPT and Cowork stay unverified. Existing Codex evaluations remain applicable while the skills and method are unchanged.

No invitations, social posts or testimonials are included. MyVault, the personal website, DNS and account domain settings are outside this work.
