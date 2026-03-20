import posthog from "posthog-js";

const POSTHOG_KEY = "phc_R4nkf2hrG0UlcEctqFZfJwjJwDuTrqxvTkhqqjt7HBq";
const POSTHOG_HOST = "https://eu.i.posthog.com";

export function initPostHog() {
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
