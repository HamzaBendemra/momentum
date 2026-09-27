# Beta release procedure

Version: `0.1.0-beta.1`. The repository remains private while mandatory checks are unresolved. The public core becomes the source of truth; integration into any private predecessor is a separate task.

## Release gates

- Clean installation, lint, TypeScript, integration tests, build, skill validation and content checks pass.
- Complete the local browser matrix in TESTING.md, including offline and recovery.
- Install and evaluate all three skill packages in Codex and Claude Code. Record versions and observed results. Keep ChatGPT/Cowork marked unverified.
- Review every file in the new history, build output, fictional fixtures, ZIP archives, screenshots and walkthrough for private content and unwanted connections.
- Keep MIT and third-party notices with the release. Verify the landing page’s two entry points and contribution routes.
- Record a 75-second fictional walkthrough of campaign → outcome → proof → review, with backup and skill entry points visible.

## Publication

1. Confirm the repository is `HamzaBendemra/momentum` and the release commit passed all gates. The private predecessor repository is never changed.
2. Make this repository public. Enable private vulnerability reporting and Discussions. Create a prerelease tagged `v0.1.0-beta.1` with the three individual skill ZIPs, combined ZIP, SHA256SUMS and walkthrough.
3. Enable Pages with Actions as its source and set repository variable `ENABLE_PAGES=true`. Dispatch the quality workflow. The deploy job depends on the check job and uses the `github-pages` environment.
4. Verify the landing, app, demo, skills instructions and downloads at the live URLs. Recheck a route refresh and offline cache.
5. Review the launch drafts. Posting to Reddit/X and sending tester invitations are separate actions, not part of repository publication.

## Learn from a small beta

Seek roughly five willing testers: people doing goal-driven work and people using agents. Invite them only with explicit authorization. Ask them to complete the loop with an invented project first, recover a backup, and try one skill. Capture time-to-understanding, confusion, evidence fidelity and one desired improvement. Do not collect personal workspace contents.

An invitation or a successful demo is not a testimonial. Keep feedback observations separate from release claims. Respond to concrete feedback, record accepted fixes in Issues, and discuss broader ideas in Discussions.
