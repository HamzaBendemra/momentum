# Your data

Momentum’s application stores the workspace in IndexedDB in your browser. It has no account, backend, synchronization, model calls or automatic telemetry. Static hosting still receives ordinary page and asset requests under the host’s own policies. Clicking a GitHub link leaves the application.

The real and fictional demo workspaces use separate database names. Resetting the demo only replaces its database. Demo backups cannot be restored into a real workspace, or vice versa. Starting your own workspace starts empty.

Browser data is not an off-device backup. Clearing site data, changing browser profiles or losing the device may remove it. A persistent-storage request can reduce eviction risk when granted; it does not guarantee recovery. Export a complete JSON backup from Settings & Data and keep it somewhere you control. Backups are plain text and can contain sensitive material.

To restore, select a complete public v1 backup, inspect the preview, and explicitly replace the workspace. A recovery copy and replacement are saved transactionally. If validation or storage fails, the previous state stays intact. Download the latest recovery copy from Settings & Data to undo a mistaken restore; recovery copies remain inside that browser until downloaded.

A selected Markdown export is for sharing context with a skill or person. It cannot be imported as a backup. Inspect it before sharing. The app filters records by campaign and date; it cannot detect unrelated sensitive information you typed inside a selected note. Once you share material with an agent host, that host’s policies apply.

Anyone with access to your browser profile may be able to read your records. The app does not encrypt them or promise a secure multi-user environment. Do not post real backups in Issues. Use fictional reproductions instead.
