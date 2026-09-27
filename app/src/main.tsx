import React from "react";
import ReactDOM from "react-dom/client";
import App, { ErrorBoundary } from "./App";
import "./styles.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  void navigator.serviceWorker
    .register(`${import.meta.env.BASE_URL}sw.js`, {
      scope: import.meta.env.BASE_URL,
    })
    .then(() => navigator.serviceWorker.ready)
    .then(() => window.dispatchEvent(new Event("momentum-offline-ready")))
    .catch(() => {
      /* The app remains usable online; no offline-ready claim is shown. */
    });
}
