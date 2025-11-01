"use client";

import React from 'react';

export default function AcceptCheckbox() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.currentTarget.checked;
    try {
      localStorage.setItem('aeternus_policies_accepted', checked ? 'true' : 'false');
    } catch {
      // ignore
    }
    // Dispatch a global event so other client components can update immediately
    try {
      window.dispatchEvent(new CustomEvent('aeternus:policies-accepted', { detail: { accepted: checked } }));
    } catch {
      // ignore
    }
  };

  // read initial value
  let initial = false;
  try {
    initial = localStorage.getItem('aeternus_policies_accepted') === 'true';
  } catch {
    initial = false;
  }

  return (
    <input id="accept-tnc" defaultChecked={initial} type="checkbox" className="h-4 w-4 rounded bg-neutral-700 border-neutral-600" onChange={handleChange} />
  );
}
