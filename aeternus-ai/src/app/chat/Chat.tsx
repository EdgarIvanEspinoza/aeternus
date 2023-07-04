'use client';
// Vendors
import React from 'react';
// Themes
import { useTheme as useNextTheme } from 'next-themes';
import { Navbar, Switch, useTheme } from '@nextui-org/react';
// Hooks
import ChatHook from './hook/chat.hook';
// Components
import ChatInputComponent from './components/form/chat-input.component';
import { SunIcon } from '../resources/icons/sun-icon';
import { MoonIcon } from '../resources/icons/moon-icon';
// Styles
import ChatComponentStyled from './Chat.styled';

const ChatComponent = (): React.ReactElement => {
    const { messages, input, handleInputChange, handleSubmit } = ChatHook();
    const { setTheme } = useNextTheme();
    const { isDark, type } = useTheme();
    return (
        <>
            <Navbar isBordered variant={'floating'}>
                <Navbar.Brand>Aeternus 🐲</Navbar.Brand>
                <Navbar.Content>
                    <Switch
                        checked={isDark}
                        size="xl"
                        iconOn={<MoonIcon filled />}
                        iconOff={<SunIcon filled />}
                        onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                    />
                </Navbar.Content>
            </Navbar>
            <ChatComponentStyled>
                {messages.slice(1).map((message) => {
                    const isAeternus = message.role !== 'user';
                    return (
                        <div key={message.id}>
                            {isAeternus ? 'Aeternus 🐲: ' : 'User 🧑‍💻: '}
                            <span className={`${isAeternus ? 'text-green-500' : 'text-blue-300'}`}>
                                {message.content}
                            </span>
                        </div>
                    );
                })}
            </ChatComponentStyled>
            <ChatInputComponent {...{ handleSubmit, input, handleInputChange }} />
        </>
    );
};

export default ChatComponent;
