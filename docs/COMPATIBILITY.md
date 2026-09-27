# Compatibility and verification

This record distinguishes completed checks from planned support. Initial beta preparation: 27 September 2026. Update this file with observed results before publication; do not infer a pass from installation alone.

| Surface | Status | Evidence / limits |
| --- | --- | --- |
| Public model and IndexedDB transactions | Initial 19 tests passed | References, full loop, reload, timezone/rest/reentry, priority bounds, archive/reopen, backup refusal and recovery, write failure, concurrent writes, demo isolation and scoped exports |
| Production app, desktop / phone / keyboard | Pending local verification | Browser tests are deliberately excluded from CI |
| Pages path, PWA installation and offline | Pending | Build generates the complete project-scoped cache list |
| Codex CLI 0.149.0 | Choose-outcome installed and tested; other skills pending | Disposable project `.agents/skills`; method reference loaded; rest-day, impossible deadline and conflicting/hostile notes handled |
| Claude Code 2.1.226 | Blocked by expired OAuth session | Installation staged in disposable `.claude/skills`; no behaviour pass claimed |
| ChatGPT / Cowork | Unverified | Portable Markdown only; native installation and behaviour not tested |
| Safari, Firefox, Android / iOS installation | Pending host-specific tests | No broad cross-browser claim |
| External testers | Not yet recruited | Target about five willing testers; no testimonials or usage results |

Publication requires the mandatory app checks and both verified skill hosts. External feedback is a learning target, not fabricated evidence. Native plugins, marketplace submissions, MCP and automatic write-back are deferred.
