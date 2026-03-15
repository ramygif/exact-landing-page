interface Env {
  BREVO_API_KEY: string;
  BREVO_LIST_ID: string;
}

const ALLOWED_ORIGINS = [
  "https://getexact.app",
  "https://www.getexact.app",
  "https://exact-landing-page.pages.dev",
];

function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin") || "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export const onRequestOptions: PagesFunction<Env> = async ({ request }) => {
  return new Response(null, { headers: getCorsHeaders(request) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const cors = getCorsHeaders(request);
  const headers = { "Content-Type": "application/json", ...cors };

  if (!env.BREVO_API_KEY || !env.BREVO_LIST_ID) {
    return new Response(
      JSON.stringify({ ok: false, message: "Configuration serveur manquante." }),
      { status: 500, headers }
    );
  }

  // Parse body
  let email: string;
  try {
    const body = await request.json<{ email?: string }>();
    email = (body.email || "").trim().toLowerCase();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, message: "Requête invalide." }),
      { status: 400, headers }
    );
  }

  // Validate email (server-side)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 254) {
    return new Response(
      JSON.stringify({ ok: false, message: "Adresse email invalide." }),
      { status: 400, headers }
    );
  }

  // Call Brevo
  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [Number(env.BREVO_LIST_ID)],
        updateEnabled: true,
      }),
    });

    if (res.ok || res.status === 204) {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    const data = await res.json().catch(() => null) as { code?: string } | null;

    if (data?.code === "duplicate_parameter") {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    // Never forward raw Brevo error messages to the client
    return new Response(
      JSON.stringify({ ok: false, message: "Inscription impossible. Réessayez plus tard." }),
      { status: 502, headers }
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, message: "Erreur serveur. Réessayez plus tard." }),
      { status: 502, headers }
    );
  }
};
