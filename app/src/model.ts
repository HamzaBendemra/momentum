import { z } from "zod";

export const day = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((s) => {
    const date = new Date(`${s}T12:00:00Z`);
    return (
      !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === s
    );
  }, "Use a valid calendar date");
const text = z.string().max(20000);
const title = z.string().trim().min(1).max(500);
const id = z.string().min(1).max(100);
const instant = z.iso.datetime({ offset: true });
const base = { id, createdAt: instant, updatedAt: instant };
export const campaignSchema = z
  .object({ ...base, name: title, purpose: text, archived: z.boolean() })
  .strict();
export const milestoneSchema = z
  .object({
    ...base,
    campaignId: id,
    title,
    due: day,
    archived: z.boolean(),
    completedAt: instant.nullable(),
  })
  .strict();
export const settingsSchema = z
  .object({
    timezone: z.string().refine((s) => {
      try {
        new Intl.DateTimeFormat("en", { timeZone: s });
        return true;
      } catch {
        return false;
      }
    }, "Use an IANA timezone, such as Europe/London"),
    workdays: z
      .array(z.number().int().min(0).max(6))
      .max(7)
      .refine((a) => new Set(a).size === a.length),
    horizonDays: z.number().int().min(7).max(730),
  })
  .strict();
const workspaceShape = z
  .object({
    schemaVersion: z.literal(1),
    kind: z.enum(["real", "demo"]),
    revision: z.number().int().nonnegative(),
    settings: settingsSchema,
    campaigns: z.array(campaignSchema),
    milestones: z.array(milestoneSchema),
    priorities: z
      .object({ now: id.nullable(), next: z.array(id).max(3) })
      .strict(),
    commitments: z.array(
      z
        .object({
          date: day,
          milestoneId: id,
          outcome: title,
          proofDefinition: text,
          notToday: text,
          completedAt: instant.nullable(),
          createdAt: instant,
          updatedAt: instant,
        })
        .strict(),
    ),
    evidence: z.array(
      z
        .object({
          ...base,
          date: day,
          campaignId: id,
          milestoneId: id.nullable(),
          what: title,
          reference: text,
          impact: text,
        })
        .strict(),
    ),
    reviews: z.array(
      z
        .object({
          ...base,
          date: day,
          campaignIds: z.array(id).min(1),
          observation: text,
          decision: title,
        })
        .strict(),
    ),
    closures: z.array(
      z
        .object({
          date: day,
          campaignIds: z.array(id),
          reflection: text,
          tomorrow: text,
          closedAt: instant,
        })
        .strict(),
    ),
    rollovers: z.array(
      z
        .object({
          ...base,
          sourceDate: day,
          date: day,
          milestoneId: id,
          action: z.enum(["recommit", "reschedule", "delegate", "drop"]),
          reason: text,
          targetDate: day.nullable(),
          delegateTo: text,
        })
        .strict(),
    ),
    schedule: z.array(
      z
        .object({
          ...base,
          milestoneId: id,
          previousDue: day,
          date: day,
          nextDue: day,
          reason: text,
        })
        .strict(),
    ),
    tasks: z.array(
      z
        .object({
          ...base,
          date: day,
          campaignId: id.nullable(),
          text: title,
          done: z.boolean(),
        })
        .strict(),
    ),
  })
  .strict();
export const workspaceSchema = workspaceShape.superRefine((w, ctx) => {
  const problem = (message: string) =>
    ctx.addIssue({ code: "custom", message });
  for (const records of [
    w.campaigns,
    w.milestones,
    w.evidence,
    w.reviews,
    w.rollovers,
    w.schedule,
    w.tasks,
  ]) {
    if (new Set(records.map((x) => x.id)).size !== records.length)
      problem("Duplicate record IDs");
  }
  for (const records of [w.commitments, w.closures])
    if (new Set(records.map((x) => x.date)).size !== records.length)
      problem("Duplicate daily records");
  const campaigns = new Set(w.campaigns.map((x) => x.id));
  const milestones = new Map(w.milestones.map((x) => [x.id, x]));
  for (const m of w.milestones)
    if (!campaigns.has(m.campaignId)) problem("Missing campaign");
  for (const c of w.commitments)
    if (!milestones.has(c.milestoneId)) problem("Missing commitment milestone");
  for (const e of w.evidence)
    if (
      !campaigns.has(e.campaignId) ||
      (e.milestoneId &&
        milestones.get(e.milestoneId)?.campaignId !== e.campaignId)
    )
      problem("Evidence has an invalid reference");
  for (const r of [...w.reviews, ...w.closures])
    if (
      r.campaignIds.some((x) => !campaigns.has(x)) ||
      new Set(r.campaignIds).size !== r.campaignIds.length
    )
      problem("Invalid review or closure campaigns");
  for (const r of [...w.rollovers, ...w.schedule])
    if (!milestones.has(r.milestoneId)) problem("Missing historical milestone");
  for (const r of w.rollovers) {
    if (
      !w.commitments.some(
        (c) => c.date === r.sourceDate && c.milestoneId === r.milestoneId,
      )
    )
      problem("Rollover needs an original commitment");
    if ((r.action === "drop" || r.action === "delegate") && !r.reason.trim())
      problem("Dropping or delegating needs a reason");
    if (r.action === "delegate" && !r.delegateTo.trim())
      problem("Delegating needs a recipient");
    if ((r.action === "reschedule" || r.action === "recommit") && !r.targetDate)
      problem("Rollover needs a target date");
  }
  if (new Set(w.rollovers.map((r) => r.sourceDate)).size !== w.rollovers.length)
    problem("Duplicate rollover decisions");
  for (const t of w.tasks)
    if (t.campaignId && !campaigns.has(t.campaignId))
      problem("Invalid task campaign");
  const priorities = [
    ...(w.priorities.now ? [w.priorities.now] : []),
    ...w.priorities.next,
  ];
  if (new Set(priorities).size !== priorities.length)
    problem("Duplicate priorities");
  for (const p of priorities) {
    const m = milestones.get(p);
    if (
      !m ||
      m.archived ||
      m.completedAt ||
      w.campaigns.find((c) => c.id === m.campaignId)?.archived
    )
      problem("Priorities must refer to active milestones");
  }
});
export type Workspace = z.infer<typeof workspaceSchema>;
export type Campaign = Workspace["campaigns"][number];
export type Milestone = Workspace["milestones"][number];
export type Settings = Workspace["settings"];
export const backupSchema = z
  .object({
    format: z.literal("momentum-public-workspace"),
    version: z.literal(1),
    exportedAt: instant,
    workspace: workspaceSchema,
  })
  .strict();
export type Backup = z.infer<typeof backupSchema>;
export function emptyWorkspace(kind: Workspace["kind"] = "real"): Workspace {
  return {
    schemaVersion: 1,
    kind,
    revision: 0,
    settings: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      workdays: [1, 2, 3, 4, 5],
      horizonDays: 90,
    },
    campaigns: [],
    milestones: [],
    priorities: { now: null, next: [] },
    commitments: [],
    evidence: [],
    reviews: [],
    closures: [],
    rollovers: [],
    schedule: [],
    tasks: [],
  };
}
export function stamp() {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), createdAt: now, updatedAt: now };
}
export function today(timezone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return `${parts.find((p) => p.type === "year")!.value}-${parts.find((p) => p.type === "month")!.value}-${parts.find((p) => p.type === "day")!.value}`;
}
export function addDays(date: string, n: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
export function gapDays(a: string, b: string) {
  return Math.round(
    (Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000,
  );
}
export function workingDay(w: Workspace, date: string) {
  return w.settings.workdays.includes(
    new Date(`${date}T12:00:00Z`).getUTCDay(),
  );
}
export function daysAway(w: Workspace, date: string) {
  const dates = [
    ...w.commitments.map((c) => c.date),
    ...w.closures.map((c) => c.date),
    ...w.evidence.map((c) => c.date),
    ...w.reviews.map((c) => c.date),
  ];
  const last = dates
    .filter((d) => d <= date)
    .sort()
    .at(-1);
  return last ? gapDays(last, date) : 0;
}
export function activeMilestones(w: Workspace) {
  return w.milestones
    .filter(
      (m) =>
        !m.archived &&
        !m.completedAt &&
        !w.campaigns.find((c) => c.id === m.campaignId)?.archived,
    )
    .sort((a, b) => a.due.localeCompare(b.due));
}
export function cleanPriorities(w: Workspace) {
  const active = new Set(activeMilestones(w).map((m) => m.id));
  if (w.priorities.now && !active.has(w.priorities.now))
    w.priorities.now = null;
  w.priorities.next = [...new Set(w.priorities.next)]
    .filter((x) => active.has(x) && x !== w.priorities.now)
    .slice(0, 3);
}
// Adapted from the original priority stack: the old Now returns to Next; overflow returns to the plan.
export function makeNow(w: Workspace, id: string) {
  if (!activeMilestones(w).some((m) => m.id === id))
    throw new Error("Choose an active milestone");
  if (w.priorities.now === id) return;
  w.priorities.next = [
    ...(w.priorities.now ? [w.priorities.now] : []),
    ...w.priorities.next.filter((x) => x !== id),
  ].slice(0, 3);
  w.priorities.now = id;
}
export function addNext(w: Workspace, id: string) {
  if (!activeMilestones(w).some((m) => m.id === id))
    throw new Error("Choose an active milestone");
  if (w.priorities.now === id || w.priorities.next.includes(id)) return;
  if (w.priorities.next.length === 3)
    throw new Error(
      "Next has room for three milestones. Return one to the plan first.",
    );
  w.priorities.next.push(id);
}
export function pendingPromises(w: Workspace, date: string) {
  return w.commitments.filter(
    (c) =>
      c.date < date &&
      !c.completedAt &&
      !w.rollovers.some((r) => r.sourceDate === c.date) &&
      !w.milestones.find((m) => m.id === c.milestoneId)?.completedAt,
  );
}
export function saveCommitment(
  w: Workspace,
  date: string,
  milestoneId: string,
  outcome: string,
  proofDefinition = "",
  notToday = "",
) {
  const current = w.commitments.find((c) => c.date === date);
  const at = new Date().toISOString();
  if (current)
    Object.assign(current, {
      completedAt:
        current.outcome === outcome && current.milestoneId === milestoneId
          ? current.completedAt
          : null,
      milestoneId,
      outcome,
      proofDefinition,
      notToday,
      updatedAt: at,
    });
  else
    w.commitments.push({
      date,
      milestoneId,
      outcome,
      proofDefinition,
      notToday,
      createdAt: at,
      updatedAt: at,
      completedAt: null,
    });
}
export function changeDue(
  w: Workspace,
  id: string,
  nextDue: string,
  reason: string,
  date = today(w.settings.timezone),
) {
  const m = w.milestones.find((m) => m.id === id);
  if (!m) throw new Error("Milestone not found");
  if (m.due !== nextDue) {
    w.schedule.push({
      ...stamp(),
      milestoneId: id,
      previousDue: m.due,
      date,
      nextDue,
      reason,
    });
    m.due = nextDue;
    m.updatedAt = new Date().toISOString();
  }
}
export function decideRollover(
  w: Workspace,
  date: string,
  sourceDate: string,
  action: Workspace["rollovers"][number]["action"],
  reason: string,
  targetDate: string | null,
  delegateTo: string,
) {
  const promise = w.commitments.find((c) => c.date === sourceDate);
  if (!promise || w.rollovers.some((r) => r.sourceDate === sourceDate))
    throw new Error("This promise already has a decision");
  if (promise.completedAt || sourceDate >= date)
    throw new Error(
      "Only an unfinished promise from an earlier day can roll over",
    );
  if (action === "recommit") {
    if (w.commitments.some((c) => c.date === date))
      throw new Error(
        "Today already has an outcome. Edit it deliberately or reschedule this promise.",
      );
    if (!activeMilestones(w).some((m) => m.id === promise.milestoneId))
      throw new Error("Reopen this milestone and its campaign first.");
    targetDate = date;
    saveCommitment(
      w,
      date,
      promise.milestoneId,
      promise.outcome,
      promise.proofDefinition,
      promise.notToday,
    );
  }
  if (action === "reschedule") {
    if (!targetDate || targetDate < date)
      throw new Error("Choose today or a future date");
    changeDue(
      w,
      promise.milestoneId,
      targetDate,
      reason || "Deliberate rollover",
      date,
    );
  }
  w.rollovers.push({
    ...stamp(),
    sourceDate,
    date,
    milestoneId: promise.milestoneId,
    action,
    reason,
    targetDate,
    delegateTo,
  });
}
