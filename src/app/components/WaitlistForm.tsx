import React, { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

interface WaitlistFormProps {
  variant?: "hero" | "cta";
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WaitlistForm({ variant = "hero" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!emailRegex.test(email)) {
      setErrorMsg("Adresse email invalide.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": import.meta.env.VITE_BREVO_API_KEY,
        },
        body: JSON.stringify({
          email,
          listIds: [Number(import.meta.env.VITE_BREVO_LIST_ID)],
          updateEnabled: true,
        }),
      });

      if (res.ok || res.status === 204) {
        setStatus("success");
        return;
      }

      const data = await res.json().catch(() => null);

      if (data?.code === "duplicate_parameter") {
        setStatus("success");
        return;
      }

      setErrorMsg(data?.message || "Une erreur est survenue. Réessayez.");
      setStatus("error");
    } catch {
      setErrorMsg("Erreur réseau. Vérifiez votre connexion.");
      setStatus("error");
    }
  }

  if (status === "success") {
    const isHero = variant === "hero";
    return (
      <div className={`flex items-center gap-3 ${isHero ? "py-2" : "py-4"}`}>
        <div className={`w-8 h-8 border-[2px] border-black flex items-center justify-center ${isHero ? "bg-[#FFD600]" : "bg-white"}`}>
          <Check className={`w-4 h-4 ${isHero ? "text-black" : "text-black"}`} />
        </div>
        <p className={`font-bold uppercase text-sm font-secondary ${isHero ? "text-black" : "text-white"}`}>
          Vous êtes sur la liste. On vous contacte bientôt.
        </p>
      </div>
    );
  }

  const isHero = variant === "hero";

  return (
    <div className="flex flex-col gap-2 w-full">
      <form
        className={`flex flex-col sm:flex-row w-full gap-2 ${isHero ? "max-w-lg" : "max-w-xl"}`}
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="VOTRE@EMAIL.COM"
          className={
            isHero
              ? "w-full font-secondary bg-white border-[2px] border-black px-5 py-4 text-black placeholder:text-gray-400 focus:outline-none focus:ring-0 font-bold uppercase text-sm"
              : "w-full bg-white text-black border-[2px] border-black px-6 py-5 focus:outline-none font-bold uppercase text-lg placeholder:text-gray-400 font-secondary"
          }
          required
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={
            isHero
              ? "w-full sm:w-auto whitespace-nowrap bg-black text-white px-8 py-4 font-bold uppercase text-sm hover:bg-[#0000FF] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              : "w-full sm:w-auto bg-black text-white px-10 py-5 font-black uppercase text-lg hover:bg-[#0000FF] transition-colors whitespace-nowrap border-[2px] border-black flex items-center justify-center gap-2 disabled:opacity-50"
          }
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              {isHero ? "Rejoindre" : "S'inscrire"} <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
      {errorMsg && (
        <p className={`text-sm font-bold ${isHero ? "text-red-600" : "text-yellow-200"}`}>
          {errorMsg}
        </p>
      )}
    </div>
  );
}
