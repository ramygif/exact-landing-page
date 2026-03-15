import { Link } from "react-router";

export function Confidentialite() {
  return (
    <div className="min-h-screen bg-[#F2F0EB] text-black font-sans selection:bg-[#0000FF] selection:text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F2F0EB] border-b-[2px] border-black">
        <div className="w-full px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <span className="font-black tracking-tighter text-2xl lowercase">exact</span>
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-12">
            Politique de confidentialité
          </h1>

          <div className="space-y-10 font-secondary text-lg leading-relaxed">
            <p className="text-black/60 font-bold uppercase text-sm tracking-wider">
              Dernière mise à jour : 15 mars 2026
            </p>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">1. Responsable du traitement</h2>
              <p>
                Le responsable du traitement des données est <strong>Ramy Djebbi</strong>, éditeur du service Exact, accessible à l'adresse{" "}
                <strong>getexact.app</strong>.
              </p>
              <p className="mt-2">
                Contact : <a href="mailto:ramydjebbi09@gmail.com" className="underline hover:text-[#0000FF]">ramydjebbi09@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">2. Données collectées</h2>
              <p>
                Nous collectons uniquement votre <strong>adresse email</strong>, fournie volontairement via le formulaire d'inscription à la liste d'attente.
              </p>
              <p className="mt-2">
                Aucune autre donnée personnelle n'est collectée. Nous ne collectons pas de cookies de suivi, d'adresse IP à des fins d'identification, ni de données de navigation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">3. Finalité du traitement</h2>
              <p>Votre adresse email est collectée dans le seul but de :</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Vous notifier du lancement d'Exact</li>
                <li>Vous communiquer des informations relatives au service (accès anticipé, tarifs préférentiels)</li>
              </ul>
              <p className="mt-2">
                Base légale : votre <strong>consentement explicite</strong> (article 6.1.a du RGPD), recueilli via la case à cocher du formulaire d'inscription.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">4. Stockage et sous-traitant</h2>
              <p>
                Vos données sont stockées chez <strong>Brevo</strong> (anciennement Sendinblue), société française dont les serveurs sont situés dans l'Union européenne.
                Brevo est conforme au RGPD et dispose d'un Data Processing Agreement (DPA).
              </p>
              <p className="mt-2">
                Le site est hébergé par <strong>Cloudflare Pages</strong> (Cloudflare, Inc.), qui peut traiter des données techniques (adresse IP) dans le cadre de la livraison du contenu. Cloudflare est conforme au RGPD via les clauses contractuelles types (SCC).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">5. Durée de conservation</h2>
              <p>
                Votre adresse email est conservée jusqu'au lancement commercial d'Exact, et au maximum <strong>24 mois</strong> à compter de votre inscription.
                Passé ce délai, vos données seront automatiquement supprimées si aucune relation commerciale n'a été établie.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">6. Vos droits</h2>
              <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Droit d'accès</strong> : obtenir la confirmation que vos données sont traitées et en recevoir une copie</li>
                <li><strong>Droit de rectification</strong> : corriger vos données inexactes ou incomplètes</li>
                <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
                <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
                <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
                <li><strong>Droit de retrait du consentement</strong> : retirer votre consentement à tout moment</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous à :{" "}
                <a href="mailto:ramydjebbi09@gmail.com" className="underline hover:text-[#0000FF]">ramydjebbi09@gmail.com</a>
              </p>
              <p className="mt-2">
                Vous pouvez également introduire une réclamation auprès de la{" "}
                <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) :{" "}
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0000FF]">www.cnil.fr</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">7. Sécurité</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
                chiffrement en transit (HTTPS/TLS), clés API stockées côté serveur uniquement, headers de sécurité (CSP, HSTS).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">8. Modifications</h2>
              <p>
                Cette politique peut être mise à jour. En cas de modification substantielle, nous vous en informerons par email.
                La date de dernière mise à jour est indiquée en haut de cette page.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t-[2px] border-black">
            <Link to="/" className="font-bold uppercase text-sm tracking-wider hover:text-[#0000FF] transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
