# Early preview and beta release procedure

Version: `0.1.0-beta.1`. The early preview opens the source and hosted app after privacy, automated quality and core browser checks pass. The formal GitHub beta release stays in draft. The public core becomes the source of truth; integrating changes into the private predecessor is separate work.

**Hosted preview not yet published.** The eventual address is `https://bendemra.ai/momentum/`, inherited from the account's existing GitHub Pages custom domain. Link directly to HTTPS. Do not change DNS, the personal-site repository or account-wide domain settings.

## Early-preview publication gates

- Review all reachable source history and metadata, examples, evaluation results, build assets, skill ZIPs, GitHub issues/discussions, workflow logs/artifacts and draft-release contents. Resolve private-content findings before publication. Keep original MIT and all required dependency notices, including transitive dependencies.
- From a clean checkout, pass installation, lint, TypeScript, tests, production build, skill validation/packaging and release-content checks. Verify draft archive checksums against the reviewed local assets.
- Complete all eight rows of [the guided browser check](PREVIEW_CHECK.md) using fictional data. Maintainer-reported results are acceptable and must be labelled as such. Unresolved core-flow, persistence, recovery, isolation or misleading-success failures block publication.
- Align README, app/skills pages, security guidance and compatibility claims to **early preview**. Keep installation instructions usable from repository folders while release downloads remain unpublished.
- Record the reviewed commit and results in [READINESS.md](READINESS.md). A changed application requires rerunning affected browser checks and the automated suite. Changed skills/method require relevant host evaluations; unchanged skills retain the existing Codex evidence.

## Publish the early preview

1. Push the reviewed candidate to `HamzaBendemra/momentum` main and require successful CI. MyVault remains private and unchanged.
2. Make Momentum public and enable private vulnerability reporting. Keep Discussions and the six starter issues available. Retain `v0.1.0-beta.1` as a draft release; do not create a public release tag or advertise its downloads yet.
3. Enable Pages with GitHub Actions as its source, set `ENABLE_PAGES=true`, then dispatch the quality workflow. Deployment continues to depend on quality checks. Preserve the `/momentum/` asset base, hash routes and service-worker scope; cleanup must stay within `momentum-public:/momentum/:` caches.
4. Verify HTTPS returns 200 for the landing page and required assets, then complete the hosted smoke check in PREVIEW_CHECK.md. Confirm the deployed commit/version, landing, Focus, fictional demo, skills links and hash-route refresh. Browser checks remain local-only.
5. Only after hosting passes, replace the README's unpublished-hosting notice and local entry points with verified HTTPS landing/app/demo links. Keep the early-preview and unverified-capability disclosures. If deployment fails, retain local-run instructions and fix the deployment before advertising availability.

## Later formal beta gates

- Complete the full TESTING.md browser matrix, including desktop/phone, keyboard, failure states, date transitions, installation, offline use and cache isolation. Do not claim untested platforms.
- Produce and inspect the 75-second fictional walkthrough, captions and screenshots. Keep the video outside the offline asset cache.
- Recheck final history, build, archives and media. Point the draft release at the final tested commit; publish the prerelease with skill ZIPs, checksums, walkthrough and captions only after these gates pass.
- Codex skills are tested. Claude Code, ChatGPT and Cowork remain unverified and do not block release. External feedback is a learning target, never invented evidence.

## Feedback and promotion

Seek roughly five willing testers after separate invitation authorization. Ask them to try an invented project, backup recovery and a skill; record confusion and failures without collecting personal workspaces. Use Discussions for questions and Issues for accepted work. No testimonials or usage results are implied.

The launch kit contains drafts only. Posting to Reddit/X and sending invitations are separate from repository publication. No automatic messages or scheduled outreach are included.
