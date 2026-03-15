import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import App from "./app/App.tsx";
import "./styles/index.css";

posthog.init("phc_R4nkf2hrG0UlcEctqFZfJwjJwDuTrqxvTkhqqjt7HBq", {
  api_host: "https://eu.i.posthog.com",
  person_profiles: "identified_only",
  capture_pageview: true,
  capture_pageleave: true,
  autocapture: true,
});

createRoot(document.getElementById("root")!).render(<App />);
