# Guided early-preview browser check

Status: **8/8 PASS — maintainer-reported on 27 September 2026.** Hamza reported all eight local checks passed and confirmed the updated navy build in a fresh disposable Chrome profile. These results were not observed by the agent. The following remains the reproducible checklist. Allow roughly 20 minutes. Use fictional data only, in a fresh disposable Chrome profile without signing in or enabling sync. Keep that profile for reload and recovery checks. Do not clear another profile's data.

The maintainer may perform this check when agent browser access is blocked. Record those results as **maintainer-reported**, never agent-observed. The saved automation restriction is not bypassed by this procedure.

## Setup and report

From the reviewed checkout, run `npm ci`, `npm run build`, then `npm run preview -- --port 4174 --strictPort`. If the agent has already started that preview, use it rather than starting a second server. Open `http://127.0.0.1:4174/momentum/#/focus` manually in the disposable profile. The real workspace should be empty; stop if unrelated records appear.

Record the commit shown in [READINESS.md](READINESS.md), test date, Chrome version (Help → About Google Chrome), desktop OS, and observed results. Keep all steps on the same calendar day; if midnight interrupts the run, report that and restart in a fresh disposable profile. Let T mean the date displayed by the app.

For each row record PASS, FAIL or NOT RUN. On failure, report the step, expected result, actual text and whether reloading changes it. Do not send a real backup. Publication requires eight passes and no unresolved core-flow, persistence, recovery or isolation failure.

## Eight checks

| ID | Actions | Expected result | Result |
| --- | --- | --- | --- |
| 1 | In onboarding, set Campaign name to **Urban tree field guide**; purpose to **Help fictional neighbours identify five trees**; First milestone to **Share a first draft**; due date to T + 14 days; Today's outcome to **A route draft ready for one fictional reader**. Inspect the detected timezone and 90-day horizon. Click **Create my workspace**. An outcome can be entered even if today is a rest day. | Campaign and milestone exist, milestone is Now, outcome is saved, and no completed demo records appear. | PASS — maintainer-reported |
| 2 | Open **Proof**. Select the field-guide campaign and first milestone. Record **Fictional route draft contains five tree descriptions**, dated T, with reference **fictional-route.md revision 1**; leave claimed impact blank. Click **Save evidence**. In **Review**, save decision **Ask one fictional reader to test the route**. Reload, then revisit Focus, Proof and Review. | Plan, saved outcome, evidence and review remain. The missing impact is not presented as a verified benefit. | PASS — maintainer-reported |
| 3 | In Focus's plan, click **Add milestone to Urban tree field guide**. Add **Test the route with a reader**, due T + 21 days; save and click its **Make Now** button. | Now changes, but today's outcome text and its association with **Share a first draft** remain intact. | PASS — maintainer-reported |
| 4 | Click **Archive campaign** on the field guide. Visit Proof and confirm its evidence remains. Return to Focus, enable **Show archived campaigns and milestones**, then click **Reopen campaign**. | Campaign returns with both milestones and history. Archiving removes active priorities; reopening need not automatically restore Now. Today's saved outcome still exists. | PASS — maintainer-reported |
| 5 | In Settings & Data, **Download full backup**, and label that downloaded file backup A. In Focus, add small task **RECOVERY-MARKER — check route labels**, associated with the field-guide campaign. In Settings, select A using **Preview a backup to restore**, inspect counts, then **Replace workspace with this backup**. Check Focus: the task is gone. Download **latest recovery copy**, preview that file and restore it; reload. | First restore returns to A; restoring its recovery copy brings the marker task back. Campaigns, milestones, evidence and review survive both restores. | PASS — maintainer-reported |
| 6 | In Settings, select each file in `examples/import-rejections/`: **malformed.json**, **unsupported-version.json**, **private-format.json**. Dismiss each error before trying the next. Revisit Focus/Proof/Review and reload afterward. | Each file produces the error described in the fixtures README; none offers a restore preview. The marker task and all earlier records remain unchanged. | PASS — maintainer-reported |
| 7 | Choose **Explore fictional demo**. Confirm the Fictional demo banner. In demo Focus add task **DEMO-ONLY-MARKER**. In demo Settings choose **Reset fictional demo**; return to demo Focus and check the task is gone. Choose **Open my real workspace**. | Reset removes only the demo marker. The real RECOVERY-MARKER and field-guide records remain, with no completed demo records transferred. | PASS — maintainer-reported |
| 8 | In real Focus add campaign **Community workshop**, purpose **EXCLUDED-CAMPAIGN-MARKER**. In Proof add evidence **OUTSIDE-RANGE-MARKER** for the field guide, dated T − 30 days, and **EXCLUDED-EVIDENCE-MARKER** for the workshop, dated T. In Settings select only the field guide, set From and Through to T, then **Preview selected context** and **Download selected context**. Open the Markdown file in a text editor. | Preview and file include the original field-guide evidence and omit the workshop name and all three excluded markers. Export is labelled context, not a restorable backup. | PASS — maintainer-reported |

Keep the fictional profile and backups until any reported defects are resolved. After a fix, rerun the affected rows on the new candidate; a storage or recovery fix also requires rows 1, 2, 5, 6 and 7.

## Recorded run

- Tested application candidate: `37e7417d26a31ff89e91f42c3778a344b7307906`; checkout `cc40852e375aa1b0116bfc95a7a4bd29e3d0cb5c` adds documentation only. The maintainer confirmed the navy build rather than quoting a commit hash.
- Report received: 27 September 2026. An exact test timestamp was not supplied.
- Local environment inspected when recording the report: Chrome `154.0.8037.57`, macOS `27.0` (build `26A428`). These versions were read from this machine, not supplied independently by the maintainer.
- Fresh disposable Chrome profile: maintainer confirmed. All eight results: PASS; no failures reported.
- Agent browser automation remains blocked; full browser/accessibility/offline checks and the separate hosted smoke check remain pending.

## Reply template

```text
Candidate commit:
Chrome version / OS:
Test date:
1: PASS / FAIL / NOT RUN
2: PASS / FAIL / NOT RUN
3: PASS / FAIL / NOT RUN
4: PASS / FAIL / NOT RUN
5: PASS / FAIL / NOT RUN
6: PASS / FAIL / NOT RUN
7: PASS / FAIL / NOT RUN
8: PASS / FAIL / NOT RUN
Failure details, if any:
```

## After hosting is enabled

Separately record a hosted smoke check against the deployed commit: open the HTTPS landing page, follow Try the app and Use the skills, inspect the labelled demo, and refresh `#/focus` and `#/demo/focus`. Confirm the same early-preview version loads and there are no missing-asset errors. Use fictional data; the hosted origin starts independently of the local preview. Do not publish hosted README entry points before this check passes.

Safari/mobile coverage, keyboard and screen-reader auditing, date transitions, storage-failure UI, installation and full offline behaviour remain in [the beta matrix](TESTING.md). Passing these eight checks does not imply those checks passed.
