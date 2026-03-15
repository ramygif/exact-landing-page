interface Env {
  BREVO_API_KEY: string;
  BREVO_LIST_ID: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const headers = { "Content-Type": "application/json", ...CORS_HEADERS };

  // Validate env
  if (!env.BREVO_API_KEY || !env.BREVO_LIST_ID) {
    return new Response(
      JSON.stringify({ ok: false, message: "Server misconfigured." }),
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
      JSON.stringify({ ok: false, message: "Invalid request body." }),
      { status: 400, headers }
    );
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
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

    const data = await res.json().catch(() => null) as { code?: string; message?: string } | null;

    if (data?.code === "duplicate_parameter") {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    return new Response(
      JSON.stringify({ ok: false, message: data?.message || "Erreur Brevo." }),
      { status: 502, headers }
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, message: "Erreur réseau vers Brevo." }),
      { status: 502, headers }
    );
  }
};
