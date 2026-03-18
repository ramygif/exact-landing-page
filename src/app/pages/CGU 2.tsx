import { useNavigate } from "react-router";

export function CGU() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F2F0EB] text-black font-sans">
      <nav className="border-b-[2px] border-black bg-white">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <span className="font-black tracking-tighter text-2xl lowercase cursor-pointer hover:opacity-70" onClick={() => navigate('/')}>exact</span>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">Conditions generales d'utilisation</h1>
        <div className="prose prose-lg font-secondary space-y-6">
          <p>Derniere mise a jour : Mars 2026</p>
          <h2 className="text-2xl font-black uppercase mt-8">1. Service</h2>
          <p>Exact est une application macOS de correction et reformulation de texte propulsee par l'IA. L'acces au service necessite un abonnement actif.</p>
          <h2 className="text-2xl font-black uppercase mt-8">2. Abonnement</h2>
          <p>L'abonnement Exact Pro est facture mensuellement a 6,99 EUR TTC. Vous pouvez annuler a tout moment via le portail Stripe. L'acces reste actif jusqu'a la fin de la periode payee.</p>
          <h2 className="text-2xl font-black uppercase mt-8">3. Utilisation</h2>
          <p>Chaque compte est limite a un seul appareil Mac. Le partage de compte est interdit. La limite quotidienne est de 100 corrections par jour.</p>
          <h2 className="text-2xl font-black uppercase mt-8">4. Responsabilite</h2>
          <p>Exact utilise l'IA pour ses corrections. Les resultats peuvent contenir des erreurs. L'utilisateur reste responsable de la verification finale de ses textes.</p>
          <h2 className="text-2xl font-black uppercase mt-8">5. Contact</h2>
          <p>Pour toute question : contact@getexact.app</p>
        </div>
      </div>
    </div>
  );
}
