# Architecture

One npm project, four application surfaces, one canonical method, three independently distributable skills.

| Path | Responsibility |
| --- | --- |
| `app/src/model.ts` | Public schema v1, reference integrity, dates, priority and rollover rules |
| `app/src/repository.ts` | Dexie database, transaction boundaries, full backup validation and recovery |
| `app/src/Focus.tsx` | First use, plan authoring, daily outcome, priorities, tasks, closure and rollover |
| `app/src/Proof.tsx`, `Review.tsx` | Evidence, narrative and weekly decisions |
| `app/src/Settings.tsx`, `export.ts` | Rhythm settings, recovery and explicitly scoped context |
| `app/src/App.tsx` | Landing, hash navigation, isolated workspace selection and live subscriptions |
| `method/METHOD.md` | Canonical method text |
| `skills/*/SKILL.md` | Three concise skill entrypoints |
| `scripts/skills.mjs` | Copy canonical references, validate and package standalone folders |
| `scripts/offline.mjs` | Generate a complete build-specific, project-scoped offline asset list |

React and TypeScript render the UI; Vite builds static assets at `/momentum/`. Hash routes make refresh independent of server rewrites. Dexie wraps IndexedDB; Zod validates records and full snapshots. There is no backend or API key.

## Persistence

`momentum-public-v1-real` and `momentum-public-v1-demo` are separate databases. Each has a singleton `state` row containing the entire workspace and a `recovery` table containing up to five previous restore snapshots. A whole-document snapshot makes this first version easy to inspect and atomically replace. Very large workspaces may eventually justify normalized tables; v1 does not promise unlimited scale.

Mutations read the latest workspace inside a read/write transaction, apply a bounded change, validate the complete result, increment its revision and put it back. Concurrent tabs therefore serialize writes. Dexie live queries update each view. Invalid references or failed writes abort the transaction. The UI keeps the last successfully loaded workspace and reports failures instead of pretending a save succeeded.

Campaigns and milestones have stable IDs and archived flags. Shipping removes a milestone from active priorities without removing records. Reopening does not auto-promote it. Schedule changes and rollover decisions are historical records. Commitments retain their milestone and text even when Now changes. Day closure is neither a completion assertion nor a daily grade.

## Public data contract

Workspace `schemaVersion: 1` covers `settings`, `campaigns`, `milestones`, `priorities`, `commitments`, `evidence`, `reviews`, `closures`, `rollovers`, `schedule`, and `tasks`. `kind` identifies real or demo content. `revision` is an internal write counter. Calendar dates are ISO dates in the workspace’s configured timezone; historical dates are not reinterpreted when the timezone changes. Timestamps use ISO instants.

A backup envelope has `format: "momentum-public-workspace"`, `version: 1`, `exportedAt`, and the complete `workspace`. Unknown fields, unsupported versions, invalid dates, duplicate IDs, dangling references, overfull priorities and mismatched demo/real kinds are rejected. The import limit is 20 MB. A recovery copy and the replacement write commit in one transaction. There is no compatibility obligation with private predecessor backups.

Markdown context is a distinct read-only interface. It includes selected campaign definitions plus records in the selected date interval. Unscoped records and mixed-scope reflections that include an excluded campaign are omitted. A dated record can mention the current state of a milestone; the export says that definitions are current. Free-text notes may themselves mention other topics: users must inspect the preview before sharing.

## Offline and deployment

The build generates all precached URLs, including JS, CSS, index, manifest and icons. Cache names start with `momentum-public:/momentum/:`; activation deletes only older caches with that prefix. Fetch handling is limited to this origin’s `/momentum/` path. Installation finishes only after the complete cache is stored. Browser storage can still be cleared or evicted; backups remain necessary.

GitHub Actions runs quality checks before a Pages deployment. The deploy job requires a public repository and `ENABLE_PAGES=true`; it stays disabled during private preparation. Browser tests remain local-only.
