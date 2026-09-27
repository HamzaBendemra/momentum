import { useState } from "react";
import {
  activeMilestones,
  addDays,
  addNext,
  changeDue,
  cleanPriorities,
  daysAway,
  decideRollover,
  makeNow,
  pendingPromises,
  saveCommitment,
  stamp,
  today,
  workingDay,
  type Campaign,
  type Milestone,
  type Workspace,
} from "./model";
import {
  CampaignOptions,
  Empty,
  Field,
  Header,
  submit,
  value,
  type ViewProps,
} from "./ui";

function Workdays({ initial }: { initial: number[] }) {
  return (
    <fieldset className="days">
      <legend>Working days</legend>
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
        <label key={d}>
          <input
            name="workdays"
            type="checkbox"
            value={i}
            defaultChecked={initial.includes(i)}
          />
          <span>{d}</span>
        </label>
      ))}
    </fieldset>
  );
}
export { Workdays };
function Onboarding({ w, date, act }: ViewProps) {
  return (
    <section className="card onboarding">
      <p className="eyebrow">Start with something that matters</p>
      <h2>Give your goal a direction.</h2>
      <p>
        A campaign gives the work a purpose. A milestone makes progress
        concrete. Today needs just one outcome.
      </p>
      <form
        onSubmit={async (e) => {
          const f = submit(e);
          const result = await act((d) => {
            const campaign = {
              ...stamp(),
              name: value(f, "campaign"),
              purpose: value(f, "purpose"),
              archived: false,
            };
            d.campaigns.push(campaign);
            const m = {
              ...stamp(),
              campaignId: campaign.id,
              title: value(f, "milestone"),
              due: value(f, "due"),
              archived: false,
              completedAt: null,
            };
            d.milestones.push(m);
            d.priorities.now = m.id;
            d.settings = {
              timezone: value(f, "timezone"),
              workdays: f.getAll("workdays").map(Number),
              horizonDays: Number(f.get("horizon")),
            };
            const outcome = value(f, "outcome");
            if (outcome)
              saveCommitment(d, today(d.settings.timezone), m.id, outcome);
          }, "Your workspace is ready.");
          if (result) location.hash = "/focus";
        }}
      >
        <div className="two-col">
          <Field label="Campaign name">
            <input
              name="campaign"
              required
              maxLength={500}
              placeholder="Publish a useful field guide"
              autoComplete="off"
            />
          </Field>
          <Field label="Why does it matter?">
            <input
              name="purpose"
              placeholder="Who will this help, and how?"
              maxLength={20000}
            />
          </Field>
        </div>
        <div className="two-col">
          <Field label="First milestone">
            <input
              name="milestone"
              required
              maxLength={500}
              placeholder="Share a first draft with one reader"
            />
          </Field>
          <Field label="Milestone due date">
            <input
              type="date"
              name="due"
              required
              defaultValue={addDays(date, 14)}
            />
          </Field>
        </div>
        <Field
          label="Today’s outcome"
          hint={
            workingDay(w, date)
              ? "Describe a finish you can recognise. You can also start with just the plan."
              : "It’s a non-working day. An outcome is optional."
          }
        >
          <input
            name="outcome"
            maxLength={500}
            placeholder="A draft introduction ready for feedback"
          />
        </Field>
        <details>
          <summary>Your schedule · timezone, workdays and horizon</summary>
          <div className="two-col">
            <Field label="Timezone">
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
                required
                min={7}
                max={730}
                defaultValue={90}
              />
            </Field>
          </div>
          <Workdays initial={w.settings.workdays} />
        </details>
        <button className="primary">Create my workspace</button>
        <small className="subtle">
          Saved only in this browser. You can export a backup in Settings &
          Data.
        </small>
      </form>
    </section>
  );
}
function OutcomeForm({
  w,
  date,
  act,
  onSaved,
}: { onSaved: () => void } & ViewProps) {
  const saved = w.commitments.find((c) => c.date === date);
  const options = activeMilestones(w);
  const savedMilestone = w.milestones.find((m) => m.id === saved?.milestoneId);
  if (savedMilestone && !options.some((m) => m.id === savedMilestone.id))
    options.push(savedMilestone);
  return (
    <form
      onSubmit={async (e) => {
        const f = submit(e);
        if (
          await act(
            (d) =>
              saveCommitment(
                d,
                date,
                value(f, "milestone"),
                value(f, "outcome"),
                value(f, "proof"),
                value(f, "notToday"),
              ),
            "Today’s outcome saved.",
          )
        )
          onSaved();
      }}
    >
      <Field label="Outcome milestone">
        <select
          name="milestone"
          defaultValue={saved?.milestoneId || w.priorities.now || ""}
          required
        >
          <option value="" disabled>
            Choose a milestone
          </option>
          {options.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Today’s outcome">
        <input
          name="outcome"
          required
          maxLength={500}
          defaultValue={saved?.outcome}
          placeholder="What will be different by the end of today?"
        />
      </Field>
      <details>
        <summary>Optional details</summary>
        <Field label="What would count as proof?">
          <textarea name="proof" defaultValue={saved?.proofDefinition} />
        </Field>
        <Field label="Not today">
          <textarea
            name="notToday"
            defaultValue={saved?.notToday}
            placeholder="Make the trade-off explicit"
          />
        </Field>
      </details>
      <div className="actions">
        <button className="primary">Save outcome</button>
        {saved && (
          <button type="button" onClick={onSaved}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
function Rollover({
  promise,
  w,
  date,
  act,
}: { promise: Workspace["commitments"][number] } & ViewProps) {
  const [action, setAction] =
    useState<Workspace["rollovers"][number]["action"]>("reschedule");
  return (
    <form
      className="rollover"
      onSubmit={async (e) => {
        const f = submit(e);
        await act(
          (d) =>
            decideRollover(
              d,
              date,
              promise.date,
              action,
              value(f, "reason"),
              value(f, "target") || null,
              value(f, "delegate"),
            ),
          "Rollover decision saved.",
        );
      }}
    >
      <p>
        <small>{promise.date}</small>
        <br />
        <strong>{promise.outcome}</strong>
      </p>
      <div className="two-col">
        <Field label="Next step">
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as typeof action)}
          >
            <option value="reschedule">Reschedule</option>
            <option
              value="recommit"
              disabled={w.commitments.some((c) => c.date === date)}
            >
              Make this today’s outcome
            </option>
            <option value="delegate">Delegate</option>
            <option value="drop">Drop</option>
          </select>
        </Field>
        {action === "reschedule" && (
          <Field label="New date">
            <input
              name="target"
              type="date"
              required
              min={date}
              defaultValue={addDays(date, 1)}
            />
          </Field>
        )}
        {action === "delegate" && (
          <Field label="Delegate to">
            <input name="delegate" required />
          </Field>
        )}
      </div>
      <Field
        label={
          action === "drop" || action === "delegate"
            ? "Reason (required)"
            : "Reason (optional)"
        }
      >
        <input
          name="reason"
          required={action === "drop" || action === "delegate"}
        />
      </Field>
      <button>Save decision</button>
    </form>
  );
}
function MilestoneEditor({
  m,
  w,
  date,
  act,
  onDone,
}: { m?: Milestone; onDone: () => void } & ViewProps) {
  return (
    <form
      className="inset"
      onSubmit={async (e) => {
        const f = submit(e);
        if (
          await act(
            (d) => {
              if (m) {
                const row = d.milestones.find((x) => x.id === m.id)!;
                row.title = value(f, "title");
                row.updatedAt = new Date().toISOString();
                changeDue(
                  d,
                  m.id,
                  value(f, "due"),
                  value(f, "reason") || "Plan edited",
                );
              } else
                d.milestones.push({
                  ...stamp(),
                  campaignId: value(f, "campaign"),
                  title: value(f, "title"),
                  due: value(f, "due"),
                  archived: false,
                  completedAt: null,
                });
            },
            m ? "Milestone updated." : "Milestone added.",
          )
        )
          onDone();
      }}
    >
      {!m && (
        <Field label="Campaign">
          <select name="campaign" required>
            <CampaignOptions w={w} />
          </select>
        </Field>
      )}
      <div className="two-col">
        <Field label="Milestone title">
          <input
            name="title"
            defaultValue={m?.title}
            required
            maxLength={500}
          />
        </Field>
        <Field label="Due date">
          <input
            name="due"
            type="date"
            defaultValue={m?.due || addDays(date, 14)}
            required
          />
        </Field>
      </div>
      {m && (
        <Field label="Schedule change reason (optional)">
          <input name="reason" />
        </Field>
      )}
      <div className="actions">
        <button className="primary">Save milestone</button>
        <button type="button" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}
function CampaignEditor({
  campaign,
  act,
  onDone,
}: { campaign?: Campaign; onDone: () => void } & Pick<ViewProps, "act">) {
  return (
    <form
      className="inset"
      onSubmit={async (e) => {
        const f = submit(e);
        if (
          await act((d) => {
            if (campaign) {
              const c = d.campaigns.find((x) => x.id === campaign.id)!;
              c.name = value(f, "name");
              c.purpose = value(f, "purpose");
              c.updatedAt = new Date().toISOString();
            } else
              d.campaigns.push({
                ...stamp(),
                name: value(f, "name"),
                purpose: value(f, "purpose"),
                archived: false,
              });
          }, "Campaign saved.")
        )
          onDone();
      }}
    >
      <Field label="Campaign name">
        <input
          name="name"
          required
          maxLength={500}
          defaultValue={campaign?.name}
        />
      </Field>
      <Field label="Purpose">
        <textarea name="purpose" defaultValue={campaign?.purpose} />
      </Field>
      <div className="actions">
        <button className="primary">Save campaign</button>
        <button type="button" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}
function Plan(props: ViewProps) {
  const { w, act, date } = props;
  const [campaignEdit, setCampaignEdit] = useState<string | null>(null);
  const [milestoneEdit, setMilestoneEdit] = useState<string | null>(null);
  const [archived, setArchived] = useState(false);
  return (
    <section className="card" id="plan">
      <div className="section-head">
        <div>
          <p className="eyebrow">The plan</p>
          <h2>Direction, with room to change.</h2>
        </div>
        <button onClick={() => setCampaignEdit("new")}>Add campaign</button>
      </div>
      <p className="subtle">
        {w.settings.horizonDays}-day horizon · through{" "}
        {addDays(date, w.settings.horizonDays)}. Later milestones stay visible.
      </p>
      {campaignEdit === "new" && (
        <CampaignEditor act={act} onDone={() => setCampaignEdit(null)} />
      )}
      <label className="check">
        <input
          type="checkbox"
          checked={archived}
          onChange={(e) => setArchived(e.target.checked)}
        />
        Show archived campaigns and milestones
      </label>
      {w.campaigns
        .filter((c) => archived || !c.archived)
        .map((c) => (
          <article className="campaign" key={c.id}>
            <div className="section-head">
              <div>
                <p className="eyebrow">
                  Campaign{c.archived ? " · archived" : ""}
                </p>
                <h3>{c.name}</h3>
                <p>{c.purpose}</p>
              </div>
              <div className="actions">
                <button
                  onClick={() => setCampaignEdit(c.id)}
                  aria-label={`Edit campaign ${c.name}`}
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    act(
                      (d) => {
                        const row = d.campaigns.find((x) => x.id === c.id)!;
                        row.archived = !row.archived;
                        row.updatedAt = new Date().toISOString();
                        cleanPriorities(d);
                      },
                      c.archived
                        ? "Campaign reopened."
                        : "Campaign archived. Its history is preserved.",
                    )
                  }
                >
                  {c.archived ? "Reopen campaign" : "Archive campaign"}
                </button>
              </div>
            </div>
            {campaignEdit === c.id && (
              <CampaignEditor
                campaign={c}
                act={act}
                onDone={() => setCampaignEdit(null)}
              />
            )}
            {w.milestones
              .filter((m) => m.campaignId === c.id && (archived || !m.archived))
              .map((m) => (
                <div className="milestone" key={m.id}>
                  <div>
                    <small>
                      {m.due} ·{" "}
                      {m.archived
                        ? "Archived"
                        : m.completedAt
                          ? "Shipped"
                          : w.priorities.now === m.id
                            ? "Now"
                            : w.priorities.next.includes(m.id)
                              ? "Next"
                              : "In the plan"}
                    </small>
                    <h4>{m.title}</h4>
                  </div>
                  <div className="actions compact">
                    {!m.archived && !m.completedAt && !c.archived && (
                      <>
                        <button
                          onClick={() =>
                            act(
                              (d) => makeNow(d, m.id),
                              "Now changed. Any saved outcome stays as written.",
                            )
                          }
                          disabled={w.priorities.now === m.id}
                        >
                          Make Now
                        </button>
                        <button
                          onClick={() =>
                            act((d) => addNext(d, m.id), "Added to Next.")
                          }
                          disabled={
                            w.priorities.now === m.id ||
                            w.priorities.next.includes(m.id) ||
                            w.priorities.next.length === 3
                          }
                        >
                          Add Next
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setMilestoneEdit(m.id)}
                      aria-label={`Edit milestone ${m.title}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        act(
                          (d) => {
                            const row = d.milestones.find(
                              (x) => x.id === m.id,
                            )!;
                            row.completedAt = row.completedAt
                              ? null
                              : new Date().toISOString();
                            row.updatedAt = new Date().toISOString();
                            cleanPriorities(d);
                          },
                          m.completedAt
                            ? "Milestone reopened."
                            : "Milestone marked shipped. Add evidence in Proof.",
                        )
                      }
                      disabled={c.archived || m.archived}
                    >
                      {m.completedAt ? "Reopen milestone" : "Mark shipped"}
                    </button>
                    <button
                      onClick={() =>
                        act((d) => {
                          const row = d.milestones.find((x) => x.id === m.id)!;
                          row.archived = !row.archived;
                          row.updatedAt = new Date().toISOString();
                          cleanPriorities(d);
                        }, "Milestone updated; history preserved.")
                      }
                    >
                      {m.archived ? "Unarchive" : "Archive"}
                    </button>
                  </div>
                  {milestoneEdit === m.id && (
                    <MilestoneEditor
                      {...props}
                      m={m}
                      onDone={() => setMilestoneEdit(null)}
                    />
                  )}
                </div>
              ))}
            {!c.archived && (
              <button onClick={() => setMilestoneEdit(`new:${c.id}`)}>
                Add milestone to {c.name}
              </button>
            )}
            {milestoneEdit === `new:${c.id}` && (
              <MilestoneEditor
                {...props}
                w={{ ...w, campaigns: [c] }}
                onDone={() => setMilestoneEdit(null)}
              />
            )}
          </article>
        ))}
      {!w.campaigns.some((c) => !c.archived) && (
        <Empty>
          No active campaigns. Add one or show archived campaigns to reopen one.
        </Empty>
      )}
    </section>
  );
}
export default function Focus(props: ViewProps) {
  const { w, date, act } = props;
  const [editing, setEditing] = useState(false);
  const saved = w.commitments.find((c) => c.date === date);
  const current = w.milestones.find((m) => m.id === w.priorities.now);
  const closure = w.closures.find((c) => c.date === date);
  const pending = pendingPromises(w, date);
  const away = daysAway(w, date) >= 5;
  return (
    <>
      <Header
        eyebrow={`${date} · ${w.settings.timezone}`}
        title="One day."
        accent="One direction."
      >
        A clear outcome. A little evidence. A better next decision.
      </Header>
      {!w.campaigns.length ? (
        <Onboarding {...props} />
      ) : (
        <>
          {away && (
            <aside className="callout">
              <h2>Welcome back. Start from here.</h2>
              <p>
                It has been {daysAway(w, date)} days since your last record.
                Choose what matters now; old promises are available below when
                you’re ready.
              </p>
              <a href="#/review">Look back before choosing →</a>
            </aside>
          )}
          {!workingDay(w, date) && (
            <aside className="callout">
              <strong>A non-working day.</strong> Rest is part of the plan. No
              outcome is required; you can close today whenever you like.
            </aside>
          )}
          <div className="focus-grid">
            <section className="card outcome">
              <p className="eyebrow">
                {closure
                  ? "Day closed"
                  : saved
                    ? "Today’s outcome"
                    : "Choose a finish"}
              </p>
              {saved && !editing ? (
                <>
                  <h2>{saved.outcome}</h2>
                  <p>
                    {
                      w.milestones.find((m) => m.id === saved.milestoneId)
                        ?.title
                    }
                  </p>
                  {saved.proofDefinition && (
                    <p>
                      <strong>Proof sought:</strong> {saved.proofDefinition}
                    </p>
                  )}
                  {saved.notToday && (
                    <p>
                      <strong>Not today:</strong> {saved.notToday}
                    </p>
                  )}
                  {saved.milestoneId !== w.priorities.now && (
                    <p className="callout">
                      Now has changed. This saved outcome still belongs to its
                      original milestone.
                    </p>
                  )}
                  <div className="actions">
                    <a className="button primary" href="#/proof">
                      Add proof
                    </a>
                    <button onClick={() => setEditing(true)}>
                      Edit outcome
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2>What will be different today?</h2>
                  {activeMilestones(w).length || saved ? (
                    <OutcomeForm
                      {...props}
                      key={`${date}-${saved?.updatedAt || w.priorities.now}`}
                      onSaved={() => setEditing(false)}
                    />
                  ) : (
                    <Empty>
                      Add or reopen a milestone in your plan to choose an
                      outcome.
                    </Empty>
                  )}
                </>
              )}
            </section>
            <section className="card runway">
              <p className="eyebrow">Your priorities</p>
              <h2>Now</h2>
              {current ? (
                <>
                  <h3>{current.title}</h3>
                  <p className="subtle">Due {current.due}</p>
                  <button
                    onClick={() =>
                      act((d) => {
                        d.priorities.now = null;
                      }, "Returned to the plan.")
                    }
                  >
                    Return Now to plan
                  </button>
                </>
              ) : (
                <Empty>
                  Choose one milestone in the plan. Nothing is promoted
                  automatically.
                </Empty>
              )}
              <h3 className="next-title">
                Next <small>{w.priorities.next.length}/3</small>
              </h3>
              {w.priorities.next.map((id, i) => (
                <div className="next-item" key={id}>
                  <p>{w.milestones.find((m) => m.id === id)?.title}</p>
                  <div className="actions compact">
                    <button
                      onClick={() => act((d) => makeNow(d, id), "Now changed.")}
                    >
                      Make Now
                    </button>
                    {i > 0 && (
                      <button
                        aria-label={`Move ${w.milestones.find((m) => m.id === id)?.title} earlier`}
                        onClick={() =>
                          act((d) => {
                            const a = d.priorities.next;
                            [a[i - 1], a[i]] = [a[i], a[i - 1]];
                          })
                        }
                      >
                        ↑
                      </button>
                    )}
                    <button
                      onClick={() =>
                        act((d) => {
                          d.priorities.next = d.priorities.next.filter(
                            (x) => x !== id,
                          );
                        })
                      }
                    >
                      To plan
                    </button>
                  </div>
                </div>
              ))}
              {!w.priorities.next.length && (
                <p className="subtle">
                  A short queue makes the trade-offs visible.
                </p>
              )}
            </section>
          </div>
          <div className="two-col">
            <section className="card">
              <h2>Small tasks</h2>
              <p className="subtle">
                Useful supporting moves. They don’t replace the outcome.
              </p>
              {w.tasks
                .filter((t) => t.date === date)
                .map((t) => (
                  <label className="check task" key={t.id}>
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={(e) => {
                        const done = e.target.checked;
                        void act((d) => {
                          const row = d.tasks.find((x) => x.id === t.id)!;
                          row.done = done;
                          row.updatedAt = new Date().toISOString();
                        });
                      }}
                    />
                    <span className={t.done ? "done" : ""}>{t.text}</span>
                  </label>
                ))}
              <form
                onSubmit={async (e) => {
                  const form = e.currentTarget;
                  const f = submit(e);
                  if (
                    await act((d) => {
                      d.tasks.push({
                        ...stamp(),
                        date,
                        text: value(f, "task"),
                        done: false,
                        campaignId: value(f, "campaign") || null,
                      });
                    }, "Task added.")
                  )
                    form.reset();
                }}
              >
                <Field label="Small task">
                  <input name="task" required maxLength={500} />
                </Field>
                <Field label="Related campaign">
                  <select name="campaign">
                    <option value="">
                      Unscoped (excluded from context exports)
                    </option>
                    <CampaignOptions w={w} />
                  </select>
                </Field>
                <button>Add task</button>
              </form>
            </section>
            <section className="card">
              <p className="eyebrow">Enough for today</p>
              <h2>
                {closure
                  ? "Day closed. You can leave it here."
                  : "Close the day."}
              </h2>
              {closure ? (
                <>
                  <p>{closure.reflection || "No reflection needed."}</p>
                  {closure.tomorrow && <p>Next seed: {closure.tomorrow}</p>}
                </>
              ) : (
                <form
                  onSubmit={async (e) => {
                    const f = submit(e);
                    await act((d) => {
                      if (d.closures.some((c) => c.date === date)) return;
                      const commitment = d.commitments.find(
                        (c) => c.date === date,
                      );
                      const campaignId = d.milestones.find(
                        (m) => m.id === commitment?.milestoneId,
                      )?.campaignId;
                      d.closures.push({
                        date,
                        campaignIds: campaignId ? [campaignId] : [],
                        reflection: value(f, "reflection"),
                        tomorrow: value(f, "tomorrow"),
                        closedAt: new Date().toISOString(),
                      });
                    }, "Day closed.");
                  }}
                >
                  <details>
                    <summary>Optional reflection</summary>
                    <Field label="What changed today?">
                      <textarea name="reflection" />
                    </Field>
                    <Field label="A seed for tomorrow">
                      <input name="tomorrow" />
                    </Field>
                  </details>
                  <button className="primary">Close today</button>
                  <p className="subtle">One tap is enough. Nothing to grade.</p>
                </form>
              )}
            </section>
          </div>
          {pending.length > 0 && (
            <section className="card">
              <details>
                <summary>
                  Earlier promises · {pending.length} to reconsider
                </summary>
                <p>
                  You can continue today without clearing this list. A closed
                  day does not claim an outcome was completed.
                </p>
                {pending.map((p) => (
                  <Rollover key={p.date} {...props} promise={p} />
                ))}
              </details>
            </section>
          )}
          <Plan {...props} />
        </>
      )}
    </>
  );
}
