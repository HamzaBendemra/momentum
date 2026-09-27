import { useState } from "react";
import { addDays, stamp } from "./model";
import { download, narrativeMarkdown, selectContext } from "./export";
import {
  CampaignOptions,
  Empty,
  Field,
  Header,
  Scope,
  submit,
  value,
  type ViewProps,
} from "./ui";
export default function Proof({ w, date, act }: ViewProps) {
  const initial =
    w.milestones.find(
      (m) => m.id === w.commitments.find((c) => c.date === date)?.milestoneId,
    )?.campaignId ||
    w.campaigns[0]?.id ||
    "";
  const [campaign, setCampaign] = useState(initial);
  const [ids, setIds] = useState(w.campaigns.map((c) => c.id));
  const [from, setFrom] = useState(addDays(date, -89));
  const [to, setTo] = useState(date);
  const [preview, setPreview] = useState(false);
  const validRange = Boolean(from && to && from <= to);
  const evidence = validRange ? selectContext(w, ids, from, to).evidence : [];
  const draft = validRange ? narrativeMarkdown(w, ids, from, to) : "";
  return (
    <>
      <Header
        eyebrow="Evidence, not a score"
        title="Keep the proof."
        accent="Tell a truer story."
      >
        Capture what happened, where someone can see it, and what you believe
        changed.
      </Header>
      <section className="card">
        <h2>Add a piece of evidence</h2>
        {w.campaigns.length ? (
          <form
            onSubmit={async (e) => {
              const form = e.currentTarget;
              const f = submit(e);
              if (
                await act((d) => {
                  d.evidence.push({
                    ...stamp(),
                    campaignId: campaign,
                    milestoneId: value(f, "milestone") || null,
                    date: value(f, "date"),
                    what: value(f, "what"),
                    reference: value(f, "reference"),
                    impact: value(f, "impact"),
                  });
                }, "Evidence recorded.")
              )
                form.reset();
            }}
          >
            <div className="two-col">
              <Field label="Evidence campaign">
                <select
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  required
                >
                  <CampaignOptions w={w} includeArchived />
                </select>
              </Field>
              <Field label="Evidence date">
                <input name="date" type="date" required defaultValue={date} />
              </Field>
            </div>
            <Field label="Related milestone (optional)">
              <select name="milestone" key={campaign}>
                <option value="">Campaign-level evidence</option>
                {w.milestones
                  .filter((m) => m.campaignId === campaign)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="What happened?">
              <input
                name="what"
                required
                maxLength={500}
                placeholder="Describe the work or observation, as it happened"
              />
            </Field>
            <details>
              <summary>Reference and claimed impact (optional)</summary>
              <Field
                label="Reference"
                hint="A file name, document link, or other place to find the evidence. Nothing is uploaded."
              >
                <input
                  name="reference"
                  placeholder="Where can someone inspect it?"
                />
              </Field>
              <Field
                label="What changed?"
                hint="A claimed impact is not automatically verified. Leave it blank when you don’t know."
              >
                <textarea name="impact" />
              </Field>
            </details>
            <button className="primary">Save evidence</button>
          </form>
        ) : (
          <Empty>
            Create a campaign in{" "}
            <a href={w.kind === "demo" ? "#/demo/focus" : "#/focus"}>Focus</a>{" "}
            first. Real workspaces start with no completed examples.
          </Empty>
        )}
      </section>
      <section className="card">
        <div className="section-head">
          <div>
            <p className="eyebrow">Your record</p>
            <h2>What actually changed?</h2>
          </div>
          <button
            onClick={() => setPreview(!preview)}
            disabled={!validRange || !ids.length}
          >
            {preview ? "Hide narrative" : "Preview narrative"}
          </button>
        </div>
        <Scope {...{ w, ids, setIds, from, setFrom, to, setTo }} />
        {!validRange && <p role="alert">Choose a valid date range.</p>}
        {preview && validRange && (
          <div className="inset">
            <h3>Editable narrative preview</h3>
            <pre className="preview">{draft}</pre>
            <button
              onClick={() =>
                download("momentum-narrative.md", draft, "text/markdown")
              }
            >
              Download narrative
            </button>
          </div>
        )}
        {evidence.length ? (
          evidence
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((e) => (
              <article className="evidence" key={e.id}>
                <p className="eyebrow">
                  {e.date} ·{" "}
                  {w.campaigns.find((c) => c.id === e.campaignId)?.name}
                </p>
                <h3>{e.what}</h3>
                <p>
                  <strong>Reference:</strong> {e.reference || "Not recorded"}
                </p>
                <p>
                  <strong>Claimed impact:</strong> {e.impact || "Not recorded"}
                </p>
                <small>Evidence ID: {e.id}</small>
              </article>
            ))
        ) : (
          <Empty>
            No history yet in this selection. An intention becomes evidence only
            when you record what happened.
          </Empty>
        )}
      </section>
    </>
  );
}
