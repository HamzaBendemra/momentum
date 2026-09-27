import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Focus from "./Focus";
import { demoWorkspace } from "./demo";
import { addDays, saveCommitment, today } from "./model";

describe("workspace navigation isolation", () => {
  it("keeps outcome and reentry links inside the fictional demo", () => {
    const w = demoWorkspace();
    const date = today(w.settings.timezone);
    saveCommitment(w, date, "demo-guide", "A fictional daily outcome");
    const render = (at: string) =>
      renderToStaticMarkup(
        createElement(Focus, { w, date: at, act: async () => true }),
      );
    const links = [
      ...`${render(date)} ${render(addDays(date, 7))}`.matchAll(
        /href="(#[^"]+)"/g,
      ),
    ].map((match) => match[1]);
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(links.every((link) => link.startsWith("#/demo/"))).toBe(true);
  });
});
