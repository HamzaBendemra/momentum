import { useState } from "react";
import { addDays, stamp } from "./model";
import { selectContext } from "./export";
import {
  Empty,
  Field,
  Header,
  Scope,
  submit,
  value,
  type ViewProps,
} from "./ui";
export default function Review({ w, date, act }: ViewProps) {
  const [ids, setIds] = useState(w.campaigns.map((c) => c.id));
  const [from, setFrom] = useState(addDays(date, -6));
  const [to, setTo] = useState(date);
  const valid = Boolean(from && to && from <= to);
  const s = valid ? selectContext(w, ids, from, to) : null;
  return (
    <>
      <Header
        eyebrow="Grade the direction, not the day"
        title="Look back."
        accent="Choose what comes next."
      >
        What does the evidence suggest you should continue, change, or stop?
      </Header>
      <section className="card">
        <h2>One better next decision</h2>
        <Scope {...{ w, ids, setIds, from, setFrom, to, setTo }} />
        {!valid && <p role="alert">Choose a valid date range.</p>}
        <form
          onSubmit={async (e) => {
            const form = e.currentTarget;
            const f = submit(e);
            if (
              await act((d) => {
                d.reviews.push({
                  ...stamp(),
                  date: to,
                  campaignIds: ids,
                  observation: value(f, "observation"),
                  decision: value(f, "decision"),
                });
              }, "Review saved.")
            )
              form.reset();
          }}
        >
          <Field
            label="What did you learn? (optional)"
            hint="Separate intentions, recorded evidence, and claims that still need support."
          >
            <textarea
              name="observation"
              placeholder="What held up? What surprised you? What is still unknown?"
            />
          </Field>
          <Field label="Your next decision">
            <textarea
              name="decision"
              required
              maxLength={500}
              placeholder="One adjustment worth making next week"
            />
          </Field>
          <button className="primary" disabled={!valid || !ids.length}>
            Save weekly review
          </button>
        </form>
      </section>
      <div className="two-col">
        <section className="card">
          <h2>Evidence to think with</h2>
          {s?.evidence.length ? (
            s.evidence.map((e) => (
              <article className="compact-record" key={e.id}>
                <small>{e.date}</small>
                <h3>{e.what}</h3>
                <p>Reference: {e.reference || "missing"}</p>
                <p>Claimed impact: {e.impact || "not supplied"}</p>
              </article>
            ))
          ) : (
            <Empty>
              No evidence in this period. You can record uncertainty and decide
              how to learn; there is no score to recover.
            </Empty>
          )}
        </section>
        <section className="card">
          <h2>Intentions & unresolved work</h2>
          {s?.commitments.length ? (
            s.commitments.map((c) => (
              <article className="compact-record" key={c.date}>
                <small>{c.date}</small>
                <h3>{c.outcome}</h3>
                <p>
                  {w.rollovers.find((r) => r.sourceDate === c.date)?.action ||
                    (w.milestones.find((m) => m.id === c.milestoneId)
                      ?.completedAt
                      ? "Milestone marked shipped; inspect its evidence."
                      : "No completion inferred.")}
                </p>
              </article>
            ))
          ) : (
            <Empty>No commitments in this period.</Empty>
          )}
          <details>
            <summary>A little context</summary>
            <p>
              {s?.commitments.length || 0} intentions ·{" "}
              {s?.evidence.length || 0} evidence records ·{" "}
              {s?.closures.length || 0} days closed. These counts describe
              records, not your value or impact.
            </p>
          </details>
        </section>
      </div>
      <section className="card">
        <h2>Reflection history</h2>
        {s?.reviews.length ? (
          s.reviews
            .slice()
            .reverse()
            .map((r) => (
              <article className="evidence" key={r.id}>
                <p className="eyebrow">{r.date}</p>
                <h3>{r.decision}</h3>
                <p>{r.observation || "No supporting reflection recorded."}</p>
              </article>
            ))
        ) : (
          <Empty>
            No reviews yet in this selection. Your first decision starts the
            record.
          </Empty>
        )}
        {s?.closures
          .filter((c) => c.reflection || c.tomorrow)
          .map((c) => (
            <article className="compact-record" key={c.date}>
              <small>{c.date} · day closed</small>
              <p>{c.reflection}</p>
              {c.tomorrow && <p>Next seed: {c.tomorrow}</p>}
            </article>
          ))}
      </section>
    </>
  );
}
