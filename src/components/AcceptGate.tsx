"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AcceptGate({ className, children }: { className?: string; children?: React.ReactNode }) {
  const [accepted, setAccepted] = useState<boolean | null>(null);
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

  const handleDisabled = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/policies');
  };

  if (accepted === null) return null;

  return accepted ? (
    <Link href="/chat" className={className}>
      {children ?? 'Enter the Lab'}
    </Link>
  ) : (
    <a href="/policies" onClick={handleDisabled} className={className}>
      {children ?? 'Enter the Lab'}
    </a>
  );
}
