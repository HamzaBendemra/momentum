import { addDays, emptyWorkspace, today, type Workspace } from "./model";
export function demoWorkspace(): Workspace {
  const w = emptyWorkspace("demo");
  const date = today(w.settings.timezone);
  const prior = addDays(date, -3);
  const at = `${prior}T12:00:00Z`;
  const metadata = { createdAt: at, updatedAt: at };
  w.campaigns = [
    {
      ...metadata,
      id: "demo-field-guide",
      name: "A field guide to urban trees",
      purpose:
        "Help neighbours recognise five common trees on a short walk. Every record in this workspace is fictional.",
      archived: false,
    },
  ];
  w.milestones = [
    {
      ...metadata,
      id: "demo-route",
      campaignId: "demo-field-guide",
      title: "Test a five-tree walking route",
      due: prior,
      archived: false,
      completedAt: at,
    },
    {
      ...metadata,
      id: "demo-guide",
      campaignId: "demo-field-guide",
      title: "Share the first printable field guide",
      due: addDays(date, 14),
      archived: false,
      completedAt: null,
    },
    {
      ...metadata,
      id: "demo-feedback",
      campaignId: "demo-field-guide",
      title: "Revise the guide from reader feedback",
      due: addDays(date, 28),
      archived: false,
      completedAt: null,
    },
  ];
  w.priorities = { now: "demo-guide", next: ["demo-feedback"] };
  w.commitments = [
    {
      ...metadata,
      date: prior,
      milestoneId: "demo-route",
      outcome: "Walk the route and record which signs are readable",
      proofDefinition: "Annotated route notes",
      completedAt: at,
      notToday: "Designing the full guide",
    },
  ];
  w.evidence = [
    {
      ...metadata,
      id: "demo-route-notes",
      date: prior,
      campaignId: "demo-field-guide",
      milestoneId: "demo-route",
      what: "Completed a trial walk and noted two unclear turns",
      reference: "Fictional route-notes.md, revision 1",
      impact:
        "The draft now includes two clearer directions. Reader benefit has not been tested.",
    },
  ];
  w.reviews = [
    {
      ...metadata,
      id: "demo-review",
      date: addDays(date, -1),
      campaignIds: ["demo-field-guide"],
      observation:
        "The route is documented, but there is no evidence yet that a new reader can follow it.",
      decision:
        "Finish a printable draft, then ask one willing reader to try it.",
    },
  ];
  w.closures = [
    {
      date: prior,
      campaignIds: ["demo-field-guide"],
      reflection: "The walk revealed ambiguities that desk planning missed.",
      tomorrow: "Draft the route directions.",
      closedAt: at,
    },
  ];
  return w;
}
