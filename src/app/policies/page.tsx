"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/react';

export default function Policies() {
  const router = useRouter();

  const handleAccept = () => {
    try {
      localStorage.setItem('aeternus_policies_accepted', 'true');
    } catch {
      // ignore storage errors
    }
    router.push('/chat');
  };

  

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-6 sm:p-12" style={{ backgroundColor: '#0b0b0d' }}>
      {/* Prevent white overscroll on iOS/Chrome by forcing dark background on html/body via inline style */}
      <style dangerouslySetInnerHTML={{ __html: `
        html, body, #__next { background: #0b0b0d !important; }
        body { overscroll-behavior: none; }
      `}} />

      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0099ff] to-[#ff4ecd] flex items-center justify-center">
            <span style={{ fontWeight: 700, color: '#fff' }}>A</span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Legal</h1>
            <p className="text-sm text-gray-400">Terms, Privacy and Non-Disclosure Agreement</p>
          </div>
        </div>

        <article className="bg-neutral-800 p-8 rounded-2xl shadow-lg text-gray-100" style={{ border: '1px solid rgba(255,255,255,0.03)' }}>
          <h2 className="text-lg font-semibold mb-3" style={{
            background: 'linear-gradient(45deg, #0099ff -20%, #ff4ecd 50%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Terms & Conditions — Last updated: July 11, 2023
          </h2>

          <p className="mb-4 text-gray-300">Welcome to Aeternus, an AI-powered chatbot. Before using this service, please read the Terms & Conditions carefully. By accessing and using Aeternus, you agree to be bound by these terms. If you do not agree, please do not use the chatbot.</p>

          <h3 className="text-sm font-semibold mt-6 mb-2 text-gray-200">Use of the chatbot</h3>
          <p className="text-gray-300 mb-4">Aeternus is designed to provide information and answer questions based on its trained data. We cannot guarantee accuracy or currency of information. Do not use Aeternus for unlawful activities or to harm others.</p>

          <h3 className="text-sm font-semibold mt-4 mb-2 text-gray-200">User responsibility</h3>
          <p className="text-gray-300 mb-4">You are responsible for your interactions and decisions taken using Aeternus. We are not liable for damages resulting from use of the service.</p>

          <h3 className="text-sm font-semibold mt-6 mb-2 text-gray-200">Privacy</h3>
          <p className="text-gray-300 mb-4">We collect minimal data necessary to operate the service, such as IP addresses and usage metrics. We do not collect personally identifiable information unless voluntarily provided.</p>

          <h3 className="text-sm font-semibold mt-6 mb-2 text-gray-200">Non-Disclosure Agreement (NDA)</h3>
          <p className="text-gray-300 mb-4">By participating in the Aeternus Alpha, you may be exposed to confidential information. You agree to keep such information confidential and only use it for testing and feedback. Confidential information excludes information that is public, already known to you, or independently developed.</p>

          <div className="mt-8 flex justify-end">
            <Button color="primary" onPress={handleAccept} className="px-6 py-2">Accept</Button>
          </div>
        </article>
      </div>
    </main>
  );
}
 