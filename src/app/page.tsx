'use client';
// Vendor
import * as React from 'react';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
// Components
import MainComponent from './chat/Main';

export default function App() {
  const lightTheme = createTheme({
    type: 'light',
  });

  const darkTheme = createTheme({
    type: 'dark',
  });
  return (
    <NextThemesProvider
      defaultTheme="dark"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className,
      }}>
      <NextUIProvider>
        <MainComponent />
      </NextUIProvider>
    </NextThemesProvider>
  );
}
