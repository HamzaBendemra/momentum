import { useState } from "react";
import { addDays, settingsSchema, type Backup } from "./model";
import {
  encodeBackup,
  parseBackup,
  replaceWorkspace,
  type WorkspaceDB,
} from "./repository";
import { contextMarkdown, download, selectContext } from "./export";
import { demoWorkspace } from "./demo";
import { Workdays } from "./Focus";
import { Field, Header, Scope, submit, value, type ViewProps } from "./ui";
export default function Settings({
  w,
  date,
  act,
  db,
  report,
}: {
  db: WorkspaceDB;
  report: (text: string, error?: boolean) => void;
} & ViewProps) {
  const [restore, setRestore] = useState<Backup | null>(null);
  const [ids, setIds] = useState(w.campaigns.map((c) => c.id));
  const [from, setFrom] = useState(addDays(date, -89));
  const [to, setTo] = useState(date);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const valid = Boolean(from && to && from <= to);
  const context = valid ? contextMarkdown(w, ids, from, to) : "";
  const selection = valid ? selectContext(w, ids, from, to) : null;
  return (
    <>
      <Header
        eyebrow="Your browser. Your records."
        title="Make it yours."
        accent="Keep a way back."
      >
        Momentum has no account or cloud copy. Clearing browser data can remove
        your workspace. Save backups somewhere you control.
      </Header>
      <section className="card">
        <h2>Your working rhythm</h2>
        <form
          key={JSON.stringify(w.settings)}
          onSubmit={async (e) => {
            const f = submit(e);
            await act((d) => {
              d.settings = settingsSchema.parse({
                timezone: value(f, "timezone"),
                workdays: f.getAll("workdays").map(Number),
                horizonDays: Number(f.get("horizon")),
              });
            }, "Settings saved. Existing records keep their original calendar dates.");
          }}
        >
          <div className="two-col">
            <Field
              label="Timezone"
              hint="IANA name, e.g. Europe/London. Today follows this timezone; old entries keep their dates."
            >
              <input
                name="timezone"
                required
                defaultValue={w.settings.timezone}
              />
            </Field>
            <Field label="Planning horizon (days)">
              <input
                type="number"
                name="horizon"
                min={7}
                max={730}
                required
                defaultValue={w.settings.horizonDays}
              />
            </Field>
          </div>
          <Workdays initial={w.settings.workdays} />
          <button className="primary">Save settings</button>
        </form>
      </section>
      <section className="card">
        <p className="eyebrow">Recovery & transfer</p>
        <h2>A complete workspace backup</h2>
        <p>
          Includes every campaign, milestone, priority and recorded entry. A
          restore replaces this workspace and keeps up to five recovery copies
          in this browser.
        </p>
        <div className="actions">
          <button
            className="primary"
            onClick={() =>
              download(
                `momentum-${w.kind}-${date}.json`,
                JSON.stringify(encodeBackup(w), null, 2),
                "application/json",
              )
            }
          >
            Download full backup
          </button>
          <button
            onClick={async () => {
              try {
                const copies = await db.recovery
                  .orderBy("id")
                  .reverse()
                  .toArray();
                if (!copies.length) {
                  report(
                    "No recovery copy yet. One is saved before every restore.",
                  );
                  return;
                }
                download(
                  `momentum-recovery-${date}.json`,
                  JSON.stringify(copies[0].backup, null, 2),
                  "application/json",
                );
                report(
                  "Latest recovery copy downloaded. Preview it below to restore.",
                );
              } catch {
                report(
                  "Could not read the recovery copy. No workspace data changed.",
                  true,
                );
              }
            }}
          >
            Download latest recovery copy
          </button>
        </div>
        <Field
          label="Preview a backup to restore"
          hint="Only Momentum public workspace v1 JSON, up to 20 MB. A Markdown context export is not a backup."
        >
          <input
            type="file"
            accept=".json,application/json"
            onChange={async (e) => {
              setRestore(null);
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                if (file.size > 20_000_000)
                  throw new Error("The backup exceeds the 20 MB import limit.");
                setRestore(parseBackup(await file.text(), w.kind));
              } catch (error) {
                report(
                  error instanceof Error
                    ? error.message
                    : "Could not read backup",
                  true,
                );
              }
              e.target.value = "";
            }}
          />
        </Field>
        {restore && (
          <div className="inset">
            <h3>Restore preview · {restore.workspace.kind} workspace</h3>
            <p>Exported {restore.exportedAt}</p>
            <ul>
              <li>
                {restore.workspace.campaigns.length} campaigns and{" "}
                {restore.workspace.milestones.length} milestones
              </li>
              <li>
                {restore.workspace.commitments.length} daily outcomes and{" "}
                {restore.workspace.evidence.length} evidence records
              </li>
              <li>
                {restore.workspace.reviews.length} reviews,{" "}
                {restore.workspace.closures.length} closures,{" "}
                {restore.workspace.tasks.length} tasks
              </li>
              <li>
                {restore.workspace.rollovers.length} rollover decisions and{" "}
                {restore.workspace.schedule.length} schedule changes
              </li>
            </ul>
            <p>
              <strong>
                This will replace your current {w.kind} workspace.
              </strong>{" "}
              A recovery copy and the replacement are saved together, or neither
              is saved.
            </p>
            <div className="actions">
              <button
                className="primary"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await replaceWorkspace(db, restore, w.kind);
                    setRestore(null);
                    report("Workspace restored. A recovery copy is available.");
                  } catch {
                    report(
                      "Restore failed. Your previous data was kept. Check available browser storage.",
                      true,
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Replace workspace with this backup
              </button>
              <button onClick={() => setRestore(null)}>Cancel restore</button>
            </div>
          </div>
        )}
      </section>
      <section className="card">
        <p className="eyebrow">Bring your own context</p>
        <h2>A smaller export for skills</h2>
        <p>
          Select what you want to share, inspect the preview, then download
          Markdown. Current plan definitions accompany only the dated records
          you select. Unscoped tasks and reflections, and reviews that also
          mention excluded campaigns, are omitted.
        </p>
        <Scope {...{ w, ids, setIds, from, setFrom, to, setTo }} />
        <button
          disabled={!valid || !ids.length}
          onClick={() => setPreview(!preview)}
        >
          {preview ? "Hide context preview" : "Preview selected context"}
        </button>
        {preview && valid && (
          <div className="inset">
            <p>
              {selection?.campaigns.length} campaigns ·{" "}
              {selection?.commitments.length} outcomes ·{" "}
              {selection?.evidence.length} evidence records ·{" "}
              {selection?.reviews.length} reviews
            </p>
            <pre className="preview">{context}</pre>
            <button
              className="primary"
              onClick={() =>
                download("momentum-context.md", context, "text/markdown")
              }
            >
              Download selected context
            </button>
            <p className="subtle">
              This is not a restorable backup. Skills return drafts and advice;
              nothing writes back to this app.
            </p>
          </div>
        )}
      </section>
      <section className="card">
        <h2>Browser storage & offline use</h2>
        <p>
          After the initial offline cache finishes, the app can reopen without a
          connection. Install it from your browser’s install menu or Add to Home
          Screen. Installation does not replace backups.
        </p>
        <button
          onClick={async () => {
            try {
              const ok = await navigator.storage?.persist?.();
              report(
                ok
                  ? "The browser granted persistent storage. Still keep backups."
                  : "Persistent storage was not granted by this browser. Keep regular backups.",
              );
            } catch {
              report(
                "Storage persistence is unavailable in this browser.",
                true,
              );
            }
          }}
        >
          Request persistent storage
        </button>
        <p className="subtle">
          Version {__APP_VERSION__} · workspace schema 1 · no automatic
          telemetry.
        </p>
      </section>
      {w.kind === "demo" && (
        <section className="card">
          <h2>Fictional demo</h2>
          <p>
            Reset restores the fictional field-guide story. Your real workspace
            is a separate database and is never touched.
          </p>
          <button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await replaceWorkspace(
                  db,
                  encodeBackup(demoWorkspace()),
                  "demo",
                );
                report("Fictional demo reset.");
              } catch {
                report(
                  "Could not reset the demo. Existing data was kept.",
                  true,
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            Reset fictional demo
          </button>
        </section>
      )}
    </>
  );
}
