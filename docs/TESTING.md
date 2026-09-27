# Local acceptance checks

Run `npm ci` from a clean checkout, then `npm run check`. Automated tests use a synthetic IndexedDB implementation (`fake-indexeddb`) to exercise actual Dexie transactions and failure rollback. No credentials are required. Use `npm run build && npm run preview` for browser checks; a development server does not install the production service worker.

Run `npm run skills:build` to package the skills. The build rejects files outside the skill allowlist and checks every ZIP entry against its source, including missing, extra and duplicate entries. CI runs this packaging check after the application checks. Review release media separately; archive validation does not verify screenshots or video.

Browser verification stays local, never in Actions or the deployment pipeline. Use fictional data in a disposable browser origin. Record browser version, viewport, build revision and results in COMPATIBILITY.md.

1. Start an empty real workspace. Create campaign → dated milestone → Now → daily outcome → evidence → weekly review. Reload and confirm definitions and records remain.
2. Change Now and confirm the saved outcome still names its original milestone. Fill three Next slots and verify a fourth is unavailable. Ship, reopen, archive and unarchive; history remains.
3. Close a day with no reflection or commitment. Check rest-day messaging. Change timezone, verify Today changes appropriately while historical dates remain. Use synthetic backup dates to test midnight rollover and returning after five days.
4. Download a full backup. Add another record, preview the earlier backup, restore it, and download the recovery copy. Restore that copy to recover the later record. Malformed JSON, unknown version, private-format fixtures and wrong workspace kind must show an error without state changes.
5. Enter the fictional demo, change it, reset it, and return to the real workspace. Confirm the real record is untouched. Export one campaign and a short date range; inspect excluded campaigns, out-of-range and unscoped notes stay out.
6. At desktop and 390px phone widths, inspect all four surfaces and the landing page. Use keyboard-only focus, native form validation and Enter/Space activation. Verify visible labels, focus indicators, no horizontal overflow, useful empty states and error announcements.
7. Simulate storage failure in a disposable local browser profile. Verify the error is visible, no success state is shown, and the last loaded data can still be backed up. Do not clear or alter someone’s real browser data.
8. Confirm `/momentum/` assets load, all hash routes refresh, the manifest has project start URL/scope and valid icons, installability checks pass, and an installed-window launch works where the browser supports it.
9. After “Offline ready,” take the test tab offline, reload directly into each hash route and exercise local edits. Reconnect. Verify service-worker cache cleanup is limited to the Momentum project prefix.

Skill checks use the actual host, a disposable project installation, and evaluations/cases.md. Keep logs out of release assets because host logs can contain machine paths or configuration details. Publish only reviewed, synthetic results. An authentication failure is a blocked check, not a successful compatibility result.
