import React from "react";
import { Command, Sparkles, Zap, CheckCircle, Apple, TextCursor, ArrowRight } from "lucide-react";
import { MacOsAnimation } from "../components/MacOsAnimation";

export function Home() {
  // Le composant principal Home qui englobe toute la landing page
  return (
    // Conteneur principal : hauteur minimale d'écran, fond cassé (#F2F0EB), texte noir, 
    // et personnalisation de la couleur de sélection du texte (fond bleu, texte blanc)
    <div className="min-h-screen bg-[#F2F0EB] text-black font-sans selection:bg-[#0000FF] selection:text-white overflow-x-hidden">
      
      {/* Section Navigation (Navbar) */}
      {/* Fixée en haut (fixed top-0), z-index élevé pour rester au-dessus, fond de même couleur et bordure noire style brutaliste */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F2F0EB] border-b-[2px] border-black">
        {/* Conteneur pour aligner le logo à gauche et le bouton à droite avec un padding */}
        <div className="w-full px-6 h-16 flex items-center justify-between">
          
          {/* Groupe logo : alignement vertical centré */}
          <div className="flex items-center gap-2">
            {/* Nom de l'app "exact" : typographie très grasse (font-black), espacement réduit, tout en minuscules */}
            <span className="font-black tracking-tighter text-2xl lowercase">exact</span>
          </div>
          
          {/* Bouton d'action secondaire (Liste d'attente) : texte petit, gras, majuscule, fond transparent mais bordure épaisse, effet hover inversant les couleurs */}
          <button className="text-xs font-bold uppercase tracking-wider bg-transparent border-[2px] border-black text-black px-4 py-2 hover:bg-black hover:text-[#F2F0EB] transition-colors">
            Rejoindre la liste d'attente
          </button>
        </div>
      </nav>

      {/* Section Hero (En-tête principale) */}
      {/* Espacement en haut (pt-32) pour compenser la navbar fixe, padding en bas, bordure noire de séparation */}
      <section className="pt-32 pb-24 px-6 border-b-[2px] border-black">
        {/* Centrage du contenu avec une largeur maximale, disposition en colonne (flex-col) alignée à gauche */}
        <div className="max-w-7xl mx-auto flex flex-col items-start">
          
          {/* Badge de statut ("Lancement prochain") : fond jaune vif, texte majuscule gras, bordure noire */}
          <div className="inline-flex items-center gap-2 px-3 py-1 border-[2px] border-black bg-[#FFD600] text-xs text-black font-bold uppercase tracking-wider mb-8">
            {/* Icône d'éclair (Zap) fournie par lucide-react */}
            <Zap className="w-3.5 h-3.5" />
            Lancement prochain sur macOS
          </div>
          
          {/* Titre principal (H1) : très grande taille (text-6xl à 7rem sur grand écran), graisse maximale, texte resserré et hauteur de ligne réduite (leading-[0.9]) */}
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-8 leading-[0.9] text-black uppercase">
            Écrivez parfaitement,<br className="hidden md:block" /> partout sur Mac.
          </h1>
          
          {/* Conteneur flex pour organiser la sous-description et le formulaire en colonne */}
          <div className="flex flex-col gap-12 w-full mt-8">
            {/* Sous-conteneur limitant la largeur de la description pour faciliter la lecture */}
            <div className="flex flex-col gap-8 w-full max-w-4xl">
              
              {/* Paragraphe d'accroche expliquant le produit, utilisant la police secondaire (font-secondary) */}
              <p className="text-black text-xl md:text-2xl font-medium max-w-2xl leading-snug font-secondary">
                L'application de barre de menus propulsée par l'IA qui corrige et reformule vos textes instantanément via un simple raccourci clavier.
              </p>

              {/* Conteneur du formulaire de capture d'email et de la preuve sociale */}
              <div className="flex flex-col gap-4 w-full max-w-lg">
                {/* Formulaire : disposition en colonne sur mobile, en ligne sur grand écran (sm:flex-row) */}
                <form 
                  className="flex flex-col sm:flex-row w-full gap-2"
                  onSubmit={(e) => e.preventDefault()} // Empêche le rechargement de la page à la soumission
                >
                  {/* Champ de saisie d'email : bordure épaisse, fond blanc, texte majuscule, désactivation de l'anneau de focus par défaut (focus:ring-0) */}
                  <input 
                    type="email" 
                    placeholder="VOTRE@EMAIL.COM" 
                    className="w-full font-secondary bg-white border-[2px] border-black px-5 py-4 text-black placeholder:text-gray-400 focus:outline-none focus:ring-0 font-bold uppercase text-sm"
                    required // Rend le champ obligatoire
                  />
                  {/* Bouton de soumission principal : fond noir, texte blanc, effet au survol (bleu) avec transition */}
                  <button type="submit" className="w-full sm:w-auto whitespace-nowrap bg-black text-white px-8 py-4 font-bold uppercase text-sm hover:bg-[#0000FF] transition-colors flex items-center justify-center gap-2">
                    Rejoindre <ArrowRight className="w-4 h-4" /> {/* Icône flèche droite */}
                  </button>
                </form>
                
                {/* Section de preuve sociale (Social Proof) : affiche le nombre de personnes en liste d'attente */}
                <div className="flex items-center gap-3 text-sm font-medium">
                  {/* Conteneur pour les avatars superposés (grâce à -space-x-2 qui crée un chevauchement négatif) */}
                  <div className="flex -space-x-2 font-secondary">
                    {/* Avatar 1 : fond jaune, initiales textuelles */}
                    <div className="w-8 h-8 border-[2px] border-black bg-[#FFD600] flex items-center justify-center text-[10px] font-bold">AM</div>
                    {/* Avatar 2 : fond orange, texte blanc */}
                    <div className="w-8 h-8 border-[2px] border-black bg-[#FF4D00] flex items-center justify-center text-[10px] font-bold text-white">JB</div>
                    {/* Avatar 3 : fond bleu, texte blanc */}
                    <div className="w-8 h-8 border-[2px] border-black bg-[#0000FF] flex items-center justify-center text-[10px] font-bold text-white">SL</div>
                  </div>
                  {/* Texte d'accompagnement de la preuve sociale */}
                  <span className="font-secondary">Rejoignez <strong className="font-sans">240+</strong> personnes en liste d'attente</span>
                </div>
              </div>
            </div>

            {/* Zone de l'animation réaliste macOS (Mockup) */}
            <div className="w-full mt-4">
              {/* Import et affichage du composant gérant l'animation du faux bureau Mac */}
              <MacOsAnimation />
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
              desc: "Utilisez ⌘E (ou votre raccourci personnalisé) pour analyser instantanément le texte avec l'IA.",
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
      <section className="py-24 px-6 border-b-[2px] border-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">Conçu pour les<br/>puristes du Mac.</h2>
            <p className="text-xl font-medium max-w-2xl font-secondary">Tout ce dont vous avez besoin pour des écrits impeccables, avec la rapidité et l'élégance que vous attendez d'une app native.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
             <div className="border-[2px] border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
               <div className="w-16 h-16 border-[2px] border-black bg-[#FFD600] flex items-center justify-center mb-8">
                  <CheckCircle className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Correction orthographique</h3>
               <p className="font-medium text-lg leading-relaxed font-secondary">
                 Éliminez les fautes de frappe, les erreurs de grammaire et la ponctuation douteuse avec une précision redoutable.
               </p>
             </div>
             
             <div className="border-[2px] border-black bg-[#0000FF] text-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
               <div className="w-16 h-16 border-[2px] border-white bg-black flex items-center justify-center mb-8">
                  <Sparkles className="w-8 h-8 text-white" />
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Reformulation intelligente</h3>
               <p className="font-medium text-lg leading-relaxed font-secondary">
                 Adaptez le ton de vos messages (plus professionnel, plus direct, plus amical) en un seul clic ou prompt.
               </p>
             </div>
             
             <div className="border-[2px] border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
               <div className="w-16 h-16 border-[2px] border-black bg-[#FF4D00] flex items-center justify-center mb-8">
                  <svg viewBox="0 0 384 512" fill="currentColor" className="w-8 h-8 text-white">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.7 90.4-84.3 103.6-115.8-34.6-18.2-54.9-43.9-54.9-84.9zM207.6 11.5c31.3 0 62.7 21.6 76.6 59.4-26.4 1.4-64.8-11.1-84.1-34.6-21.7-26.8-23.9-59.5-21.3-64.8 10-1.2 27.6-2.4 28.8-2.4z"/>
                  </svg>
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Fonctionne partout</h3>
               <p className="font-medium text-lg leading-relaxed font-secondary">
                 Mail, Slack, Messages, Safari, Word... Exact s'intègre nativement à toutes vos applications macOS.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* Waitlist CTA Section */}
      <section className="bg-[#FF4D00] text-white border-b-[2px] border-white">
        <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="flex-1">
            <h2 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.85] mb-8">
              Soyez<br/>parmi les<br/>premiers.
            </h2>
            <p className="text-xl md:text-2xl font-bold max-w-lg mb-12 font-secondary uppercase">
              REJOIGNEZ LA LISTE D'ATTENTE POUR OBTENIR UN ACCÈS ANTICIPÉ ET UN TARIF PRÉFÉRENTIEL LORS DU LANCEMENT.
            </p>
            
            <form 
              className="flex flex-col sm:flex-row w-full max-w-xl gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input 
                type="email" 
                placeholder="VOTRE@EMAIL.COM" 
                className="w-full bg-white text-black border-[2px] border-black px-6 py-5 focus:outline-none font-bold uppercase text-lg placeholder:text-gray-400 font-secondary"
                required
              />
              <button type="submit" className="w-full sm:w-auto bg-black text-white px-10 py-5 font-black uppercase text-lg hover:bg-[#0000FF] transition-colors whitespace-nowrap border-[2px] border-black">
                S'inscrire
              </button>
            </form>
          </div>

          <div className="hidden md:flex justify-end items-center">
            <ArrowRight className="w-64 h-64 text-white" />
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
            <a href="#" className="hover:text-black transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-black transition-colors">CGU</a>
            <a href="#" className="hover:text-black transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
