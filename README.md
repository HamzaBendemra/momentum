# Momentum

**Turn a goal into today’s outcome—and a record of what changed.**

A quiet local application and three portable agent skills, built around the same method: choose a finish, keep the evidence, and make a better next decision.

| Try the app | Use the skills |
| --- | --- |
| [Try the app](https://bendemra.ai/momentum/#/focus) · [Fictional demo](https://bendemra.ai/momentum/#/demo/focus) · [Overview](https://bendemra.ai/momentum/) | [Install the three skills](docs/SKILLS.md) · [Read the method](method/METHOD.md) |
| A visual workspace for campaigns, daily outcomes, proof and weekly decisions. | Use your existing notes or a selected app export. Tested in Codex; Claude Code behavior is unverified. |

**Public early preview:** Source and the hosted app are available. Privacy and automated checks passed, the eight core local browser checks are maintainer-reported passes, and hosted navigation/refresh checks passed. The formal beta release and packaged downloads remain unpublished until the broader beta checks are complete. See [compatibility and validation](docs/COMPATIBILITY.md) for actual results, including any blockers. No external user outcomes or testimonials are claimed.

## The loop

1. Give a campaign a purpose and a dated milestone. Choose one milestone Now, with up to three Next.
2. Write one outcome for today. Proof details and supporting tasks are optional.
3. Record what happened and where someone can inspect it. Keep claimed impact separate from evidence.
4. Close the day easily. Review the week to choose one adjustment.

Campaign planning is inside **Focus**. **Proof** keeps evidence and exports a narrative. **Review** puts the next decision before statistics. **Settings & Data** handles the schedule, selected context and complete backups.

Rest days need no commitment. Returning after time away needs no catch-up ritual. A saved outcome survives a change of strategic priority.

## Run locally

Requires Node.js 22.13+ (22.x) or 24+, npm, and Git. No credentials or environment variables.

```sh
git clone https://github.com/HamzaBendemra/momentum.git
cd momentum
npm ci
npm run dev
```

Open the printed URL at `/momentum/`. Use that same server address and port with these paths:

- Focus: `/momentum/#/focus` — start your own empty workspace.
- Fictional demo: `/momentum/#/demo/focus` — explore the separate example workspace.

For the production build and offline behaviour:

```sh
npm run build
npm run preview
```

Open the preview server's printed URL with either path above. The [hosted early preview](https://bendemra.ai/momentum/) uses the same application build.

Your workspace is stored in IndexedDB in that browser and origin. The local development URL, preview URL and hosted URL are separate origins; use a complete backup to transfer records. The demo uses a separate database. No account, backend, cloud sync, embedded AI calls or automatic telemetry is included. Keep backups outside the browser. See [privacy and recovery](docs/PRIVACY.md).

## Contribute

Start with [CONTRIBUTING.md](CONTRIBUTING.md), [architecture](docs/ARCHITECTURE.md), and the [scoped starter issues](https://github.com/HamzaBendemra/momentum/labels/good%20first%20issue). Questions and proposals belong in [Discussions](https://github.com/HamzaBendemra/momentum/discussions); Issues track accepted work and reproducible bugs. Share synthetic reproductions, never a personal workspace backup.

```sh
npm run check
npm run skills:build
```

CI checks installation, lint, TypeScript, unit/integration tests, build, skill packages and release contents. Browser checks are local only. The [local acceptance checklist](docs/TESTING.md) covers desktop, phone, keyboard, storage failures and offline behaviour.

Two fictional plans are included: [urban tree field guide](examples/field-guide.md) and [community repair workshop](examples/community-workshop.md). Read the [release plan](docs/RELEASE.md) for remaining gates and the [launch kit](docs/LAUNCH.md) for unposted announcement drafts.

Original code, method, documentation and skills: [MIT](LICENSE). Dependency notices: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
