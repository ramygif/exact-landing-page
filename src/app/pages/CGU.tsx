import { Link } from "react-router";

export function CGU() {
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
            Conditions générales d'utilisation
          </h1>

          <div className="space-y-10 font-secondary text-lg leading-relaxed">
            <p className="text-black/60 font-bold uppercase text-sm tracking-wider">
              Dernière mise à jour : 15 mars 2026
            </p>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">1. Objet</h2>
              <p>
                Les présentes conditions générales d'utilisation (ci-après « CGU ») ont pour objet de définir les modalités d'accès et d'utilisation du site <strong>getexact.app</strong> et du service Exact, édité par Ramy Djebbi.
              </p>
              <p className="mt-2">
                L'inscription à la liste d'attente implique l'acceptation pleine et entière des présentes CGU.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">2. Description du service</h2>
              <p>
                Exact est une application macOS de barre de menus qui permet la correction orthographique et la reformulation de textes à l'aide de l'intelligence artificielle.
              </p>
              <p className="mt-2">
                Le service est actuellement en phase de pré-lancement. Le site getexact.app permet aux utilisateurs intéressés de s'inscrire à une liste d'attente pour être informés du lancement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">3. Éditeur du site</h2>
              <p>
                <strong>Ramy Djebbi</strong><br />
                Éditeur indépendant<br />
                Contact : <a href="mailto:ramydjebbi09@gmail.com" className="underline hover:text-[#0000FF]">ramydjebbi09@gmail.com</a><br />
                Hébergement : Cloudflare, Inc. — 101 Townsend Street, San Francisco, CA 94107, États-Unis
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">4. Accès au site</h2>
              <p>
                Le site est accessible gratuitement à tout utilisateur disposant d'un accès Internet. L'éditeur se réserve le droit de suspendre, limiter ou interrompre l'accès au site à tout moment, sans préavis ni indemnité.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">5. Inscription à la liste d'attente</h2>
              <p>
                L'inscription à la liste d'attente est gratuite et sans engagement. Elle requiert uniquement la fourniture d'une adresse email valide et le consentement explicite au traitement de celle-ci.
              </p>
              <p className="mt-2">
                L'utilisateur peut demander sa désinscription à tout moment en contactant <a href="mailto:ramydjebbi09@gmail.com" className="underline hover:text-[#0000FF]">ramydjebbi09@gmail.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">6. Propriété intellectuelle</h2>
              <p>
                L'ensemble des éléments du site (textes, graphismes, logos, icônes, images, logiciels) est la propriété exclusive de Ramy Djebbi ou de ses partenaires. Toute reproduction, représentation ou exploitation non autorisée est interdite.
              </p>
              <p className="mt-2">
                La marque « Exact » et le logo associé sont la propriété de Ramy Djebbi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">7. Protection des données personnelles</h2>
              <p>
                Le traitement des données personnelles est décrit dans notre{" "}
                <Link to="/confidentialite" className="underline hover:text-[#0000FF]">Politique de confidentialité</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">8. Responsabilité</h2>
              <p>
                L'éditeur s'efforce de fournir des informations exactes et à jour sur le site. Toutefois, il ne garantit pas l'exactitude, la complétude ou l'actualité des informations diffusées.
              </p>
              <p className="mt-2">
                L'éditeur ne saurait être tenu responsable des dommages directs ou indirects résultant de l'accès au site ou de l'utilisation du service Exact, dans les limites autorisées par la loi française.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">9. Liens externes</h2>
              <p>
                Le site peut contenir des liens vers des sites tiers. L'éditeur décline toute responsabilité quant au contenu de ces sites et aux éventuels préjudices résultant de leur consultation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">10. Droit applicable et juridiction</h2>
              <p>
                Les présentes CGU sont régies par le <strong>droit français</strong>. En cas de litige, et après tentative de résolution amiable, les tribunaux compétents de Montpellier seront seuls compétents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">11. Modifications</h2>
              <p>
                L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur le site. L'utilisation continue du site après modification vaut acceptation des nouvelles CGU.
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
