# Contributing

Momentum is intentionally small. Useful contributions make a goal easier to turn into a feasible outcome, preserve truthful evidence, or improve the next decision.

Read the [method](method/METHOD.md) and [architecture](docs/ARCHITECTURE.md). For a bug, open an Issue with a minimal synthetic reproduction. For a new direction, start a Discussion so we can agree on scope before implementation. Use the starter issues for work already scoped by the maintainer.

## Develop

Use Node 22.13+ or 24+. Run `npm ci`, then `npm run dev`. The app is under `/momentum/`; no environment file, account, or database service is needed. Use a branch in your fork and open a pull request to `main`.

Before submitting, run `npm run check`. For method or skill changes, run `npm run skills:build`, inspect the generated references, then `npm run skills:check`. For UI changes, follow the relevant [local checks](docs/TESTING.md) and report the browser and viewport. Do not add browser checks to GitHub Actions.

Explain the user-visible change and how you checked it. Screenshots must show fictional material. Tests should protect meaningful behaviours or data guarantees. State any migration implications and new dependencies.

## Scope

Welcome: clearer onboarding, keyboard and screen-reader improvements, recovery reliability, thoughtful examples, better evidence handling, and skill evaluations.

Deferred for v1: cloud accounts, automatic sync, built-in model calls, telemetry, native plugins, marketplaces, MCP, and automatic skill write-back. Propose a concrete problem before adding another surface or setting.

The maintainer accepts and reviews work, merges changes, and decides releases. Contributors are credited through commit and pull-request history. No CLA is required; contributions are made under the project’s MIT license. Follow the [code of conduct](CODE_OF_CONDUCT.md). Report security issues through [SECURITY.md](SECURITY.md).
