# Momentum 0.1.0-beta.1

Turn a goal into today’s outcome—and a record of what changed.

The first public beta pairs a local browser application with three portable agent skills. [Try the app](https://bendemra.ai/momentum/#/focus), [explore the fictional demo](https://bendemra.ai/momentum/#/demo/focus), or [install the skills](https://github.com/HamzaBendemra/momentum/blob/main/docs/SKILLS.md).

## Included

- **Focus:** editable campaigns and milestones, one Now / three Next, daily outcomes, small tasks, rollover and easy closure.
- **Proof and Review:** dated evidence, accomplishment narratives, weekly decisions and reflection history.
- **Settings & Data:** workdays/timezone, full backups with transactional recovery, selected Markdown context and an isolated fictional demo.
- **Three skills:** choose an outcome, review the week and build a sourced narrative. Each includes the canonical method reference and MIT license.
- A light navy interface, fictional examples, six starter issues, Discussions and contributor guidance.

## Downloads

`momentum-skills.zip` contains all three skills. The individual ZIPs contain one skill each. Compare downloaded files with `SHA256SUMS`, extract them, then copy the named skill folders into your project’s `.agents/skills/` directory for Codex. Keep each skill’s references and license intact. See the installation guide for the archive layout and other hosts.

## Verified

- Clean installation, lint, TypeScript, all 26 tests, production build, skill packaging and release-content checks.
- All eight core local browser acceptance checks passed according to the maintainer, using the navy build in a fresh Chrome profile. These are maintainer-reported, not agent-observed.
- Hosted HTTPS assets, landing/app/demo/skills navigation and Focus/demo refresh were checked by the agent.
- All three skills were installed and evaluated in Codex CLI 0.149.0. Skills and method are unchanged from those evaluations.

See the [readiness record](https://github.com/HamzaBendemra/momentum/blob/main/docs/READINESS.md) and [compatibility record](https://github.com/HamzaBendemra/momentum/blob/main/docs/COMPATIBILITY.md) for provenance and limits.

## Known limitations and next work

This is a prerelease. The maintainer chose to release beta.1 with the broader desktop/mobile/accessibility, failure-state, installation and offline browser matrix still incomplete. The fictional walkthrough is also pending. No passing result is implied for those checks.

Claude Code, ChatGPT and Cowork remain unverified. Landing/skills may retain the previous workspace browser-tab title after navigation; the page content and routes load correctly. External feedback is still to be gathered; no testimonials or usage results are claimed.

## Your data and contributions

Data stays in this browser and origin. Keep full backups outside the browser for recovery or transfer; Markdown context is not a restorable backup. There are no accounts, backend, cloud sync, embedded AI calls or automatic telemetry. Private predecessor backups are unsupported.

Original code, method, documentation and skills are MIT licensed, with dependency notices retained. Start with a [good first issue](https://github.com/HamzaBendemra/momentum/labels/good%20first%20issue), ask a question in [Discussions](https://github.com/HamzaBendemra/momentum/discussions), and use synthetic reproductions. Report security issues through private vulnerability reporting.
