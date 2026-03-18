import { useNavigate } from "react-router";

export function Confidentialite() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F2F0EB] text-black font-sans">
      <nav className="border-b-[2px] border-black bg-white">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <span className="font-black tracking-tighter text-2xl lowercase cursor-pointer hover:opacity-70" onClick={() => navigate('/')}>exact</span>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">Politique de confidentialite</h1>
        <div className="prose prose-lg font-secondary space-y-6">
          <p>Derniere mise a jour : Mars 2026</p>
          <h2 className="text-2xl font-black uppercase mt-8">1. Donnees collectees</h2>
          <p>Exact collecte uniquement : votre adresse email, un hash de mot de passe (bcrypt), et un identifiant unique de votre Mac (hash SHA-256 du numero de serie). Aucun texte que vous corrigez n'est stocke.</p>
          <h2 className="text-2xl font-black uppercase mt-8">2. Utilisation des donnees</h2>
          <p>Vos donnees servent exclusivement a : authentifier votre compte, valider votre licence, et gerer votre abonnement via Stripe.</p>
          <h2 className="text-2xl font-black uppercase mt-8">3. Textes corriges</h2>
          <p>Les textes que vous corrigez sont envoyes a l'API Gemini (Google) pour traitement, puis immediatement renvoyes a votre Mac. Aucun texte n'est stocke sur nos serveurs ni par Google au-dela du traitement immediat.</p>
          <h2 className="text-2xl font-black uppercase mt-8">4. Paiement</h2>
          <p>Les paiements sont geres par Stripe. Nous ne stockons aucune information bancaire. Stripe est certifie PCI DSS Level 1.</p>
          <h2 className="text-2xl font-black uppercase mt-8">5. Contact</h2>
          <p>Pour toute question : contact@getexact.app</p>
        </div>
      </div>
    </div>
  );
}
