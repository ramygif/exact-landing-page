import React, { useState } from "react";
import { motion } from "motion/react";
import {
  MousePointer2,
  Command,
  CheckCircle2,
  Zap,
  Sparkles,
  Monitor,
  Check,
  ArrowRight,
} from "lucide-react";

// ─── Waitlist logic ───────────────────────────────────────────────────────────

const WAITLIST_BASE = 127;
const WAITLIST_KEY = "exact_waitlist_emails";

function getStoredEmails(): string[] {
  try {
    return JSON.parse(localStorage.getItem(WAITLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

function addEmail(email: string): boolean {
  const emails = getStoredEmails();
  if (emails.includes(email)) return false;
  emails.push(email);
  localStorage.setItem(WAITLIST_KEY, JSON.stringify(emails));
  return true;
}

function getCount(): number {
  return WAITLIST_BASE + getStoredEmails().length;
}

// ─── WaitlistForm ─────────────────────────────────────────────────────────────

interface WaitlistFormProps {
  large?: boolean;
}

function WaitlistForm({ large = false }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!emailRegex.test(email)) {
      setError("Adresse email invalide.");
      return;
    }

    addEmail(email);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 py-4"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600">
          <Check className="w-4 h-4 text-white" />
        </div>
        <p className={`text-white/80 ${large ? "text-base" : "text-sm"}`}>
          Vous êtes sur la liste. On vous contacte bientôt.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      <div className={`flex flex-col sm:flex-row gap-2 w-full ${large ? "max-w-lg" : "max-w-md"}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className={`flex-1 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors ${
            large ? "px-5 py-4 text-base" : "px-4 py-3 text-sm"
          }`}
          required
        />
        <button
          type="submit"
          className={`flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all whitespace-nowrap ${
            large ? "px-6 py-4 text-base" : "px-5 py-3 text-sm"
          }`}
        >
          Rejoindre
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
    </form>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────

export function Home() {
  const count = getCount();

  const avatarColors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-emerald-500",
    "bg-amber-500",
  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: "#0A0A0A",
        color: "#FFFFFF",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 w-full backdrop-blur-md"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          backgroundColor: "rgba(10,10,10,0.8)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span
            style={{
              fontFamily: "'Exat Test', sans-serif",
              fontWeight: 800,
              fontSize: "20px",
              color: "#FFFFFF",
            }}
          >
            exact
          </span>
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-all"
            onClick={() => {
              const el = document.getElementById("cta");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Rejoindre la liste d'attente
          </button>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6">
        {/* Background orb */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div
            className="w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "#2563EB" }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm mb-8"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              borderColor: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <span>✦</span>
            <span>Disponible sur macOS</span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-bold tracking-tight leading-tight text-white"
            style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)" }}
          >
            Écrivez parfaitement,
            <br />
            partout sur Mac.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-xl mx-auto text-lg leading-relaxed"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Exact corrige votre texte en un raccourci clavier. Sélectionnez,
            appuyez sur ⌃Space, c'est parfait.
          </motion.p>

          {/* Waitlist form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 w-full flex justify-center"
          >
            <WaitlistForm />
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              {avatarColors.map((color, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full border-2 ${color}`}
                  style={{ borderColor: "#0A0A0A" }}
                />
              ))}
            </div>
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Déjà {count} personnes en liste d'attente
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-widest mb-4"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Comment ça marche
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-bold text-white mb-16"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
          >
            Trois étapes. Zéro effort.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                number: "01",
                icon: <MousePointer2 className="w-6 h-6 text-white/60" />,
                title: "Sélectionnez votre texte",
                desc: "Sélectionnez n'importe quel texte dans n'importe quelle app Mac.",
              },
              {
                number: "02",
                icon: <Command className="w-6 h-6 text-white/60" />,
                title: "Appuyez sur ⌃Space",
                desc: "Le raccourci universel envoie votre texte à l'IA.",
              },
              {
                number: "03",
                icon: <CheckCircle2 className="w-6 h-6 text-white/60" />,
                title: "Texte corrigé instantanément",
                desc: "Exact remplace votre texte par la version corrigée en moins d'une seconde.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl p-8 text-left"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="font-bold mb-6"
                  style={{
                    fontSize: "3.5rem",
                    color: "rgba(255,255,255,0.12)",
                    lineHeight: 1,
                  }}
                >
                  {step.number}
                </div>
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-3">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-widest mb-4 text-center"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Pourquoi Exact ?
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-bold text-white mb-16 text-center"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
          >
            Puissant. Simple. Natif.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Featured card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-8 md:row-span-2 flex flex-col justify-between"
              style={{
                background:
                  "linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(30,58,138,0.2) 100%)",
                border: "1px solid rgba(37,99,235,0.2)",
              }}
            >
              <div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: "rgba(37,99,235,0.3)" }}
                >
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-xl mb-3">
                  Correction orthographique
                </h3>
                <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Corrige fautes d'orthographe, grammaire, ponctuation. En
                  temps réel, sans quitter votre flux de travail.
                </p>
              </div>
              <div
                className="mt-10 rounded-xl p-4 text-sm font-mono"
                style={{
                  backgroundColor: "rgba(0,0,0,0.4)",
                  color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.3)" }}>avant </span>
                <span style={{ textDecoration: "line-through", color: "#ef4444" }}>
                  bonjour comment va tu
                </span>
                <br />
                <span style={{ color: "rgba(255,255,255,0.3)" }}>après </span>
                <span style={{ color: "#4ade80" }}>Bonjour, comment vas-tu ?</span>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl p-8"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <Sparkles className="w-6 h-6 text-white/60" />
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">
                Reformulation intelligente
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Reformule vos phrases sans changer le sens. Ton professionnel,
                concis, ou décontracté.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl p-8"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <Monitor className="w-6 h-6 text-white/60" />
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">
                Fonctionne partout sur Mac
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Mail, Notion, Slack, Chrome, n'importe quelle app. Exact
                s'intègre à tout votre système.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Waitlist CTA ─────────────────────────────────────────────────────── */}
      <section id="cta" className="py-32 px-6 text-center relative">
        {/* Blue glow */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div
            className="w-[500px] h-[300px] rounded-full blur-3xl"
            style={{ backgroundColor: "rgba(37,99,235,0.15)" }}
          />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-bold text-white mb-4"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
          >
            Soyez parmi les premiers.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10 text-base"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Accès anticipé gratuit. Pas de spam. Désabonnement en un clic.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <WaitlistForm large />
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        className="py-8 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2026 getexact.app
          </span>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Confidentialité
            </a>
            <a
              href="#"
              className="text-sm transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              CGU
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
