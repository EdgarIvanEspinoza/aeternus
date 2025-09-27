import React, { PropsWithChildren } from 'react';
import { GradientText } from './GradientText';

interface FeatureCardProps extends PropsWithChildren {
  title: string;
  highlight?: string;
}

export const FeatureCard = ({ title, highlight, children }: FeatureCardProps) => {
  return (
    <div className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm overflow-hidden shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_40px_-8px_rgba(167,139,250,0.4)] transition">
      <div className="absolute inset-px rounded-[15px] pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.15),transparent_60%)] opacity-0 group-hover:opacity-100 transition" />
      <h3 className="text-lg font-medium text-white">
        {title} {highlight && <GradientText>{highlight}</GradientText>}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{children}</p>
    </div>
  );
};
