import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LogOut, User, Shield, Download, CheckCircle, Zap, CreditCard, Loader2, XCircle } from "lucide-react";
import { reportClientError, LABELS } from "../utils/tracker";

const API = "https://exact-api.ramydjebbi.workers.dev";

export function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const token = localStorage.getItem("exact_token");

  useEffect(() => { if (!token) { navigate("/auth"); return; } fetchUser(); }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      reportClientError({ component: "Dashboard", action: "fetch_user" }, err instanceof Error ? err.message : "erreur");
    }
    setLoading(false);
  };

  const logout = () => { localStorage.removeItem("exact_token"); localStorage.removeItem("exact_email"); navigate("/auth"); };

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch(`${API}/api/stripe/portal`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else reportClientError(LABELS.DASH_PORTAL, "URL portail absente");
    } catch (err) {
      reportClientError(LABELS.DASH_PORTAL, err instanceof Error ? err.message : "erreur");
    }
    setPortalLoading(false);
  };

  const subscribe = async () => {
    try {
      const res = await fetch(`${API}/api/stripe/checkout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else reportClientError(LABELS.DASH_SUBSCRIBE, "URL checkout absente");
    } catch (err) {
      reportClientError(LABELS.DASH_SUBSCRIBE, err instanceof Error ? err.message : "erreur");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#F2F0EB] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  const isActive = user?.subscription_status === "active";
  const initials = user?.email?.slice(0, 2).toUpperCase() || "??";

  return (
    <div className="min-h-screen bg-[#F2F0EB] text-black font-sans flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-white border-b-[2px] md:border-b-0 md:border-r-[2px] border-black flex flex-col z-10 sticky top-0 h-auto md:h-screen">
        <div className="p-6 border-b-[2px] border-black flex items-center justify-between md:justify-start">
          <span className="font-black tracking-tighter text-3xl lowercase cursor-pointer" onClick={() => navigate('/')}>exact</span>
          <button className="md:hidden bg-black text-white p-2 border-[2px] border-black" onClick={logout}><LogOut className="w-4 h-4" /></button>
        </div>
        <nav className="flex-1 flex flex-col p-4 md:p-6 gap-2">
          <div className="flex items-center gap-3 px-4 py-3 font-bold uppercase text-xs sm:text-sm border-[2px] border-black bg-[#FFD600] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><User className="w-5 h-5" /> Mon Compte</div>
        </nav>
        <div className="p-6 border-t-[2px] border-black mt-auto hidden md:block">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#FF4D00] border-[2px] border-black flex items-center justify-center font-black text-white text-xs">{initials}</div>
            <div><p className="font-bold text-sm uppercase truncate max-w-[160px]">{user?.email}</p><p className="text-xs font-secondary text-gray-600">{isActive ? "Abonne" : "Pas d'abonnement"}</p></div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-3 font-bold uppercase text-xs bg-black text-white border-[2px] border-black hover:bg-red-600 transition-colors"><LogOut className="w-4 h-4" /> Deconnexion</button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto w-full">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
          <header><h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">Espace Client</h1><p className="text-gray-600 font-secondary text-lg">Gerez votre licence et telechargez l'app.</p></header>

          <div className={`${isActive ? "bg-[#0000FF]" : "bg-gray-800"} text-white border-[2px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8`}>
            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2 border-b-[2px] border-white pb-4"><Shield className="w-5 h-5" /> Ma Licence</h3>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className={`inline-flex items-center gap-1 ${isActive ? "bg-[#00FF00] text-black" : "bg-red-500 text-white"} font-bold uppercase text-xs px-2 py-1 border-[2px] border-black mb-4`}>
                  {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Statut : {isActive ? "Actif" : "Inactif"}
                </div>
                <h2 className="text-2xl font-black uppercase mb-2">{isActive ? "Exact Pro — 6,99 EUR/mois" : "Aucun abonnement"}</h2>
                <p className="font-secondary text-sm opacity-90">{isActive ? "Corrections illimitees. Mises a jour incluses." : "Abonnez-vous pour utiliser Exact."}</p>
              </div>
              {isActive ? (
                <div className="flex flex-col gap-3 w-full md:w-auto">
                  <a href="https://github.com/ramygif/exact-landing-page/releases/download/v1.0.0/Exact-Installer.dmg" download className="bg-white text-black border-[2px] border-black px-6 py-4 font-black uppercase text-sm hover:bg-[#FFD600] transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none"><Download className="w-5 h-5" /> Telecharger l'App</a>
                  <button onClick={openPortal} disabled={portalLoading} className="bg-transparent text-white border-[2px] border-white px-6 py-3 font-bold uppercase text-xs hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2">
                    {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />} Gerer mon abonnement
                  </button>
                </div>
              ) : (
                <button onClick={subscribe} className="bg-[#00FF00] text-black border-[2px] border-black px-8 py-4 font-black uppercase text-sm hover:bg-[#FFD600] transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none"><Zap className="w-5 h-5" /> S'abonner — 6,99 EUR/mois</button>
              )}
            </div>
          </div>

          <div className="bg-white border-[2px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2 border-b-[2px] border-black pb-4"><User className="w-5 h-5" /> Profil</h3>
            <div className="flex flex-col gap-5">
              <div><label className="block font-bold uppercase text-xs mb-1.5 text-gray-700">Email</label><input type="email" value={user?.email || ""} readOnly className="w-full font-secondary bg-gray-50 border-[2px] border-black px-3 py-2.5" /></div>
              <div><label className="block font-bold uppercase text-xs mb-1.5 text-gray-700">Membre depuis</label><input type="text" value={user?.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR") : "—"} readOnly className="w-full font-secondary bg-gray-50 border-[2px] border-black px-3 py-2.5" /></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
