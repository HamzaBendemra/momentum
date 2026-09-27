import Dexie, { type Table } from "dexie";
import {
  backupSchema,
  emptyWorkspace,
  workspaceSchema,
  type Backup,
  type Workspace,
} from "./model";
export class WorkspaceDB extends Dexie {
  readonly kind: Workspace["kind"];
  state!: Table<{ key: string; value: Workspace }, string>;
  recovery!: Table<{ id: string; backup: Backup }, string>;
  constructor(kind: Workspace["kind"], name = `momentum-public-v1-${kind}`) {
    super(name);
    this.kind = kind;
    this.version(1).stores({ state: "key", recovery: "id" });
  }
}
// At most one connection per workspace per page, including React development remounts.
const databases = new Map<Workspace["kind"], WorkspaceDB>();
export function getWorkspaceDB(kind: Workspace["kind"]) {
  let db = databases.get(kind);
  if (!db) {
    db = new WorkspaceDB(kind);
    databases.set(kind, db);
  }
  return db;
}
export function encodeBackup(w: Workspace): Backup {
  return backupSchema.parse({
    format: "momentum-public-workspace",
    version: 1,
    exportedAt: new Date().toISOString(),
    workspace: w,
  });
}
export function parseBackup(json: string, kind: Workspace["kind"]): Backup {
  if (json.length > 20_000_000)
    throw new Error("Backup is larger than the 20 MB import limit");
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new Error("This is not a valid JSON backup");
  }
  const parsed = backupSchema.safeParse(raw);
  if (!parsed.success)
    throw new Error(
      "Not a supported Momentum public v1 backup. Private-app backups and other versions cannot be restored. No data changed.",
    );
  if (parsed.data.workspace.kind !== kind)
    throw new Error(
      "Demo and real backups cannot be mixed. Switch to the matching workspace.",
    );
  return parsed.data;
}
export async function readWorkspace(db: WorkspaceDB, kind: Workspace["kind"]) {
  if (db.kind !== kind) throw new Error("Workspace database kind mismatch");
  return db.transaction("rw", db.state, async () => {
    const row = await db.state.get("workspace");
    if (row) {
      const value = workspaceSchema.parse(row.value);
      if (value.kind !== db.kind)
        throw new Error("Workspace database kind mismatch");
      return value;
    }
    const value = emptyWorkspace(kind);
    await db.state.put({ key: "workspace", value });
    return value;
  });
}
export async function mutateWorkspace(
  db: WorkspaceDB,
  mutator: (draft: Workspace) => void,
) {
  return db.transaction("rw", db.state, async () => {
    const row = await db.state.get("workspace");
    if (!row) throw new Error("Workspace is not ready");
    const draft = structuredClone(row.value);
    mutator(draft);
    draft.revision++;
    const value = workspaceSchema.parse(draft);
    if (value.kind !== db.kind) throw new Error("Cannot change workspace kind");
    await db.state.put({ key: "workspace", value });
    return value;
  });
}
export async function replaceWorkspace(
  db: WorkspaceDB,
  backup: Backup,
  kind: Workspace["kind"],
) {
  if (kind !== db.kind) throw new Error("Workspace database kind mismatch");
  const checked = parseBackup(JSON.stringify(backup), kind);
  return db.transaction("rw", db.state, db.recovery, async () => {
    const previous = await db.state.get("workspace");
    if (previous)
      await db.recovery.put({
        id: new Date().toISOString() + crypto.randomUUID(),
        backup: encodeBackup(previous.value),
      });
    const value = {
      ...checked.workspace,
      revision: (previous?.value.revision || 0) + 1,
    };
    await db.state.put({ key: "workspace", value });
    const keys = await db.recovery.orderBy("id").primaryKeys();
    if (keys.length > 5) await db.recovery.bulkDelete(keys.slice(0, -5));
    return value;
  });
}
