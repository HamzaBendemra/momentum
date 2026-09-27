import { Component, useEffect, useState, type ReactNode } from "react";
import { liveQuery } from "dexie";
import Focus from "./Focus";
import Proof from "./Proof";
import Review from "./Review";
import Settings from "./Settings";
import { today, type Workspace } from "./model";
import { getWorkspaceDB, mutateWorkspace, readWorkspace } from "./repository";
import { demoWorkspace } from "./demo";
const github = "https://github.com/HamzaBendemra/momentum";
const surfaces = [
  ["focus", "Focus"],
  ["proof", "Proof"],
  ["review", "Review"],
  ["settings", "Settings & Data"],
];
function Landing({ skills = false }: { skills?: boolean }) {
  return (
    <div className="landing">
      <nav className="landing-nav" aria-label="Main">
        <a className="brand" href="#/">
          <span className="brand-mark">M</span>Momentum
        </a>
        <div className="actions">
          <a href={`${github}/blob/main/method/METHOD.md`}>The method</a>
          <a href={github}>GitHub ↗</a>
        </div>
      </nav>
      <p className="notice">
        <strong>Beta</strong> · Browser coverage is still limited.
        Keep backups and see the{" "}
        <a href={`${github}/blob/main/docs/COMPATIBILITY.md`}>
          verification record
        </a>.
      </p>
      {!skills && (
        <>
          <header className="landing-hero">
            <p className="eyebrow">
              A local app. Three portable skills. One useful loop.
            </p>
            <h1>
              Turn a goal into
              <br />
              <em>today’s outcome.</em>
            </h1>
            <p className="hero-description">
              And a record of what changed.
              <br />
              Choose a finish, keep the evidence, and make a better next
              decision.
            </p>
            <div className="entry-points">
              <a className="entry" href="#/focus">
                <span className="eyebrow">Make room for the work</span>
                <strong>
                  Try the app <span>↗</span>
                </strong>
                <span>
                  A quiet workspace in your browser. No account needed.
                </span>
              </a>
              <a className="entry" href="#/skills">
                <span className="eyebrow">Think with your agent</span>
                <strong>
                  Use the skills <span>↗</span>
                </strong>
                <span>Bring the same method to the tools you already use.</span>
              </a>
            </div>
            <a className="demo-link" href="#/demo/focus">
              Explore a fictional demo first →
            </a>
          </header>
          <section className="story-card">
            <div>
              <p className="eyebrow">
                A field guide to urban trees · fictional example
              </p>
              <h2>
                A smaller promise.
                <br />
                <em>A clearer finish.</em>
              </h2>
              <p>A campaign can take months. Today should fit in a sentence.</p>
            </div>
            <div className="story-outcome">
              <span className="pill">NOW</span>
              <h3>A printable route draft ready for one reader.</h3>
              <p>
                <strong>Proof</strong> A dated draft with five tree
                descriptions.
              </p>
              <p>
                <strong>Next decision</strong> Test whether someone can follow
                it.
              </p>
            </div>
          </section>
          <section className="principles">
            <article>
              <span>01</span>
              <h2>One outcome is enough.</h2>
              <p>
                One Now. Up to three Next. A plan that makes trade-offs visible
                without grading your day.
              </p>
            </article>
            <article>
              <span>02</span>
              <h2>Proof before a bigger story.</h2>
              <p>
                Keep intentions, finished work, recorded evidence and claimed
                impact distinct.
              </p>
            </article>
            <article>
              <span>03</span>
              <h2>Return without catching up.</h2>
              <p>
                Rest days are part of the plan. Close the day easily. Re-enter
                where you are.
              </p>
            </article>
          </section>
        </>
      )}
      <section className="skills-section" id="skills">
        <p className="eyebrow">The same method, wherever you think</p>
        {skills ? (
          <h1>
            Three skills.<em>No new dashboard required.</em>
          </h1>
        ) : (
          <h2 className="small-heading">
            Three skills.<em>No new dashboard required.</em>
          </h2>
        )}
        <p className="intro">
          Use your own notes or a selected Markdown export. The skills propose
          and draft; you decide what to do.
        </p>
        <div className="skill-grid">
          {[
            [
              "choose-outcome",
              "Choose an outcome",
              "Turn goals and constraints into one plausible finish, with the trade-offs visible.",
            ],
            [
              "review-week",
              "Review the week",
              "Read the evidence, name what remains unknown, and choose one adjustment.",
            ],
            [
              "build-narrative",
              "Build a narrative",
              "Draft an accomplishment story that shows its sources and marks unsupported claims.",
            ],
          ].map(([slug, title, description]) => (
            <article className="card" key={slug}>
              <h2>{title}</h2>
              <p>{description}</p>
              <a href={`${github}/tree/main/skills/momentum-${slug}`}>
                Read the skill →
              </a>
            </article>
          ))}
        </div>
        <div className="actions">
          <a
            className="button primary"
            href={`${github}/blob/main/docs/SKILLS.md`}
          >
            Installation & examples
          </a>
          <a
            className="button"
            href={`${github}/releases/tag/v${__APP_VERSION__}`}
          >
            Download skills
          </a>
        </div>
        <p className="subtle">
          Tested in Codex CLI 0.149.0. Claude Code, ChatGPT and Cowork remain
          unverified. Install from the repository folders or the beta downloads.
          Keep each skill’s references and license intact.
        </p>
      </section>
      <section className="card contribute">
        <div>
          <p className="eyebrow">Build something useful with us</p>
          <h2>Small, thoughtful contributions welcome.</h2>
          <p>
            Improve an empty state, test a keyboard flow, add a fictional
            example, or challenge a skill with difficult evidence.
          </p>
        </div>
        <div className="actions">
          <a
            className="button primary"
            href={`${github}/issues?q=is%3Aissue%20is%3Aopen%20label%3A%22good%20first%20issue%22`}
          >
            Find a first contribution
          </a>
          <a className="button" href={`${github}/discussions`}>
            Questions & ideas
          </a>
        </div>
      </section>
      <footer>
        <span>Momentum {__APP_VERSION__} · Beta · MIT · English first</span>
        <span>Local data · No account · No telemetry</span>
        <a href={`${github}/blob/main/docs/PRIVACY.md`}>Privacy & recovery</a>
      </footer>
    </div>
  );
}
function WorkspaceApp({
  kind,
  route,
}: {
  kind: Workspace["kind"];
  route: string;
}) {
  const [db] = useState(() => getWorkspaceDB(kind));
  const [w, setW] = useState<Workspace | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [clock, setClock] = useState(() => Date.now());
  const [offlineReady, setOfflineReady] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let alive = true;
    let sub: { unsubscribe: () => void } | undefined;
    readWorkspace(db, kind)
      .then(async (initial) => {
        if (
          kind === "demo" &&
          initial.revision === 0 &&
          !initial.campaigns.length
        )
          await mutateWorkspace(db, (d) => {
            if (!d.campaigns.length) Object.assign(d, demoWorkspace());
          });
        if (alive)
          sub = liveQuery(() => db.state.get("workspace")).subscribe({
            next: (row) => {
              if (row && alive) setW(row.value);
            },
            error: () => {
              if (alive)
                setError(
                  "Browser storage could not be read. Retry or open Settings & Data to download the last loaded workspace.",
                );
            },
          });
      })
      .catch(() => {
        if (alive)
          setError(
            "Momentum could not open browser storage. Allow site storage and retry. Your workspace has not been replaced.",
          );
      });
    return () => {
      alive = false;
      sub?.unsubscribe();
    };
  }, [db, kind, retry]);
  useEffect(() => {
    const id = setInterval(() => setClock(Date.now()), 30000);
    const listen = () => setClock(Date.now());
    window.addEventListener("focus", listen);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", listen);
    };
  }, []);
  useEffect(() => {
    const ready = () => setOfflineReady(true);
    window.addEventListener("momentum-offline-ready", ready);
    if (import.meta.env.PROD && "serviceWorker" in navigator)
      void navigator.serviceWorker.ready.then(ready);
    return () => window.removeEventListener("momentum-offline-ready", ready);
  }, []);
  useEffect(() => {
    document.title = `${surfaces.find(([r]) => r === route)?.[1] || "Focus"} · Momentum${kind === "demo" ? " demo" : ""}`;
    document.getElementById("main")?.focus();
  }, [route, kind]);
  const report = (text: string, isError = false) => {
    if (isError) {
      setError(text);
      setNotice("");
    } else {
      setNotice(text);
      setError("");
    }
  };
  const act = async (
    change: (draft: Workspace) => void,
    message = "Saved.",
  ) => {
    try {
      await mutateWorkspace(db, change);
      report(message);
      return true;
    } catch (e) {
      report(
        e instanceof Error && e.name !== "ZodError"
          ? e.message
          : "Could not save. Check required fields, dates, and references. Existing data was kept.",
        true,
      );
      return false;
    }
  };
  const date = w ? today(w.settings.timezone, new Date(clock)) : "";
  const prefix = kind === "demo" ? "/demo" : "";
  const page = surfaces.some(([r]) => r === route) ? route : "focus";
  return (
    <div className="app-shell">
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <aside className="side-rail">
        <a className="brand" href="#/">
          <span className="brand-mark">M</span>Momentum
        </a>
        <p className="rail-caption">One useful loop.</p>
        <nav aria-label="Workspace">
          {surfaces.map(([id, label]) => (
            <a
              key={id}
              aria-current={id === page ? "page" : undefined}
              href={`#${prefix}/${id}`}
            >
              {label}
              <span aria-hidden="true">{id === page ? "•" : "↗"}</span>
            </a>
          ))}
        </nav>
        <div className="rail-bottom">
          <a href={kind === "demo" ? "#/focus" : "#/demo/focus"}>
            {kind === "demo"
              ? "Open my real workspace"
              : "Explore fictional demo"}
          </a>
          <a href="#/skills">Use the skills</a>
          <small>
            {offlineReady ? "Offline ready" : "Browser storage · local only"}
          </small>
          <small>Beta · {__APP_VERSION__}</small>
        </div>
      </aside>
      <main id="main" className="app-stage" tabIndex={-1}>
        {kind === "demo" && (
          <div className="demo-banner">
            <strong>Fictional demo</strong>
            <span>
              Every example record is invented. Your real workspace is separate.
            </span>
            <a href="#/focus">Start your own →</a>
          </div>
        )}
        {error && (
          <div className="notice error" role="alert">
            <span>{error}</span>
            <button
              onClick={() => {
                setError("");
                setRetry((n) => n + 1);
              }}
            >
              Retry storage
            </button>
            <button onClick={() => setError("")} aria-label="Dismiss error">
              ×
            </button>
          </div>
        )}
        {notice && (
          <div className="notice" role="status">
            <span>{notice}</span>
            <button onClick={() => setNotice("")} aria-label="Dismiss status">
              ×
            </button>
          </div>
        )}
        {w ? (
          <div className="page" key={`${page}-${date}`}>
            {page === "focus" ? (
              <Focus {...{ w, date, act }} />
            ) : page === "proof" ? (
              <Proof {...{ w, date, act }} />
            ) : page === "review" ? (
              <Review {...{ w, date, act }} />
            ) : (
              <Settings {...{ w, date, act, db, report }} />
            )}
          </div>
        ) : (
          <div className="page">
            <h1>
              {error ? "Storage needs attention" : "Opening your workspace…"}
            </h1>
            <p>No account or credentials are needed.</p>
          </div>
        )}
      </main>
    </div>
  );
}
export default function App() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const update = () => setHash(location.hash);
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const segments = hash.replace(/^#\/?/, "").split("/");
  if (!segments[0] || segments[0] === "skills")
    return <Landing skills={segments[0] === "skills"} />;
  const demo = segments[0] === "demo";
  return (
    <WorkspaceApp
      key={demo ? "demo" : "real"}
      kind={demo ? "demo" : "real"}
      route={segments[demo ? 1 : 0] || "focus"}
    />
  );
}
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="page">
        <h1>Momentum couldn’t display this page.</h1>
        <p>
          Your browser records have not been intentionally changed. Reload to
          retry.
        </p>
        <button onClick={() => location.reload()}>Reload</button>
        <a
          className="button"
          href="https://github.com/HamzaBendemra/momentum/issues"
        >
          Report with a synthetic example
        </a>
      </main>
    ) : (
      this.props.children
    );
  }
}
