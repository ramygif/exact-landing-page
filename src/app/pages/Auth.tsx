import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, UserPlus, LogIn, Loader2 } from "lucide-react";

const API = "https://exact-api.ramydjebbi.workers.dev";

export function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur de connexion");
        setLoading(false);
        return;
      }

      localStorage.setItem("exact_token", data.token);
      localStorage.setItem("exact_email", data.user.email);

      if (!isLogin && data.user.subscription_status !== "active") {
        const checkoutRes = await fetch(`${API}/api/stripe/checkout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${data.token}` },
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) { window.location.href = checkoutData.url; return; }
      }

      navigate("/dashboard");
    } catch {
      setError("Erreur reseau. Verifiez votre connexion.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F0EB] text-black font-sans selection:bg-[#0000FF] selection:text-white flex flex-col items-center justify-center p-4 md:p-8">
      <div className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/')}>
        <span className="font-black tracking-tighter text-2xl md:text-3xl lowercase">exact</span>
      </div>

      <div className="w-full max-w-md bg-white border-[2px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10 relative">
        <div className="absolute -top-4 -right-4 bg-[#FFD600] border-[2px] border-black text-black font-black uppercase text-xs px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-3">
          {isLogin ? "Bon retour" : "Bienvenue"}
        </div>

        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">
          {isLogin ? "Connexion" : "Inscription"}
        </h1>
        <p className="font-secondary text-sm md:text-base text-gray-600 mb-8">
          {isLogin ? "Accedez a votre compte et gerez votre licence Exact." : "Creez votre compte pour obtenir votre licence Exact."}
        </p>

        {error && (
          <div className="bg-red-50 border-[2px] border-red-500 text-red-700 px-4 py-3 mb-6 font-secondary text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 flex flex-col">
          <div className="space-y-2">
            <label className="font-black uppercase text-xs tracking-wider">Adresse email</label>
            <input type="email" placeholder="john@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F2F0EB] border-[2px] border-black px-4 py-3 font-secondary focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
          </div>
          <div className="space-y-2">
            <label className="font-black uppercase text-xs tracking-wider">Mot de passe</label>
            <input type="password" placeholder="Min. 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8}
              className="w-full bg-[#F2F0EB] border-[2px] border-black px-4 py-3 font-secondary focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#00FF00] text-black border-[2px] border-black px-6 py-4 mt-4 font-black uppercase text-sm hover:bg-[#FFD600] transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none group disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isLogin ? <><LogIn className="w-5 h-5" /> Se connecter</> : <><UserPlus className="w-5 h-5" /> Creer mon compte</>}
            {!loading && <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-[2px] border-black text-center">
          <p className="font-secondary text-sm text-gray-600 mb-3">{isLogin ? "Pas de compte ?" : "Deja un compte ?"}</p>
          <button onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-black font-black uppercase text-xs tracking-wider hover:underline underline-offset-4 decoration-2">
            {isLogin ? "S'inscrire" : "Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}
