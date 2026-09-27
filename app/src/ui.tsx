import type { FormEvent, ReactNode } from "react";
import type { Workspace } from "./model";
export type Act = (
  change: (draft: Workspace) => void,
  message?: string,
) => Promise<boolean>;
export type ViewProps = { w: Workspace; date: string; act: Act };
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function Header({
  eyebrow,
  title,
  accent,
  children,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>
        {title}
        <em>{accent}</em>
      </h1>
      {children && <p className="intro">{children}</p>}
    </header>
  );
}
export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}
export function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  return new FormData(event.currentTarget);
}
export const value = (f: FormData, key: string) =>
  String(f.get(key) || "").trim();
export function CampaignOptions({
  w,
  includeArchived = false,
}: {
  w: Workspace;
  includeArchived?: boolean;
}) {
  return (
    <>
      {w.campaigns
        .filter((c) => includeArchived || !c.archived)
        .map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
            {c.archived ? " (archived)" : ""}
          </option>
        ))}
    </>
  );
}
export function Scope({
  w,
  ids,
  setIds,
  from,
  setFrom,
  to,
  setTo,
}: {
  w: Workspace;
  ids: string[];
  setIds: (ids: string[]) => void;
  from: string;
  setFrom: (date: string) => void;
  to: string;
  setTo: (date: string) => void;
}) {
  return (
    <div className="scope">
      <fieldset>
        <legend>Include campaigns</legend>
        {w.campaigns.map((c) => (
          <label className="check" key={c.id}>
            <input
              type="checkbox"
              checked={ids.includes(c.id)}
              onChange={(e) =>
                setIds(
                  e.target.checked
                    ? [...ids, c.id]
                    : ids.filter((id) => id !== c.id),
                )
              }
            />
            {c.name}
            {c.archived ? " (archived)" : ""}
          </label>
        ))}
      </fieldset>
      <div className="two-col">
        <Field label="From">
          <input
            type="date"
            required
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </Field>
        <Field label="Through">
          <input
            type="date"
            required
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}
