# Early-preview readiness

**Publication blocked: core browser acceptance results are pending.** Repository visibility and Pages must not change until the preview gates below pass. The formal beta release stays draft even after the preview is public.

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
| Original candidate GitHub CI | Passed for c05ceaf; navy candidate pending CI | [Run 36300574763](https://github.com/HamzaBendemra/momentum/actions/runs/36300574763); quality passed, deployment skipped |
| Core Chrome acceptance | NOT RUN | All eight rows in PREVIEW_CHECK.md are pending; maintainer-reported results accepted |
| Publication / hosted smoke check | NOT RUN | Repository private, ENABLE_PAGES=false; no live-site claim |

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
- Visual browser checks of all surfaces, hover/focus and narrow layouts remain blocked by the saved browser permission restriction. All eight core acceptance checks remain NOT RUN. Do not treat this palette change or the automated suite as satisfying those checks.
- The repository remains private, Pages disabled, and the existing beta release draft. The earlier audit and draft asset hashes remain historical evidence; recheck the complete publication candidate before changing visibility.

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

Provenance: not yet reported. Browser version, OS, test date, tested commit and per-row results are required. Agent browser access previously encountered a saved permission block; native browser availability does not establish application behaviour. Do not record a pass from automated model/storage tests or from preparing this checklist.

## Later beta work

Full browser and physical-device coverage; keyboard/screen-reader checks; date transitions and storage-failure UI; installation/offline/cache isolation; fictional walkthrough, captions and screenshots; external feedback where available. Claude Code, ChatGPT and Cowork stay unverified. Existing Codex evaluations remain applicable while the skills and method are unchanged.

No invitations, social posts or testimonials are included. MyVault, the personal website, DNS and account domain settings are outside this work.
