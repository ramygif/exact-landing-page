import { useNavigate } from "react-router";
import { CheckCircle, Clock, Sparkles, Mic, Layers, Bot, Zap } from "lucide-react";

const items = [
  { status: "done", label: "Correction orthographique IA", desc: "Correction instantanee via raccourci clavier dans toutes les apps macOS.", icon: <CheckCircle className="w-5 h-5" /> },
  { status: "done", label: "Reformulation intelligente", desc: "4 modes : orthographe, reformulation, formel, casual.", icon: <CheckCircle className="w-5 h-5" /> },
  { status: "done", label: "App menu bar native", desc: "Application legere dans la barre des menus, zero distraction.", icon: <CheckCircle className="w-5 h-5" /> },
  { status: "done", label: "Abonnement et espace client", desc: "Gestion du compte, paiement Stripe, telechargement de l'app.", icon: <CheckCircle className="w-5 h-5" /> },
  { status: "progress", label: "Dictee intelligente", desc: "Parlez naturellement, l'IA transcrit en texte parfaitement redige.", icon: <Mic className="w-5 h-5" /> },
  { status: "progress", label: "Overlay macOS", desc: "Interface IA flottante incrustee par-dessus vos applications.", icon: <Layers className="w-5 h-5" /> },
  { status: "planned", label: "Chatbot contextuel", desc: "Assistant IA qui comprend votre contexte de travail en temps reel.", icon: <Bot className="w-5 h-5" /> },
  { status: "planned", label: "Raccourcis personnalisables", desc: "Choisissez vos propres raccourcis clavier pour chaque mode.", icon: <Zap className="w-5 h-5" /> },
  { status: "planned", label: "Support multi-langue", desc: "Correction et reformulation en anglais, espagnol, allemand et plus.", icon: <Sparkles className="w-5 h-5" /> },
];

const statusConfig = {
  done: { label: "Livre", bg: "bg-[#00FF00]", text: "text-black", border: "border-black" },
  progress: { label: "En cours", bg: "bg-[#FFD600]", text: "text-black", border: "border-black" },
  planned: { label: "Prevu", bg: "bg-white", text: "text-black", border: "border-black" },
};

export function Roadmap() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F2F0EB] text-black font-sans">
      <nav className="border-b-[2px] border-black bg-white">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <span className="font-black tracking-tighter text-2xl lowercase cursor-pointer hover:opacity-70" onClick={() => navigate('/')}>exact</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Roadmap</h1>
        <p className="font-secondary text-lg text-gray-600 mb-12">Ce qu'on a livre, ce qu'on construit, et ce qui arrive.</p>

        <div className="space-y-4">
          {items.map((item, i) => {
            const cfg = statusConfig[item.status as keyof typeof statusConfig];
            return (
              <div key={i} className={`border-[2px] ${cfg.border} ${item.status === "done" ? "bg-white" : "bg-white"} p-5 md:p-6 flex items-start gap-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                <div className={`w-10 h-10 ${cfg.bg} border-[2px] border-black flex items-center justify-center flex-shrink-0`}>
                  {item.status === "done" ? <CheckCircle className="w-5 h-5" /> : item.status === "progress" ? <Clock className="w-5 h-5" /> : item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black uppercase text-sm md:text-base">{item.label}</h3>
                    <span className={`${cfg.bg} ${cfg.text} border-[1px] border-black text-[10px] font-bold uppercase px-2 py-0.5`}>{cfg.label}</span>
                  </div>
                  <p className="font-secondary text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 pt-8 border-t-[2px] border-black">
          <button onClick={() => navigate('/')} className="font-bold uppercase text-sm tracking-wider hover:text-[#0000FF] transition-colors">
            ← Retour a l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
