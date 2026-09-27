# Release procedure

Current release: **0.1.0-beta.1**, a public prerelease. The [hosted app](https://bendemra.ai/momentum/) uses `/momentum/`, hash routes and project-scoped service-worker caches. No DNS, personal-site repository or account-wide domain changes are needed.

## Beta.1 release decision

On 27 September 2026, after the early preview passed privacy review, automated quality, eight maintainer-reported core browser checks and agent-observed hosted smoke checks, the maintainer explicitly requested beta publication. The broader browser matrix and fictional walkthrough are follow-up work rather than beta.1 publication gates. Unperformed checks remain visibly unverified. This supersedes the earlier procedure that kept the formal beta draft until all those tasks were complete.

## Prepare a release

1. Review the complete candidate history and metadata, examples, evaluations, build assets, skill archives and any new media for private content. Keep original MIT and required dependency notices. Resolve actual privacy, licensing and data-integrity findings before release.
2. Pass clean installation and `npm run check`, including lint, TypeScript, tests, build, skill validation and release-content checks. Build and inspect the four skill archives, validate their entries against source and verify uploaded SHA-256 digests. Unchanged, previously validated archives may be retained after rechecking their contents and hashes.
3. Record the candidate and actual browser evidence in READINESS.md and COMPATIBILITY.md. Repeat checks affected by application changes. Reevaluate skills when the canonical method or skill instructions change; otherwise retain the existing Codex results.
4. Align the app, README, installation guide and release notes to the release’s actual status and limitations. Keep social posts and tester invitations separate from repository/release publication.
5. Push the reviewed candidate to main and require successful CI. Point the release/tag at that exact commit, publish as a prerelease with skill ZIPs and checksums, then verify public release metadata and downloads. Never claim that a draft asset link is public.
6. Verify quality-gated Pages deployment and hosted HTTPS assets/navigation. Keep the current project base and cache prefix; do not change stored workspace data, schemas or dependencies solely for release packaging.

## Follow-up work

Complete the local TESTING.md matrix: full desktop/phone/keyboard and screen-reader coverage, failure states, date transitions, installation, offline use and cache isolation. Produce and inspect the 75-second fictional walkthrough, captions and screenshots before sharing them. Keep browser checks out of CI and walkthrough media outside the offline cache.

Claude Code, ChatGPT and Cowork remain unverified. Seek feedback from roughly five willing testers only after separate invitation authorization; report real observations, never invented outcomes. Reddit/X posts and invitations remain unperformed drafts.

MyVault, the personal website, DNS and account-wide domain settings remain outside the release process.
