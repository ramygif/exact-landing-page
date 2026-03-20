const API = "https://exact-api.ramydjebbi.workers.dev";

// Labels pour chaque composant/action trackable
export const LABELS = {
  // Auth page
  AUTH_LOGIN_BTN: { component: "Auth", action: "clic_se_connecter" },
  AUTH_REGISTER_BTN: { component: "Auth", action: "clic_creer_compte" },
  AUTH_SWITCH_MODE: { component: "Auth", action: "clic_basculer_mode" },

  // Home page
  HOME_NAVBAR_LOGIN: { component: "Navbar", action: "clic_se_connecter" },
  HOME_NAVBAR_OFFRE: { component: "Navbar", action: "clic_voir_offre" },
  HOME_HERO_DOWNLOAD: { component: "Hero", action: "clic_telecharger" },
  HOME_HERO_OFFRE: { component: "Hero", action: "clic_voir_offre" },
  HOME_PRICING_COMMENCER: { component: "Pricing", action: "clic_commencer" },
  HOME_CTA_DOWNLOAD: { component: "CTA", action: "clic_telecharger" },
  HOME_CTA_OFFRE: { component: "CTA", action: "clic_voir_offre" },
  HOME_FOOTER_ROADMAP: { component: "Footer", action: "clic_roadmap" },
  HOME_FOOTER_CONFIDENTIALITE: { component: "Footer", action: "clic_confidentialite" },
  HOME_FOOTER_CGU: { component: "Footer", action: "clic_cgu" },
  HOME_FOOTER_CONTACT: { component: "Footer", action: "clic_contact" },

  // Dashboard
  DASH_DOWNLOAD: { component: "Dashboard", action: "clic_telecharger_app" },
  DASH_PORTAL: { component: "Dashboard", action: "clic_gerer_abonnement" },
  DASH_SUBSCRIBE: { component: "Dashboard", action: "clic_sabonner" },
  DASH_LOGOUT: { component: "Dashboard", action: "clic_deconnexion" },

  // Success
  SUCCESS_DOWNLOAD: { component: "Success", action: "clic_telecharger" },
  SUCCESS_DASHBOARD: { component: "Success", action: "clic_espace_client" },
} as const;

type Label = typeof LABELS[keyof typeof LABELS];

export function reportClientError(label: Label, errorMessage: string, context?: string) {
  const page = window.location.pathname;
  const email = localStorage.getItem("exact_email") || undefined;

  fetch(`${API}/api/client-error`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      component: label.component,
      action: label.action,
      error_message: errorMessage,
      page,
      user_email: email,
      context,
    }),
  }).catch(() => {});
}

// Catch all unhandled errors globally
export function installGlobalErrorHandler() {
  window.addEventListener("error", (e) => {
    reportClientError(
      { component: "Global", action: "unhandled_error" },
      `${e.message} at ${e.filename}:${e.lineno}`,
      e.error?.stack?.slice(0, 300)
    );
  });

  window.addEventListener("unhandledrejection", (e) => {
    reportClientError(
      { component: "Global", action: "unhandled_promise" },
      String(e.reason)?.slice(0, 300)
    );
  });
}
