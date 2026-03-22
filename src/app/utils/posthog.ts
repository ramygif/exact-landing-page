import posthog from "posthog-js";

const POSTHOG_KEY = "phc_R4nkf2hrG0UlcEctqFZfJwjJwDuTrqxvTkhqqjt7HBq";
const POSTHOG_HOST = "https://eu.i.posthog.com";

// Check if tracking should be disabled (internal traffic)
function isInternalTraffic(): boolean {
  // ?disable_tracking in URL → set flag and disable
  if (window.location.search.includes("disable_tracking")) {
    localStorage.setItem("exact_internal_user", "true");
    return true;
  }
  // ?enable_tracking in URL → remove flag and enable
  if (window.location.search.includes("enable_tracking")) {
    localStorage.removeItem("exact_internal_user");
    return false;
  }
  // Flag already set
  return localStorage.getItem("exact_internal_user") === "true";
}

export function initPostHog() {
  // Skip PostHog entirely for internal traffic
  if (isInternalTraffic()) {
    console.log("[PostHog] Internal traffic — tracking disabled");
    return;
  }

  // Check cookie consent
  const consent = localStorage.getItem("exact_cookie_consent");

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    session_recording: {
      maskAllInputs: true,
      maskInputOptions: { password: true, email: true },
    },
    persistence: "localStorage",
    opt_out_capturing_by_default: consent !== "accepted",
  });

  // If already accepted, opt in
  if (consent === "accepted") posthog.opt_in_capturing();
  if (consent === "refused") posthog.opt_out_capturing();

  // ?mark_internal → tag this user as internal in PostHog (for dashboard filters)
  // Use this BEFORE ?disable_tracking if you want to retroactively filter old data
  if (window.location.search.includes("mark_internal")) {
    posthog.identify("ramy-admin", { exact_internal_user: true, role: "admin" });
  }

  // Filter localhost traffic via super property
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    posthog.register({ is_localhost: true });
  }
}

// Extract domain only from email (RGPD — never send full email)
export function emailDomain(email: string): string {
  return email.split("@")[1] || "unknown";
}

// Scroll depth tracking (fires once per threshold per session)
export function initScrollTracking() {
  const thresholds = [25, 50, 75, 100];
  const fired = new Set<number>();

  const checkScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const percent = Math.round((scrollTop / docHeight) * 100);

    for (const t of thresholds) {
      if (percent >= t && !fired.has(t)) {
        fired.add(t);
        posthog.capture("scroll_depth", { depth: t });
      }
    }
  };

  window.addEventListener("scroll", checkScroll, { passive: true });
}

export { posthog };
