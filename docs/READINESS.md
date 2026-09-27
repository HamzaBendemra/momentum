# Early-preview readiness

**Publication blocked: core browser acceptance results are pending.** Repository visibility and Pages must not change until the preview gates below pass. The formal beta release stays draft even after the preview is public.

## Candidate

- Version: `0.1.0-beta.1`; public workspace schema 1.
- Preparation started from `16b7831836fbc44a9dd9667dc0f662feaa3673f5`.
- Browser candidate commit: pending freeze after preparation checks.
- Current work changes preview disclosures, documentation, rejection fixtures and dependency notices. No runtime dependencies, storage schema or application API changes are planned.

## Gate evidence

| Gate | Status | Evidence |
| --- | --- | --- |
| Full source/history, metadata and remote-content review | In progress | Audit findings will be recorded after review completes |
| MIT and bundled dependency notices | Corrected; final check pending | Added notices for scheduler, loose-envify and js-tokens; seven production dependency packages covered |
| Clean-clone automated suite and packaging | Pending candidate run | Earlier candidate passed 23 tests; new on-disk rejection fixtures must also pass |
| Draft asset hashes | Pending candidate review | Compare all five uploaded assets with reviewed local files |
| Core Chrome acceptance | NOT RUN | All eight rows in PREVIEW_CHECK.md are pending; maintainer-reported results accepted |
| Publication / hosted smoke check | NOT RUN | Repository private, ENABLE_PAGES=false; no live-site claim |

## Browser result record

Provenance: not yet reported. Browser version, OS, test date, tested commit and per-row results are required. Agent browser access previously encountered a saved permission block; native browser availability does not establish application behaviour. Do not record a pass from automated model/storage tests or from preparing this checklist.

## Later beta work

Full browser and physical-device coverage; keyboard/screen-reader checks; date transitions and storage-failure UI; installation/offline/cache isolation; fictional walkthrough, captions and screenshots; external feedback where available. Claude Code, ChatGPT and Cowork stay unverified. Existing Codex evaluations remain applicable while the skills and method are unchanged.

No invitations, social posts or testimonials are included. MyVault, the personal website, DNS and account domain settings are outside this work.
