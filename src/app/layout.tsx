import { HeroUIProvider } from '@heroui/react';
import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: '🐲Aeternus AI',
  description: 'Generated example of using Aeternus AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={'dark text-foreground bg-background'}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
