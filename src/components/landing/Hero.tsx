'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GradientText } from './GradientText';

export const Hero = () => {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      setAccepted(localStorage.getItem('aeternus_policies_accepted') === 'true');
    } catch {
      setAccepted(false);
    }
    const handler = (ev: Event) => {
      try {
        if ((ev as CustomEvent)?.detail && typeof (ev as CustomEvent).detail === 'object') {
          const val = (ev as CustomEvent<Record<string, unknown>>).detail?.['accepted'];
          if (typeof val === 'boolean') setAccepted(val);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('aeternus:policies-accepted', handler as EventListener);
    return () => window.removeEventListener('aeternus:policies-accepted', handler as EventListener);
  }, []);

  const handleDisabledClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/policies');
  };

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
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
        {accepted ? (
          <Link
            href="/chat"
            className="group inline-flex items-center justify-center rounded-full border border-violet-500/40 bg-gradient-to-br from-zinc-900 to-zinc-800 px-12 py-4 text-lg md:text-xl font-semibold text-white shadow-[0_6px_30px_-10px_rgba(167,139,250,0.45)] backdrop-blur transition hover:translate-y-[-1px]"
          >
            Enter the Lab
            <span className="ml-3 text-violet-300 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        ) : (
          <a
            href="/policies"
            onClick={handleDisabledClick}
            className="group inline-flex items-center justify-center rounded-full border border-violet-500/40 bg-gradient-to-br from-zinc-900 to-zinc-800 px-12 py-4 text-lg md:text-xl font-semibold text-white shadow-[0_6px_30px_-10px_rgba(167,139,250,0.45)] backdrop-blur transition hover:translate-y-[-1px]"
          >
            Enter the lab
                        <span className="ml-3 text-violet-300 transition-transform group-hover:translate-x-1">→</span>

          </a>
        )}
      </div>
    </section>
  );
};
