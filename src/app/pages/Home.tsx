import React, { useState, useRef, useEffect } from "react";
import { Command, Sparkles, Zap, CheckCircle, TextCursor, ArrowRight, Loader2, Video, Bot, Layers } from "lucide-react";
import { Link } from "react-router";
import { posthog, emailDomain } from "../utils/posthog";
import { MacOsAnimation } from "../components/MacOsAnimation";
import { reportError } from "../utils/error-tracker";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function subscribe(email: string): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch {
    return { ok: false, message: "Erreur reseau. Verifiez votre connexion." };
  }
}

export function Home() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const [heroEmail, setHeroEmail] = useState("");
  const [ctaEmail, setCtaEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");

  // Scroll tracking via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll("[data-track-section]");
    const fired = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const name = (entry.target as HTMLElement).dataset.trackSection;
            if (name && !fired.has(name)) {
              fired.add(name);
              posthog.capture("section_viewed", { section: name });
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((s) => observer.observe(s));

    // Scroll depth via sentinels
    const depthFired = new Set<number>();
    const depthSentinels = document.querySelectorAll("[data-scroll-depth]");
    const depthObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const depth = Number((entry.target as HTMLElement).dataset.scrollDepth);
            if (depth && !depthFired.has(depth)) {
              depthFired.add(depth);
              posthog.capture("scroll_depth", { depth });
            }
          }
        });
      },
      { threshold: 0.1 }
    );
    depthSentinels.forEach((s) => depthObserver.observe(s));

    return () => {
      observer.disconnect();
      depthObserver.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCTA = (source: string) => {
    ctaRef.current?.scrollIntoView({ behavior: 'smooth' });
    posthog.capture("cta_clicked", { button_name: "rejoindre_waitlist", section: source });
  };

  const handleSubscribe = async (e: React.FormEvent, email: string) => {
    e.preventDefault();
    if (isSubscribed) return;
    setError("");

    if (!emailRegex.test(email)) {
      setError("Adresse email invalide.");
      return;
    }

    setIsSubmitting(true);
    const result = await subscribe(email);
    setIsSubmitting(false);

    if (result.ok) {
      setIsSubscribed(true);
      posthog.capture("waitlist_email_submitted", { email_domain: emailDomain(email), source: email === heroEmail ? "hero" : "cta" });
    } else {
      const msg = result.message || "Une erreur est survenue.";
      setError(msg);
      posthog.capture("waitlist_email_failed", { error_type: msg, source: email === heroEmail ? "hero" : "cta" });
      const formLocation = email === heroEmail ? "Hero" : "CTA";
      reportError(`WaitList-${formLocation}`, "submit_email", msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F0EB] text-black font-sans selection:bg-[#0000FF] selection:text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F2F0EB] border-b-[2px] border-black">
        <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity" onClick={scrollToTop}>
            <span className="font-black tracking-tighter text-2xl lowercase">exact</span>
          </div>
          <button
            onClick={() => scrollToCTA("navbar")}
            className="text-xs font-bold uppercase tracking-wider bg-black text-white border-[2px] border-black px-4 py-2 hover:bg-[#E8732A] hover:border-[#E8732A] transition-colors"
          >
            Rejoindre la waitlist
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 border-b-[2px] border-black" data-track-section="hero">
        <div className="max-w-7xl mx-auto flex flex-col items-start">

          <div className="inline-flex items-center gap-2 px-3 py-1 border-[2px] border-black bg-[#FFD600] text-xs text-black font-bold uppercase tracking-wider mb-6 cursor-default select-none">
            <Zap className="w-3.5 h-3.5" />
            Lancement prochain sur macOS
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-6 leading-[0.9] text-black uppercase">
            Ecrivez parfaitement,<br className="hidden md:block" /> partout sur Mac.
          </h1>

          <p className="text-black text-lg sm:text-xl md:text-2xl font-medium max-w-2xl leading-snug font-secondary mb-8">
            Corrigez et reformulez vos textes instantanement sur macOS. Un raccourci clavier, et c'est fait.
          </p>

          {/* Hero CTA — above the fold */}
          <div className="flex flex-col gap-4 w-full max-w-xl">
            <form
              className="flex flex-col sm:flex-row w-full gap-2"
              onSubmit={(e) => handleSubscribe(e, heroEmail)}
            >
              <input
                type="email"
                value={heroEmail}
                onChange={(e) => setHeroEmail(e.target.value)}
                placeholder="VOTRE@EMAIL.COM"
                className="w-full font-secondary bg-white border-[2px] border-black px-5 py-4 text-black placeholder:text-gray-400 focus:outline-none focus:ring-0 font-bold uppercase text-sm disabled:opacity-50"
                required
                disabled={isSubmitting || isSubscribed}
              />
              <button
                type="submit"
                disabled={isSubmitting || isSubscribed || !consent}
                className={`w-full sm:w-auto whitespace-nowrap px-8 py-4 font-black uppercase text-sm transition-all duration-200 flex items-center justify-center gap-2 border-[2px] border-black disabled:opacity-40 disabled:cursor-not-allowed
                  ${isSubscribed
                    ? "bg-[#00FF00] text-black cursor-default"
                    : "bg-[#E8732A] text-white hover:scale-[1.02] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                  }`}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> En cours</>
                ) : isSubscribed ? (
                  <><CheckCircle className="w-4 h-4" /> Inscrit !</>
                ) : (
                  <>Rejoindre la waitlist <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
            {!isSubscribed && (
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-black border-[2px] border-black flex-shrink-0"
                />
                <span className="text-xs font-secondary text-black/70 leading-snug">
                  J'accepte de recevoir des communications d'Exact.{" "}
                  <Link to="/confidentialite" className="underline hover:text-[#0000FF]">Politique de confidentialite</Link>
                </span>
              </label>
            )}
            {error && <p className="text-red-600 text-sm font-bold">{error}</p>}

            <div className="flex items-center gap-3 text-sm font-medium cursor-default select-none">
              <div className="flex -space-x-2 font-secondary">
                <div className="w-8 h-8 border-[2px] border-black bg-[#FFD600] flex items-center justify-center text-[10px] font-bold">AM</div>
                <div className="w-8 h-8 border-[2px] border-black bg-[#FF4D00] flex items-center justify-center text-[10px] font-bold text-white">JB</div>
                <div className="w-8 h-8 border-[2px] border-black bg-[#0000FF] flex items-center justify-center text-[10px] font-bold text-white">SL</div>
              </div>
              <span className="font-secondary">Rejoignez <strong className="font-sans">240+</strong> personnes en liste d'attente</span>
            </div>
          </div>

          <div className="w-full mt-8">
            <MacOsAnimation />
          </div>
        </div>
      </section>

      {/* Scroll depth 25% sentinel */}
      <div data-scroll-depth="25" className="h-0" />

      {/* How it works */}
      <section className="border-b-[2px] border-black bg-white" data-track-section="how-it-works">
        <div className="grid md:grid-cols-3 divide-y-[2px] md:divide-y-0 md:divide-x-[2px] divide-black">
          {[
            { icon: <TextCursor className="w-8 h-8" />, title: "Selectionnez votre texte", desc: "Surlignez le texte que vous souhaitez corriger dans n'importe quelle application macOS.", bg: "bg-[#FFD600]", text: "text-black" },
            { icon: <Command className="w-8 h-8" />, title: "Appuyez sur le raccourci", desc: "Utilisez Ctrl+Espace pour analyser instantanement le texte avec l'IA.", bg: "bg-[#0000FF]", text: "text-white" },
            { icon: <Zap className="w-8 h-8" />, title: "Texte corrige", desc: "Le texte est automatiquement remplace par la version parfaite.", bg: "bg-black", text: "text-white" }
          ].map((step, i) => (
            <div key={i} className={`p-8 sm:p-10 ${step.bg} ${step.text} flex flex-col justify-between min-h-[280px] sm:min-h-[320px] cursor-default select-none`}>
               <div>
                 <div className="font-black text-5xl sm:text-6xl opacity-50 mb-4 sm:mb-6 font-secondary">0{i+1}</div>
                 <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 leading-tight">{step.title}</h3>
               </div>
               <div>
                 <div className="mb-4 sm:mb-6">{step.icon}</div>
                 <p className="font-medium text-base sm:text-lg leading-snug font-secondary">{step.desc}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scroll depth 50% sentinel */}
      <div data-scroll-depth="50" className="h-0" />

      {/* Features — cards scroll vers waitlist */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-b-[2px] border-black" data-track-section="features">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">Concu pour les<br/>puristes du Mac.</h2>
            <p className="text-lg sm:text-xl font-medium max-w-2xl font-secondary">Tout ce dont vous avez besoin pour des ecrits impeccables, avec la rapidite et l'elegance d'une app native.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
             <div onClick={() => scrollToCTA("feature-correction")} className="border-[2px] border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
               <div className="w-14 h-14 sm:w-16 sm:h-16 border-[2px] border-black bg-[#FFD600] flex items-center justify-center mb-6 sm:mb-8">
                  <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8" />
               </div>
               <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-4">Correction orthographique</h3>
               <p className="font-medium text-base sm:text-lg leading-relaxed font-secondary flex-1">
                 Eliminez les fautes de frappe, les erreurs de grammaire et la ponctuation douteuse.
               </p>
               <span className="mt-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-[#E8732A]">Rejoindre la waitlist <ArrowRight className="w-4 h-4" /></span>
             </div>

             <div onClick={() => scrollToCTA("feature-reformulation")} className="border-[2px] border-black bg-[#0000FF] text-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
               <div className="w-14 h-14 sm:w-16 sm:h-16 border-[2px] border-white bg-black flex items-center justify-center mb-6 sm:mb-8">
                  <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
               </div>
               <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-4">Reformulation intelligente</h3>
               <p className="font-medium text-base sm:text-lg leading-relaxed font-secondary flex-1">
                 Adaptez le ton de vos messages : professionnel, direct ou amical.
               </p>
               <span className="mt-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2">Rejoindre la waitlist <ArrowRight className="w-4 h-4" /></span>
             </div>

             <div onClick={() => scrollToCTA("feature-partout")} className="border-[2px] border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all sm:col-span-2 md:col-span-1">
               <div className="w-14 h-14 sm:w-16 sm:h-16 border-[2px] border-black bg-[#FF4D00] flex items-center justify-center mb-6 sm:mb-8">
                  <svg viewBox="0 0 30 30" fill="currentColor" className="w-7 h-7 sm:w-8 sm:h-8 text-white" aria-label="Logo Apple" role="img">
                    <path d="M25.565,9.785c-0.123,0.077-3.051,1.702-3.051,5.305c0.138,4.109,3.695,5.55,3.756,5.55 c-0.061,0.077-0.537,1.963-1.947,3.94C23.204,26.283,21.962,28,20.076,28c-1.794,0-2.438-1.135-4.508-1.135 c-2.223,0-2.852,1.135-4.554,1.135c-1.886,0-3.22-1.809-4.4-3.496c-1.533-2.208-2.836-5.673-2.882-9 c-0.031-1.763,0.307-3.496,1.165-4.968c1.211-2.055,3.373-3.45,5.734-3.496c1.809-0.061,3.419,1.242,4.523,1.242 c1.058,0,3.036-1.242,5.274-1.242C21.394,7.041,23.97,7.332,25.565,9.785z M15.001,6.688c-0.322-1.61,0.567-3.22,1.395-4.247 c1.058-1.242,2.729-2.085,4.17-2.085c0.092,1.61-0.491,3.189-1.533,4.339C18.098,5.937,16.488,6.872,15.001,6.688z"></path>
                  </svg>
               </div>
               <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-4">Fonctionne partout</h3>
               <p className="font-medium text-base sm:text-lg leading-relaxed font-secondary flex-1">
                 Mail, Slack, Messages, Safari, Word... Exact s'integre a toutes vos apps macOS.
               </p>
               <span className="mt-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-[#E8732A]">Rejoindre la waitlist <ArrowRight className="w-4 h-4" /></span>
             </div>
          </div>
        </div>
      </section>

      {/* Scroll depth 75% sentinel */}
      <div data-scroll-depth="75" className="h-0" />

      {/* Roadmap / Vision — cards scroll vers waitlist */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#E0E0E0] border-b-[2px] border-black overflow-hidden relative" data-track-section="roadmap">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

            <div className="lg:w-5/12">
              <div className="inline-block px-4 py-1 bg-black text-white font-bold text-xs uppercase tracking-widest mb-6 border-[2px] border-black cursor-default select-none">
                Roadmap
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6 drop-shadow-[4px_4px_0_white]">
                Ce n'est que<br/>le debut.
              </h2>
              <p className="text-lg sm:text-xl font-medium font-secondary leading-relaxed bg-white border-[2px] border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-default">
                Aujourd'hui, nous perfectionnons vos ecrits. Demain, nous redefinissons toute votre interaction avec macOS.
              </p>
            </div>

            <div className="lg:w-7/12 grid sm:grid-cols-2 gap-4 sm:gap-6 w-full">
              <div onClick={() => scrollToCTA("roadmap-transcription")} className="border-[2px] border-black bg-white p-5 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00FF00] border-[2px] border-black flex items-center justify-center mb-4 sm:mb-6">
                  <Video className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                </div>
                <h3 className="text-lg sm:text-xl font-black uppercase mb-3 leading-tight">Transcription<br/>Video</h3>
                <p className="font-secondary font-medium text-black/80 text-sm sm:text-base">
                  Convertissez l'audio de n'importe quelle video ou reunion en texte parfait.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E8732A]">Etre notifie <ArrowRight className="w-3 h-3" /></span>
              </div>

              <div onClick={() => scrollToCTA("roadmap-overlay")} className="border-[2px] border-black bg-white p-5 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF4D00] border-[2px] border-black flex items-center justify-center mb-4 sm:mb-6">
                  <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-black uppercase mb-3 leading-tight">Overlay<br/>macOS</h3>
                <p className="font-secondary font-medium text-black/80 text-sm sm:text-base">
                  Une interface IA flottante, directement incrustee par-dessus vos apps.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E8732A]">Etre notifie <ArrowRight className="w-3 h-3" /></span>
              </div>

              <div onClick={() => scrollToCTA("roadmap-chatbot")} className="border-[2px] border-black bg-black text-white p-5 sm:p-6 shadow-[6px_6px_0px_0px_rgba(255,214,0,1)] sm:col-span-2 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(255,214,0,1)] transition-all cursor-pointer">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFD600] border-[2px] border-white flex items-center justify-center mb-4 sm:mb-6">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase mb-3 leading-tight text-[#FFD600]">Chatbot Contextuel</h3>
                <p className="font-secondary font-medium text-white/90 max-w-xl text-sm sm:text-base">
                  Posez des questions, generez du contenu et analysez votre ecran via un assistant qui comprend votre contexte.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFD600]">Etre notifie <ArrowRight className="w-3 h-3" /></span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Scroll depth 100% sentinel */}
      <div data-scroll-depth="100" className="h-0" />

      {/* Waitlist CTA Section */}
      <section ref={ctaRef} id="waitlist" className="bg-[#FF4D00] text-white border-b-[2px] border-white" data-track-section="waitlist-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">

          <div className="flex-1">
            <h2 className="text-5xl sm:text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.85] mb-6 sm:mb-8">
              Soyez<br/>parmi les<br/>premiers.
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl font-bold max-w-lg mb-8 sm:mb-12 font-secondary uppercase">
              Rejoignez la liste d'attente pour un acces anticipe et un tarif preferentiel.
            </p>

            <form
              className="flex flex-col sm:flex-row w-full max-w-xl gap-2"
              onSubmit={(e) => handleSubscribe(e, ctaEmail)}
            >
              <input
                type="email"
                value={ctaEmail}
                onChange={(e) => setCtaEmail(e.target.value)}
                placeholder="VOTRE@EMAIL.COM"
                className="w-full bg-white text-black border-[2px] border-black px-5 sm:px-6 py-4 sm:py-5 focus:outline-none font-bold uppercase text-base sm:text-lg placeholder:text-gray-400 font-secondary disabled:opacity-50"
                required
                disabled={isSubmitting || isSubscribed}
              />
              <button
                type="submit"
                disabled={isSubmitting || isSubscribed || !consent}
                className={`w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 font-black uppercase text-base sm:text-lg transition-all duration-200 whitespace-nowrap border-[2px] border-black flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed
                  ${isSubscribed
                    ? "bg-[#00FF00] text-black cursor-default"
                    : "bg-black text-white hover:scale-[1.02] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] cursor-pointer"
                  }`}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> ...</>
                ) : isSubscribed ? (
                  <><CheckCircle className="w-5 h-5" /> INSCRIT !</>
                ) : (
                  "Rejoindre la waitlist"
                )}
              </button>
            </form>
            {!isSubscribed && (
              <label className="flex items-start gap-3 cursor-pointer select-none mt-4">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-white border-[2px] border-white flex-shrink-0"
                />
                <span className="text-xs font-secondary text-white/70 leading-snug">
                  J'accepte de recevoir des communications d'Exact.{" "}
                  <Link to="/confidentialite" className="underline hover:text-white">Politique de confidentialite</Link>
                </span>
              </label>
            )}
            {error && <p className="text-yellow-200 text-sm font-bold mt-2">{error}</p>}
          </div>

          <div className="hidden md:flex justify-end items-center">
            <ArrowRight className="w-48 lg:w-64 h-48 lg:h-64 text-white" />
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FF4D00] text-white py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-bold uppercase tracking-wider font-secondary">
          <div className="flex items-center gap-2 cursor-default select-none">
            <Sparkles className="w-4 h-4" />
            <span>&copy; 2026 GETEXACT.APP. TOUS DROITS RESERVES.</span>
          </div>
          <div className="flex gap-6 sm:gap-8">
            <Link to="/confidentialite" className="hover:text-black transition-colors">Confidentialite</Link>
            <Link to="/cgu" className="hover:text-black transition-colors">CGU</Link>
            <a href="mailto:ramydjebbi09@gmail.com" className="hover:text-black transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
