# Synthetic import rejection fixtures

These are deliberately invalid imports, never recovery files. Use them only in the disposable fictional workspace from [the guided check](../../docs/PREVIEW_CHECK.md).

- `malformed.json`: deliberately incomplete JSON; expect “This is not a valid JSON backup”.
- `unsupported-version.json`: an otherwise empty public workspace in an unsupported version 2 envelope; expect the unsupported-backup error.
- `private-format.json`: a fabricated predecessor-style envelope with empty records and no public format marker; expect the unsupported-backup error. It is not copied from a real backup and does not claim to reproduce every private-format variant.

Selecting each file must show an error, offer no restore preview and leave records unchanged. Never edit these fixtures into a recovery backup or use a real private backup for testing.
