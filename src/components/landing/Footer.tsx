import React from 'react';
import Link from 'next/link';
import { GradientText } from './GradientText';

export const Footer = () => {
  return (
    <footer className="mt-32 border-t border-zinc-800/80 py-12 px-6 text-sm text-zinc-500">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-zinc-500">© {new Date().getFullYear()} Aeternus Lab. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/chat" className="hover:text-zinc-300 transition">
            Admin
          </Link>
          <a href="#features" className="hover:text-zinc-300 transition">
            Features
          </a>
          <a href="mailto:contact@aeternuslab.com" className="hover:text-zinc-300 transition">
            Contact
          </a>
          <span className="text-zinc-600">
            Built with <GradientText>Affective Intelligence</GradientText>
          </span>
        </div>
      </div>
    </footer>
  );
};
