import { useNavigate } from "react-router";
import { CheckCircle, Download, ArrowRight } from "lucide-react";

export function Success() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F2F0EB] text-black font-sans flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-lg bg-white border-[2px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-[#00FF00] border-[2px] border-black flex items-center justify-center mx-auto mb-8"><CheckCircle className="w-10 h-10 text-black" /></div>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4">Paiement reussi !</h1>
        <p className="font-secondary text-lg text-gray-600 mb-10">Votre abonnement Exact Pro est actif. Telechargez l'application pour commencer.</p>
        <div className="flex flex-col gap-4">
          <a href="https://github.com/ramygif/exact-landing-page/releases/download/v1.0.0/Exact-Installer.dmg" download className="w-full bg-black text-white border-[2px] border-black px-6 py-5 font-black uppercase text-sm hover:bg-[#0000FF] transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none"><Download className="w-5 h-5" /> Telecharger Exact pour macOS</a>
          <button onClick={() => navigate("/dashboard")} className="w-full bg-white text-black border-[2px] border-black px-6 py-4 font-black uppercase text-sm hover:bg-[#FFD600] transition-colors flex items-center justify-center gap-2">Mon espace client <ArrowRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
