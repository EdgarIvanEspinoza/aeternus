'use client';
// Vendor
import * as React from 'react';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
// Components
import ChatComponent from './chat/Chat';
import ModalComponent from './modal/Modal';

export default function App() {
    const lightTheme = createTheme({
        type: 'light',
    });

    const darkTheme = createTheme({
        type: 'dark',
    });
    const [username, setUsername] = React.useState('');
    return (
        <NextThemesProvider
            defaultTheme="dark"
            attribute="class"
            value={{
                light: lightTheme.className,
                dark: darkTheme.className,
            }}>
            <NextUIProvider>
                <ModalComponent {...{ username, setUsername }} />
                {username !== '' ? <ChatComponent {...{ username }} /> : null}
            </NextUIProvider>
        </NextThemesProvider>
    );
}
