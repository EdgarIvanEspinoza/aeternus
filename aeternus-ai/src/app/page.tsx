'use client';
import * as React from 'react';
import ChatComponent from '../app/chat/Chat';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function App() {
    const lightTheme = createTheme({
        type: 'light',
    });

    const darkTheme = createTheme({
        type: 'dark',
    });

    return (
        <NextThemesProvider
            defaultTheme="system"
            attribute="class"
            value={{
                light: lightTheme.className,
                dark: darkTheme.className,
            }}>
            <NextUIProvider>
                <ChatComponent />
            </NextUIProvider>
        </NextThemesProvider>
    );
}
