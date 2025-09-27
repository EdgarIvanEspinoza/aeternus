import React, { PropsWithChildren } from 'react';

export const GradientText = ({ children }: PropsWithChildren) => (
  <span className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(168,85,247,0.35)]">
    {children}
  </span>
);
