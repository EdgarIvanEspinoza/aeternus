import React from 'react';
import { Hero } from '@components/landing/Hero';
import { FeatureCard } from '@components/landing/FeatureCard';
import { Footer } from '@components/landing/Footer';
import { GradientText } from '@components/landing/GradientText';
import { DeepField } from '@components/landing/DeepField';
import AcceptGate from '@components/AcceptGate';
import AcceptCheckbox from '@components/AcceptCheckbox';

export const metadata = {
  title: 'Aeternus Lab — Affective Intelligence & Persistent Identity',
  description:
    'Aeternus models persistent identities and affective relationships to enable authentic conversations that evolve over time.',
  openGraph: {
    title: 'Aeternus Lab',
    description: 'Conversations that transcend your time.',
    url: 'https://aeternuslab.com',
    siteName: 'Aeternus Lab',
    images: [
      {
        url: '/assets/lequi_avatar.webp',
        width: 512,
        height: 512,
        alt: 'Aeternus Avatar',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aeternus Lab',
    description: 'Conversations that transcend your time.',
    images: ['/assets/lequi_avatar.webp'],
  },
};

const features = [
  {
    title: 'Identity',
    highlight: 'Persistent',
    body: 'Every entity maintains narrative history, emotional evolution, and contextual memory enriched by dynamic relationships.'
  },
  {
    title: 'Context',
    highlight: 'Living',
    body: 'The system weaves affective signals, relationships, and prior events to generate responses with intention and continuity.'
  },
  {
    title: 'Relationships',
    highlight: 'Affective',
    body: 'Models bonds (friendship, closeness, kinship, sentiment) to modulate tone, humor, and support.'
  },
  {
    title: 'Memory',
    highlight: 'Selective',
    body: 'Balances relevance, freshness, and emotion to prioritize meaningful memories without noise.'
  },
  {
    title: 'Adaptation',
    highlight: 'Emotional',
    body: 'Mood and perceived user state modulate communicative style, humor regulation, and depth.'
  },
  {
    title: 'Architecture',
    highlight: 'Hybrid',
    body: 'Combines semantic graph, relational computation, and language generation aligned to affective state.'
  },
];

const LandingPage = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-violet-500/40 selection:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-black" aria-hidden="true" />
      {/* Subtle background grid / glow */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(63,63,70,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(63,63,70,0.15)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute inset-0 mix-blend-plus-lighter bg-[radial-gradient(circle_at_50%_20%,rgba(167,139,250,0.15),transparent_60%)]" />
      </div>
      {/* Global dynamic field (fixed) */}
      <DeepField mode="fixed" intensity={4} variant="energetic" speed={1.05} brightness={1.08} />
      <header className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="font-medium tracking-tight text-5xl">
          <GradientText>Aeternus</GradientText>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <a href="#features" className="hover:text-zinc-200 transition">Features</a>
          <a href="#principles" className="hover:text-zinc-200 transition">Principles</a>
          <a href="#faq" className="hover:text-zinc-200 transition">FAQ</a>
          <AcceptGate className="rounded-full border border-violet-500/40 px-6 py-3 hover:border-violet-400/70 text-zinc-200 hover:text-white transition shadow-[0_6px_30px_-10px_rgba(167,139,250,0.35)] font-semibold" />
        </nav>
      </header>
      <main className="relative">
        <Hero />
        {/* Dynamic background now fixed globally above; wrapper removed */}
        {/* Features */}
        <section id="features" className="relative mx-auto max-w-7xl px-6 pb-28">
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Core <GradientText>Technology</GradientText>
            </h2>
            <p className="mt-4 text-zinc-400 max-w-2xl text-sm md:text-base leading-relaxed">
              A platform designed to explore identity continuity and affective interaction.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <FeatureCard key={f.title} title={f.title} highlight={f.highlight}>{f.body}</FeatureCard>
            ))}
          </div>
        </section>
        {/* Principles */}
        <section id="principles" className="relative mx-auto max-w-5xl px-6 pb-28">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Design <GradientText>Principles</GradientText>
            </h2>
          </div>
          <ul className="space-y-6 text-zinc-300 text-sm md:text-base leading-relaxed">
            <li><strong className="text-white">Affective persistence:</strong> memory is not a flat list; it is a relational graph with dynamic weight.</li>
            <li><strong className="text-white">Context transparency:</strong> every answer is grounded in interpretable states and relationships.</li>
            <li><strong className="text-white">Safe modulation:</strong> tone and humor adapt according to emotional state and relational closeness.</li>
            <li><strong className="text-white">Intentionality:</strong> conversation is not reaction; it is sustaining a shared narrative trajectory.</li>
            <li><strong className="text-white">Technical elegance:</strong> minimum necessary complexity for maximum expressiveness.</li>
          </ul>
        </section>
        {/* CTA */}
        <section className="relative mx-auto max-w-5xl px-6 pb-32">
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-900 p-10 md:p-14 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_0_60px_-10px_rgba(168,85,247,0.35)]">
            <div className="absolute -inset-1 rounded-3xl pointer-events-none [background:radial-gradient(circle_at_30%_20%,rgba(192,132,252,0.25),transparent_65%)] opacity-60" />
            <h3 className="relative text-2xl md:text-3xl font-semibold tracking-tight">
              Explore the <GradientText>Lab</GradientText>
            </h3>
            <p className="relative mt-4 max-w-2xl text-zinc-300 text-sm md:text-base leading-relaxed">
              Access the conversational environment and observe how identity and relationship evolve.
            </p>
                <div className="relative mt-6 flex items-center justify-between gap-4 flex-col sm:flex-row">
                      <div className="flex items-center gap-3">
                        <AcceptCheckbox />
                        <label htmlFor="accept-tnc" className="text-sm text-zinc-300">
                          I accept the <a href="/policies" className="text-violet-300 underline">Terms & Conditions</a>
                        </label>
                      </div>

                  <div>
                    <AcceptGate className="inline-flex items-center justify-center rounded-full border border-violet-500/40 bg-gradient-to-br from-violet-700/80 to-violet-600/80 px-12 py-4 text-lg md:text-xl font-semibold text-white shadow-[0_10px_40px_-20px_rgba(168,85,247,0.6)] transition">
                      Enter now
                      <span className="ml-3 text-violet-300">→</span>
                    </AcceptGate>
                  </div>
                </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
