import React, { useRef, useEffect } from "react";
import { Command, Sparkles, Zap, CheckCircle, TextCursor, Download, User, Mic, Bot, Layers } from "lucide-react";
import { useNavigate } from "react-router";
import posthog from "posthog-js";
import { MacOsAnimation } from "../components/MacOsAnimation";

const API = "https://exact-api.ramydjebbi.workers.dev";

export function Home() {
  const navigate = useNavigate();
  const ctaRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const isLoggedIn = !!localStorage.getItem("exact_token");

  // Track sections viewed
  const sectionsTracked = useRef(new Set<string>());
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const names = ["hero", "how_it_works", "features", "pricing", "roadmap", "cta"];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Array.from(sections).indexOf(entry.target as Element);
          const name = names[idx] || `section_${idx}`;
          if (!sectionsTracked.current.has(name)) {
            sectionsTracked.current.add(name);
            posthog.capture("section_viewed", { section: name });
          }
        }
      });
    }, { threshold: 0.3 });
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Track time on page
  useEffect(() => {
    const start = Date.now();
    return () => {
      posthog.capture("time_on_page", { seconds: Math.round((Date.now() - start) / 1000) });
    };
  }, []);

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); posthog.capture("click_logo"); };
  const scrollToPricing = () => { pricingRef.current?.scrollIntoView({ behavior: 'smooth' }); posthog.capture("click_voir_offre"); };

  const handleSubscribe = async () => {
    posthog.capture("click_commencer", { logged_in: isLoggedIn });
    const token = localStorage.getItem("exact_token");
    if (!token) { navigate("/auth"); return; }
    try {
      const res = await fetch(`${API}/api/stripe/checkout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.url) { posthog.capture("checkout_redirect"); window.location.href = data.url; }
    } catch { navigate("/auth"); }
  };

  return (
    <div className="min-h-screen bg-[#F2F0EB] text-black font-sans selection:bg-[#0000FF] selection:text-white overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F2F0EB] border-b-[2px] border-black">
        <div className="w-full px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity" onClick={scrollToTop}>
            <span className="font-black tracking-tighter text-2xl lowercase">exact</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(isLoggedIn ? '/dashboard' : '/auth')}
              className="hidden sm:flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white border-[2px] border-black text-black px-3 sm:px-4 py-2 hover:bg-[#FFD600] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <User className="w-3.5 h-3.5" /> {isLoggedIn ? "Mon compte" : "Se connecter"}
            </button>
            <button 
              onClick={scrollToPricing}
              className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-black border-[2px] border-black text-[#F2F0EB] px-3 sm:px-4 py-2 hover:bg-[#0000FF] transition-colors"
            >
              Voir l'offre
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-6 border-b-[2px] border-black">
        <div className="max-w-7xl mx-auto flex flex-col items-start">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 border-[2px] border-black bg-[#FFD600] text-[10px] sm:text-xs text-black font-bold uppercase tracking-wider mb-6 md:mb-8">
            <Zap className="w-3.5 h-3.5" />
            Disponible maintenant sur macOS
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-black tracking-tighter mb-6 md:mb-8 leading-[0.9] text-black uppercase">
            Écrivez parfaitement,<br className="hidden md:block" /> partout sur Mac.
          </h1>
          
          <div className="flex flex-col gap-8 md:gap-12 w-full mt-4 md:mt-8">
            {/* Realistic macOS Mockup area - Full width below */}
            <div className="w-full mt-4">
              <MacOsAnimation />
            </div>

            <div className="flex flex-col gap-6 md:gap-8 w-full max-w-4xl border-t-[2px] border-black pt-8 md:pt-12">
              <p className="text-black text-lg sm:text-xl md:text-2xl font-medium max-w-2xl leading-snug font-secondary">
                L'application de barre de menus propulsée par l'IA qui corrige et reformule vos textes instantanément via un simple raccourci clavier.
              </p>

              <div className="flex flex-col gap-4 w-full max-w-lg">
                <div className="flex flex-col sm:flex-row w-full gap-3">
                  <button 
                    onClick={scrollToPricing}
                    className="flex-1 whitespace-nowrap px-6 py-4 font-black uppercase text-sm transition-all duration-300 flex items-center justify-center gap-2 border-[2px] border-black bg-black text-white hover:bg-[#0000FF] cursor-pointer"
                  >
                    <Download className="w-5 h-5" /> Télécharger (macOS)
                  </button>
                  <button 
                    onClick={scrollToPricing}
                    className="flex-1 whitespace-nowrap px-6 py-4 font-black uppercase text-sm transition-all duration-300 flex items-center justify-center gap-2 border-[2px] border-black bg-white text-black hover:bg-[#FFD600] cursor-pointer"
                  >
                    Voir l'offre
                  </button>
                </div>
                
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="flex -space-x-2 font-secondary">
                    <div className="w-8 h-8 border-[2px] border-black bg-[#FFD600] flex items-center justify-center text-[10px] font-bold">AM</div>
                    <div className="w-8 h-8 border-[2px] border-black bg-[#FF4D00] flex items-center justify-center text-[10px] font-bold text-white">JB</div>
                    <div className="w-8 h-8 border-[2px] border-black bg-[#0000FF] flex items-center justify-center text-[10px] font-bold text-white">SL</div>
                  </div>
                  <span className="font-secondary">Rejoignez des <strong>milliers</strong> de puristes macOS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b-[2px] border-black bg-white">
        <div className="grid md:grid-cols-3 divide-y-[2px] md:divide-y-0 md:divide-x-[2px] divide-black">
          
          {[
            { 
              icon: <TextCursor className="w-8 h-8" />, 
              title: "Sélectionnez votre texte", 
              desc: "Surlignez le texte que vous souhaitez corriger ou améliorer dans n'importe quelle application macOS.",
              bg: "bg-[#FFD600]",
              text: "text-black"
            },
            { 
              icon: <Command className="w-8 h-8" />, 
              title: "Appuyez sur le raccourci", 
              desc: "Utilisez ⌃ Espace (ou votre raccourci personnalisé) pour analyser instantanément le texte avec l'IA.",
              bg: "bg-[#0000FF]",
              text: "text-white"
            },
            { 
              icon: <Zap className="w-8 h-8" />, 
              title: "Texte corrigé", 
              desc: "Le texte est automatiquement remplacé par la version parfaite. Vous pouvez continuer à écrire.",
              bg: "bg-black",
              text: "text-white"
            }
          ].map((step, i) => (
            <div key={i} className={`p-10 ${step.bg} ${step.text} flex flex-col justify-between min-h-[320px]`}>
               <div>
                 <div className="font-black text-6xl opacity-50 mb-6 font-secondary">0{i+1}</div>
                 <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 leading-tight">{step.title}</h3>
               </div>
               <div>
                 <div className="mb-6">{step.icon}</div>
                 <p className="font-medium text-lg leading-snug font-secondary">{step.desc}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 px-4 md:px-6 border-b-[2px] border-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">Conçu pour les<br/>puristes du Mac.</h2>
            <p className="text-lg md:text-xl font-medium max-w-2xl font-secondary">Tout ce dont vous avez besoin pour des écrits impeccables, avec la rapidité et l'élégance que vous attendez d'une app native.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
             <div className="border-[2px] border-black bg-white p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
               <div className="w-14 h-14 md:w-16 md:h-16 border-[2px] border-black bg-[#FFD600] flex items-center justify-center mb-6 md:mb-8">
                  <CheckCircle className="w-7 h-7 md:w-8 md:h-8" />
               </div>
               <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3 md:mb-4">Correction orthographique</h3>
               <p className="font-medium text-base md:text-lg leading-relaxed font-secondary">
                 Éliminez les fautes de frappe, les erreurs de grammaire et la ponctuation douteuse avec une précision redoutable.
               </p>
             </div>
             
             <div className="border-[2px] border-black bg-[#0000FF] text-white p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
               <div className="w-14 h-14 md:w-16 md:h-16 border-[2px] border-white bg-black flex items-center justify-center mb-6 md:mb-8">
                  <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-white" />
               </div>
               <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3 md:mb-4">Reformulation intelligente</h3>
               <p className="font-medium text-base md:text-lg leading-relaxed font-secondary">
                 Adaptez le ton de vos messages (plus professionnel, plus direct, plus amical) en un seul clic ou prompt.
               </p>
             </div>
             
             <div className="border-[2px] border-black bg-white p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
               <div className="w-14 h-14 md:w-16 md:h-16 border-[2px] border-black bg-[#FF4D00] flex items-center justify-center mb-6 md:mb-8">
                  <svg viewBox="0 0 30 30" fill="currentColor" className="w-7 h-7 md:w-8 md:h-8 text-white">
                    <path d="M25.565,9.785c-0.123,0.077-3.051,1.702-3.051,5.305c0.138,4.109,3.695,5.55,3.756,5.55 c-0.061,0.077-0.537,1.963-1.947,3.94C23.204,26.283,21.962,28,20.076,28c-1.794,0-2.438-1.135-4.508-1.135 c-2.223,0-2.852,1.135-4.554,1.135c-1.886,0-3.22-1.809-4.4-3.496c-1.533-2.208-2.836-5.673-2.882-9 c-0.031-1.763,0.307-3.496,1.165-4.968c1.211-2.055,3.373-3.45,5.734-3.496c1.809-0.061,3.419,1.242,4.523,1.242 c1.058,0,3.036-1.242,5.274-1.242C21.394,7.041,23.97,7.332,25.565,9.785z M15.001,6.688c-0.322-1.61,0.567-3.22,1.395-4.247 c1.058-1.242,2.729-2.085,4.17-2.085c0.092,1.61-0.491,3.189-1.533,4.339C18.098,5.937,16.488,6.872,15.001,6.688z"></path>
                  </svg>
               </div>
               <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3 md:mb-4">Fonctionne partout</h3>
               <p className="font-medium text-base md:text-lg leading-relaxed font-secondary">
                 Mail, Slack, Messages, Safari, Word... Exact s'intègre nativement à toutes vos applications macOS.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-16 md:py-24 px-4 md:px-6 border-b-[2px] border-black bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">Investissez dans<br/>votre productivité.</h2>
            <p className="text-lg md:text-xl font-medium max-w-2xl font-secondary">Un outil natif puissant qui rentabilise son prix dès la première semaine d'utilisation.</p>
          </div>
          
          <div className="flex justify-center max-w-5xl mx-auto">
            <div className="w-full max-w-lg border-[2px] border-black bg-[#FFD600] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">
              <div className="absolute top-0 right-0 bg-black text-white text-[10px] md:text-xs font-bold uppercase px-4 py-2 border-b-[2px] border-l-[2px] border-black">
                Accès Complet
              </div>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">Pro</h3>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-6xl md:text-7xl font-black tracking-tighter">5,99€</span>
                <span className="text-lg md:text-xl font-medium font-secondary">/ mois</span>
              </div>
              <ul className="flex flex-col gap-5 mb-12 flex-1 font-secondary font-medium text-lg">
                <li className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-black flex-shrink-0"/> Correction et reformulation illimitées</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-black flex-shrink-0"/> Raccourci natif macOS</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-black flex-shrink-0"/> Mises à jour incluses</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-black flex-shrink-0"/> Support prioritaire</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-black flex-shrink-0"/> Utilisation sur 3 Mac simultanés</li>
              </ul>
              <button onClick={handleSubscribe} className="w-full bg-black text-white border-[2px] border-black px-6 py-5 font-black uppercase hover:bg-[#0000FF] transition-colors text-base md:text-lg flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none">
                <Zap className="w-6 h-6" /> Commencer maintenant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap / Vision */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#E0E0E0] border-b-[2px] border-black overflow-hidden relative">
        {/* Decorative Grid Background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, transparent 1px)',
            backgroundSize: '40px 40px' 
          }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            <div className="lg:w-5/12">
              <div className="inline-block px-4 py-1 bg-black text-white font-bold text-xs uppercase tracking-widest mb-6 border-[2px] border-black">
                Roadmap
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6 drop-shadow-[4px_4px_0_white]">
                Ce n'est que<br/>le début.
              </h2>
              <p className="text-lg md:text-xl font-medium font-secondary leading-relaxed bg-white border-[2px] border-black p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Aujourd'hui, nous perfectionnons vos écrits. Demain, nous redéfinissons toute votre interaction avec macOS. La révolution Exact ne fait que commencer.
              </p>
            </div>
            
            <div className="lg:w-7/12 grid sm:grid-cols-2 gap-6 w-full mt-8 lg:mt-0">
              <div className="border-[2px] border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="w-12 h-12 bg-[#00FF00] border-[2px] border-black flex items-center justify-center mb-6">
                  <Mic className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg md:text-xl font-black uppercase mb-3 leading-tight">Dictée<br/>Intelligente</h3>
                <p className="font-secondary font-medium text-sm md:text-base text-black/80">
                  Parlez naturellement. L'IA transcrit votre voix en texte parfaitement rédigé, ponctué et formaté.
                </p>
              </div>
              
              <div className="border-[2px] border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="w-12 h-12 bg-[#FF4D00] border-[2px] border-black flex items-center justify-center mb-6">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-black uppercase mb-3 leading-tight">Overlay<br/>macOS</h3>
                <p className="font-secondary font-medium text-sm md:text-base text-black/80">
                  Une interface IA flottante, non intrusive et omniprésente, directement incrustée par-dessus vos apps.
                </p>
              </div>
              
              <div className="border-[2px] border-black bg-black text-white p-6 shadow-[4px_4px_0px_0px_rgba(255,214,0,1)] md:shadow-[6px_6px_0px_0px_rgba(255,214,0,1)] sm:col-span-2 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(255,214,0,1)] transition-all">
                <div className="w-12 h-12 bg-[#FFD600] border-[2px] border-white flex items-center justify-center mb-6">
                  <Bot className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl md:text-2xl font-black uppercase mb-3 leading-tight text-[#FFD600]">Chatbot Contextuel</h3>
                <p className="font-secondary font-medium text-sm md:text-base text-white/90 max-w-xl">
                  Posez des questions, générez du contenu et analysez votre écran via un assistant ultra-puissant qui comprend toujours votre contexte de travail.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Waitlist CTA Section */}
      <section ref={ctaRef} className="bg-[#FF4D00] text-white border-b-[2px] border-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-32 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          
          <div className="flex-1 w-full text-center md:text-left">
            <h2 className="text-5xl sm:text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.85] mb-6 md:mb-8">
              Écrivez<br/>sans<br/>limite.
            </h2>
            <p className="text-lg md:text-2xl font-bold max-w-lg mx-auto md:mx-0 mb-8 md:mb-12 font-secondary uppercase">
              Téléchargez Exact aujourd'hui et transformez définitivement votre façon de communiquer sur Mac.
            </p>
            
            <div className="flex flex-col sm:flex-row w-full max-w-xl mx-auto md:mx-0 gap-4">
              <button onClick={handleSubscribe} className="flex-1 bg-white text-black border-[2px] border-transparent px-8 py-5 font-black uppercase text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-black hover:text-white hover:border-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Download className="w-5 h-5" /> Telecharger l'App
              </button>
              <button onClick={scrollToPricing} className="flex-1 bg-transparent text-white border-[2px] border-white px-8 py-5 font-black uppercase text-sm sm:text-base flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                Voir l'offre
              </button>
            </div>
          </div>

          <div className="hidden md:flex justify-end items-center">
            
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FF4D00] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-bold uppercase tracking-wider font-secondary">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>© 2026 GETEXACT.APP. TOUS DROITS RÉSERVÉS.</span>
          </div>
          <div className="flex gap-8">
            <a href="/roadmap" onClick={() => posthog.capture("click_footer_link", { link: "roadmap" })} className="hover:text-black transition-colors">Roadmap</a>
            <a href="/confidentialite" onClick={() => posthog.capture("click_footer_link", { link: "confidentialite" })} className="hover:text-black transition-colors">Confidentialite</a>
            <a href="/cgu" onClick={() => posthog.capture("click_footer_link", { link: "cgu" })} className="hover:text-black transition-colors">CGU</a>
            <a href="mailto:contact@getexact.app" onClick={() => posthog.capture("click_footer_link", { link: "contact" })} className="hover:text-black transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
