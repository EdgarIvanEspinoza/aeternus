import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

export const metadata = {
  title: '🐲Aeternus AI',
  description: 'Generated example of using Aeternus AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="es">
        <body className={'dark text-foreground bg-background'}>{children}</body>
      </html>
    </Providers>
  );
}
