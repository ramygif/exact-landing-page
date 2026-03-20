import React, { useState, useEffect } from "react";
import posthog from "posthog-js";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("exact_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem("exact_cookie_consent", "accepted");
    posthog.opt_in_capturing();
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem("exact_cookie_consent", "refused");
    posthog.opt_out_capturing();
    setVisible(false);
  };

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: "#111", borderTop: "2px solid #333",
      padding: "12px 20px", display: "flex", alignItems: "center",
      justifyContent: "space-between", gap: 12, flexWrap: "wrap",
      fontFamily: "system-ui, sans-serif", fontSize: 13, color: "#ccc",
    }}>
      <span>
        Ce site utilise des cookies pour ameliorer votre experience.{" "}
        <a href="/confidentialite" style={{ color: "#60a5fa", textDecoration: "underline" }}>En savoir plus</a>
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={refuse} style={{
          background: "none", border: "1px solid #555", borderRadius: 4,
          padding: "6px 14px", color: "#999", fontSize: 12, cursor: "pointer",
        }}>Refuser</button>
        <button onClick={accept} style={{
          background: "#2563eb", border: "none", borderRadius: 4,
          padding: "6px 14px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
        }}>Accepter</button>
      </div>
    </div>
  );
}
