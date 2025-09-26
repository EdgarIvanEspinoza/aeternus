import React from 'react';
import Link from 'next/link';
import { GradientText } from './GradientText';

export const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-28 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_center,black,transparent)]">
        <div className="absolute -inset-[40%] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)]" />
      </div>
      <h1 className="text-4xl md:text-6xl font-semibold tracking-tight max-w-4xl leading-tight">
        Conversations that <GradientText>transcend</GradientText> your time
      </h1>
      <p className="mt-6 text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed">
        Aeternus is an affective intelligence lab. It models identities, memories, and relationships to create authentic and persistent dialog experiences.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/chat"
          className="group inline-flex items-center justify-center rounded-full border border-violet-500/40 bg-gradient-to-br from-zinc-900 to-zinc-800 px-8 py-3 text-base font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_0_40px_-10px_rgba(168,85,247,0.6)] backdrop-blur transition hover:border-violet-400/60 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_50px_-8px_rgba(192,132,252,0.85)]">
          Enter the Lab
          <span className="ml-2 text-violet-300 transition-transform group-hover:translate-x-1">→</span>
        </Link>
        <a
          href="#features"
          className="inline-flex items-center justify-center rounded-full border border-zinc-700/60 px-8 py-3 text-base font-medium text-zinc-300 hover:text-white hover:border-zinc-500/80 transition"
        >
          View features
        </a>
      </div>
    </section>
  );
};
