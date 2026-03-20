const API = "https://exact-api.ramydjebbi.workers.dev";

function detectSite(): string {
  const host = window.location.hostname;
  if (host === 'getexact.app') return 'Waiting-List';
  if (host.includes('admin-dashboard')) return 'Admin';
  if (host.includes('exact-landing-page.pages.dev')) return 'LP-Dev';
  if (host === 'localhost') return 'Localhost';
  return host;
}

export function reportError(component: string, action: string, errorMessage: string, context?: string) {
  const site = detectSite();
  const page = window.location.pathname;

  fetch(`${API}/api/client-error`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      site,
      component,
      action,
      error_message: errorMessage,
      page,
      context,
    }),
  }).catch(() => {});
}

export function installErrorHandler() {
  window.addEventListener("error", (e) => {
    reportError("Global", "js_error", `${e.message} at ${e.filename}:${e.lineno}`, e.error?.stack?.slice(0, 300));
  });
  window.addEventListener("unhandledrejection", (e) => {
    reportError("Global", "promise_error", String(e.reason)?.slice(0, 300));
  });
}
