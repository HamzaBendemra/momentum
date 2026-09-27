import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import {
  activeMilestones,
  addDays,
  addNext,
  changeDue,
  cleanPriorities,
  daysAway,
  decideRollover,
  emptyWorkspace,
  makeNow,
  pendingPromises,
  saveCommitment,
  stamp,
  today,
  workingDay,
  workspaceSchema,
  type Workspace,
} from "./model";
import {
  encodeBackup,
  mutateWorkspace,
  parseBackup,
  readWorkspace,
  replaceWorkspace,
  WorkspaceDB,
} from "./repository";
import { contextMarkdown, narrativeMarkdown, selectContext } from "./export";
import { demoWorkspace } from "./demo";
const dbs: WorkspaceDB[] = [];
function db(kind: Workspace["kind"] = "real") {
  const d = new WorkspaceDB(kind, `test-${crypto.randomUUID()}`);
  dbs.push(d);
  return d;
}
function fixture() {
  const w = emptyWorkspace();
  w.campaigns.push({
    ...stamp(),
    id: "c1",
    name: "Fictional field guide",
    purpose: "Make a walk understandable",
    archived: false,
  });
  for (let i = 1; i <= 5; i++)
    w.milestones.push({
      ...stamp(),
      id: `m${i}`,
      campaignId: "c1",
      title: `Draft ${i}`,
      due: "2026-10-20",
      archived: false,
      completedAt: null,
    });
  return w;
}
afterEach(async () => {
  await Promise.all(dbs.splice(0).map((d) => d.delete()));
});
describe("public workspace", () => {
  it("starts without fabricated records", () => {
    const w = emptyWorkspace();
    expect(w.campaigns).toEqual([]);
    expect(w.commitments).toEqual([]);
    expect(w.evidence).toEqual([]);
    expect(w.reviews).toEqual([]);
    expect(w.settings.horizonDays).toBe(90);
  });
  it("completes the local campaign → milestone → outcome → proof → review loop and survives reload", async () => {
    const d = db();
    await readWorkspace(d, "real");
    await mutateWorkspace(d, (w) => Object.assign(w, fixture()));
    await mutateWorkspace(d, (w) => {
      makeNow(w, "m1");
      saveCommitment(w, "2026-10-01", "m1", "Finish a readable introduction");
    });
    await mutateWorkspace(d, (w) => {
      w.evidence.push({
        ...stamp(),
        date: "2026-10-01",
        campaignId: "c1",
        milestoneId: "m1",
        what: "Introduction drafted",
        reference: "draft.md",
        impact: "",
      });
      w.reviews.push({
        ...stamp(),
        date: "2026-10-02",
        campaignIds: ["c1"],
        observation: "No reader feedback yet",
        decision: "Test it with one willing reader",
      });
    });
    d.close();
    await d.open();
    const loaded = await readWorkspace(d, "real");
    expect(loaded.campaigns).toHaveLength(1);
    expect(loaded.milestones).toHaveLength(5);
    expect(loaded.commitments[0].outcome).toBe(
      "Finish a readable introduction",
    );
    expect(loaded.evidence).toHaveLength(1);
    expect(loaded.reviews).toHaveLength(1);
  });
  it("keeps at most three Next, deduplicates and preserves a saved outcome when Now changes", () => {
    const w = fixture();
    makeNow(w, "m1");
    saveCommitment(w, "2026-10-01", "m1", "A distinct daily promise");
    ["m2", "m3", "m4"].forEach((id) => addNext(w, id));
    expect(() => addNext(w, "m5")).toThrow();
    makeNow(w, "m5");
    expect(w.priorities).toEqual({ now: "m5", next: ["m1", "m2", "m3"] });
    expect(w.commitments[0].milestoneId).toBe("m1");
    expect(w.commitments[0].outcome).toBe("A distinct daily promise");
    addNext(w, "m2");
    expect(w.priorities.next).toHaveLength(3);
  });
  it("ships, reopens and archives without destroying evidence or IDs", () => {
    const w = fixture();
    makeNow(w, "m1");
    addNext(w, "m2");
    w.evidence.push({
      ...stamp(),
      date: "2026-10-01",
      campaignId: "c1",
      milestoneId: "m1",
      what: "Draft written",
      reference: "",
      impact: "",
    });
    w.milestones[0].completedAt = new Date().toISOString();
    cleanPriorities(w);
    expect(w.priorities.now).toBeNull();
    expect(w.priorities.next).toEqual(["m2"]);
    w.milestones[0].completedAt = null;
    makeNow(w, "m1");
    w.campaigns[0].archived = true;
    cleanPriorities(w);
    expect(activeMilestones(w)).toEqual([]);
    expect(w.evidence[0].milestoneId).toBe("m1");
    w.campaigns[0].archived = false;
    expect(activeMilestones(w)).toHaveLength(5);
    expect(w.priorities.now).toBeNull();
    expect(workspaceSchema.safeParse(w).success).toBe(true);
  });
  it("handles timezone date boundaries, DST, rest days and five-day reentry", () => {
    expect(today("Pacific/Auckland", new Date("2026-09-27T23:00:00Z"))).toBe(
      "2026-09-28",
    );
    expect(today("America/Los_Angeles", new Date("2026-09-27T01:00:00Z"))).toBe(
      "2026-09-26",
    );
    expect(addDays("2026-03-08", 1)).toBe("2026-03-09");
    const w = fixture();
    saveCommitment(w, "2026-09-20", "m1", "Draft");
    expect(daysAway(w, "2026-09-25")).toBe(5);
    expect(workingDay(w, "2026-09-27")).toBe(false);
    w.settings.timezone = "Pacific/Auckland";
    expect(w.commitments[0].date).toBe("2026-09-20");
  });
  it("keeps old promises without blocking closure; rollover preserves reasons and schedules", () => {
    const w = fixture();
    saveCommitment(w, "2026-10-01", "m1", "Draft");
    w.closures.push({
      date: "2026-10-01",
      campaignIds: ["c1"],
      reflection: "",
      tomorrow: "",
      closedAt: new Date().toISOString(),
    });
    expect(pendingPromises(w, "2026-10-02")).toHaveLength(1);
    decideRollover(
      w,
      "2026-10-02",
      "2026-10-01",
      "reschedule",
      "Need reader availability",
      "2026-10-05",
      "",
    );
    expect(w.schedule[0]).toMatchObject({
      previousDue: "2026-10-20",
      nextDue: "2026-10-05",
    });
    expect(pendingPromises(w, "2026-10-02")).toEqual([]);
    expect(() =>
      decideRollover(
        w,
        "2026-10-02",
        "2026-10-01",
        "drop",
        "irrelevant",
        null,
        "",
      ),
    ).toThrow();
  });
  it("requires a reason to drop or delegate and does not overwrite today on recommit", () => {
    const w = fixture();
    saveCommitment(w, "2026-10-01", "m1", "Older promise");
    saveCommitment(w, "2026-10-02", "m2", "New promise");
    expect(() =>
      decideRollover(w, "2026-10-02", "2026-10-01", "recommit", "", null, ""),
    ).toThrow();
    decideRollover(w, "2026-10-02", "2026-10-01", "drop", "", null, "");
    expect(workspaceSchema.safeParse(w).success).toBe(false);
    w.rollovers[0].reason = "No longer useful";
    expect(workspaceSchema.safeParse(w).success).toBe(true);
  });
  it("rejects dangling references, duplicate IDs, bad dates and extra private fields", () => {
    const w = fixture();
    w.milestones[0].campaignId = "missing";
    expect(workspaceSchema.safeParse(w).success).toBe(false);
    w.milestones[0].campaignId = "c1";
    w.milestones[0].due = "2026-02-30";
    expect(workspaceSchema.safeParse(w).success).toBe(false);
    expect(
      workspaceSchema.safeParse({ ...fixture(), secret: {} }).success,
    ).toBe(false);
    const d = fixture();
    d.campaigns.push(d.campaigns[0]);
    expect(workspaceSchema.safeParse(d).success).toBe(false);
  });
});
describe("transactional storage and backups", () => {
  it("round-trips the entire workspace and preserves a recoverable previous copy", async () => {
    const d = db();
    const initial = await readWorkspace(d, "real");
    const complete = fixture();
    saveCommitment(complete, "2026-10-01", "m1", "Finish draft");
    changeDue(complete, "m1", "2026-10-15", "Earlier test");
    const backup = parseBackup(JSON.stringify(encodeBackup(complete)), "real");
    await replaceWorkspace(d, backup, "real");
    const restored = await readWorkspace(d, "real");
    expect({ ...restored, revision: 0 }).toEqual(complete);
    expect((await d.recovery.toArray())[0].backup.workspace).toEqual(initial);
  });
  it.each([
    "{",
    "{}",
    JSON.stringify({ version: 21, snapshot: { milestones: [] } }),
    JSON.stringify({ ...encodeBackup(fixture()), version: 2 }),
    JSON.stringify({
      ...encodeBackup(fixture()),
      workspace: { ...fixture(), priorities: { now: "missing", next: [] } },
    }),
  ])(
    "rejects malformed, unsupported or private backup without a write: %s",
    async (json) => {
      const d = db();
      await readWorkspace(d, "real");
      await mutateWorkspace(d, (w) => Object.assign(w, fixture()));
      const before = await readWorkspace(d, "real");
      expect(() => parseBackup(json, "real")).toThrow();
      expect(await readWorkspace(d, "real")).toEqual(before);
      expect(await d.recovery.count()).toBe(0);
    },
  );
  it("rolls back a failed mutation and preserves both transactions when concurrent tabs write", async () => {
    const d = db();
    await readWorkspace(d, "real");
    await mutateWorkspace(d, (w) => Object.assign(w, fixture()));
    const before = await readWorkspace(d, "real");
    await expect(
      mutateWorkspace(d, (w) => {
        w.campaigns = [];
      }),
    ).rejects.toThrow();
    expect(await readWorkspace(d, "real")).toEqual(before);
    await Promise.all([
      mutateWorkspace(d, (w) => {
        w.tasks.push({
          ...stamp(),
          date: "2026-10-01",
          campaignId: "c1",
          text: "A",
          done: false,
        });
      }),
      mutateWorkspace(d, (w) => {
        w.tasks.push({
          ...stamp(),
          date: "2026-10-01",
          campaignId: "c1",
          text: "B",
          done: false,
        });
      }),
    ]);
    expect((await readWorkspace(d, "real")).tasks).toHaveLength(2);
  });
  it("aborts replacement if recovery cannot be written", async () => {
    const d = db();
    const before = await readWorkspace(d, "real");
    d.recovery.hook("creating", () => {
      throw new Error("QuotaExceededError");
    });
    await expect(
      replaceWorkspace(d, encodeBackup(fixture()), "real"),
    ).rejects.toThrow();
    expect(await readWorkspace(d, "real")).toEqual(before);
    expect(await d.recovery.count()).toBe(0);
  });
  it("isolates demo reset from real data and rejects cross-kind imports", async () => {
    const real = db(),
      demo = db("demo");
    await readWorkspace(real, "real");
    await readWorkspace(demo, "demo");
    await mutateWorkspace(real, (w) => Object.assign(w, fixture()));
    const before = await readWorkspace(real, "real");
    await replaceWorkspace(demo, encodeBackup(demoWorkspace()), "demo");
    expect(await readWorkspace(real, "real")).toEqual(before);
    expect(() =>
      parseBackup(JSON.stringify(encodeBackup(demoWorkspace())), "real"),
    ).toThrow(/cannot be mixed/);
    expect(workspaceSchema.safeParse(demoWorkspace()).success).toBe(true);
  });
});
describe("selected context and narrative", () => {
  it("exports only selected campaigns and dates and omits cross-campaign and unscoped notes", () => {
    const w = fixture();
    w.campaigns.push({
      ...stamp(),
      id: "c2",
      name: "Excluded campaign",
      purpose: "hidden-purpose",
      archived: false,
    });
    w.evidence.push(
      {
        ...stamp(),
        date: "2026-10-01",
        campaignId: "c1",
        milestoneId: "m1",
        what: "Included fact",
        reference: "draft.md",
        impact: "",
      },
      {
        ...stamp(),
        date: "2026-10-01",
        campaignId: "c2",
        milestoneId: null,
        what: "hidden-evidence",
        reference: "",
        impact: "",
      },
      {
        ...stamp(),
        date: "2026-09-01",
        campaignId: "c1",
        milestoneId: null,
        what: "outside-period",
        reference: "",
        impact: "",
      },
    );
    w.reviews.push({
      ...stamp(),
      date: "2026-10-01",
      campaignIds: ["c1", "c2"],
      observation: "hidden-mixed",
      decision: "Not for a single scope",
    });
    w.tasks.push({
      ...stamp(),
      date: "2026-10-01",
      campaignId: null,
      text: "hidden-task",
      done: false,
    });
    const md = contextMarkdown(w, ["c1"], "2026-10-01", "2026-10-02");
    expect(md).toContain("Included fact");
    expect(md).not.toMatch(/hidden-|outside-period/);
    expect(
      selectContext(w, ["c1"], "2026-10-01", "2026-10-02").evidence,
    ).toHaveLength(1);
    expect(narrativeMarkdown(w, ["c1"], "2026-10-01", "2026-10-02")).toContain(
      "MISSING — do not invent an effect",
    );
  });
  it("does not turn a saved intention into an accomplishment", () => {
    const w = fixture();
    saveCommitment(w, "2026-10-01", "m1", "A big intention");
    expect(
      narrativeMarkdown(w, ["c1"], "2026-10-01", "2026-10-02"),
    ).not.toContain("A big intention");
    expect(contextMarkdown(w, ["c1"], "2026-10-01", "2026-10-02")).toContain(
      "No evidence recorded",
    );
  });
});
