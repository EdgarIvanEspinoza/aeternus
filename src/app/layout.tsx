import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: '🐲Aeternus AI',
  description: 'Generated example of using Aeternus AI'
};

// Separar viewport según API moderna de Next.js
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
