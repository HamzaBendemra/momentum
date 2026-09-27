# Beta release procedure

Version: `0.1.0-beta.1`. The repository remains private while mandatory checks are unresolved. The public core becomes the source of truth; integration into any private predecessor is a separate task.

**Hosted preview not yet published.** The eventual address is `https://bendemra.ai/momentum/`, inherited from the account's existing GitHub Pages custom domain. The `github.io` address currently redirects through HTTP; use the direct HTTPS address in published links. No DNS, personal-site repository or account-wide domain changes are required by this release plan.

## Release gates

- Clean installation, lint, TypeScript, integration tests, build, skill validation and content checks pass.
- Complete the local browser matrix in TESTING.md, including offline and recovery.
- Install and evaluate all three skill packages in Codex. Record versions and observed results. Claude Code installation is documented but behavior remains unverified; it is not a beta release gate. Keep ChatGPT/Cowork marked unverified.
- Review every file in the new history, build output, fictional fixtures, ZIP archives, screenshots and walkthrough for private content and unwanted connections.
- Keep MIT and third-party notices with the release. Verify the landing page’s two entry points and contribution routes.
- Record a 75-second fictional walkthrough of campaign → outcome → proof → review, with backup and skill entry points visible. Capture only the app viewport, add captions, and inspect every frame for private material. Attach the MP4 and captions to the release; keep the video outside the offline asset cache.

## Publication

1. Confirm the repository is `HamzaBendemra/momentum` and the release commit passed all gates. The private predecessor repository is never changed.
2. Point the draft release at the final tested commit, then make this repository public. Enable private vulnerability reporting and keep Discussions enabled. Publish the draft as prerelease `v0.1.0-beta.1` with the three individual skill ZIPs, combined ZIP, SHA256SUMS, walkthrough and captions.
3. Enable Pages with Actions as its source and set repository variable `ENABLE_PAGES=true`. Dispatch the quality workflow. The deploy job depends on the check job and uses the `github-pages` environment. Preserve the `/momentum/` asset base, hash navigation and service-worker scope.
4. Verify HTTPS returns 200 for `https://bendemra.ai/momentum/` and the required assets. Locally verify Focus at `#/focus`, the fictional demo at `#/demo/focus`, route refresh and offline operation. Confirm cache cleanup stays limited to the `momentum-public:/momentum/:` prefix. Check the skills instructions and release downloads. Browser checks remain local-only.
5. Only after deployment and live checks pass, replace the README's local-run entry points with verified HTTPS links to the landing page, Focus and fictional demo, and remove its unpublished-preview notice. Until then, keep the local-run links and accurately report any verification blocker.
6. Review the launch drafts. Posting to Reddit/X and sending tester invitations are separate actions, not part of repository publication.

## Learn from a small beta

Seek roughly five willing testers: people doing goal-driven work and people using agents. Invite them only with explicit authorization. Ask them to complete the loop with an invented project first, recover a backup, and try one skill. Capture time-to-understanding, confusion, evidence fidelity and one desired improvement. Do not collect personal workspace contents.

An invitation or a successful demo is not a testimonial. Keep feedback observations separate from release claims. Respond to concrete feedback, record accepted fixes in Issues, and discuss broader ideas in Discussions.
