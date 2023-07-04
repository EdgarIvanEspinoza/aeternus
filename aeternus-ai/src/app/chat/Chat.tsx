'use client';
// Vendors
import React from 'react';
// Themes
import { useTheme as useNextTheme } from 'next-themes';
import { Navbar, Switch, useTheme, Text } from '@nextui-org/react';
// Hooks
import ChatHook from './hook/chat.hook';
// Components
import ChatInputComponent from './components/form/chat-input.component';
import { SunIcon } from '../resources/icons/sun-icon';
import { MoonIcon } from '../resources/icons/moon-icon';
// Styles
import { ChatComponentStyled, ChatInputStyled } from './Chat.styled';

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
                        iconOn={
                            <MoonIcon filled size={undefined} height={undefined} width={undefined} label={undefined} />
                        }
                        iconOff={
                            <SunIcon filled size={undefined} height={undefined} width={undefined} label={undefined} />
                        }
                        onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                    />
                </Navbar.Content>
            </Navbar>
            <ChatComponentStyled>
                {messages
                    .slice(1)
                    .reverse()
                    .map((message) => {
                        const isAeternus = message.role !== 'user';
                        return (
                            <ChatInputStyled>
                                <div key={message.id}>
                                    {isAeternus ? 'Aeternus 🐲: ' : 'User 🧑‍💻: '}
                                    <Text color={isAeternus ? 'success' : 'warning'}>{message.content}</Text>
                                </div>
                            </ChatInputStyled>
                        );
                    })}
            </ChatComponentStyled>
            <ChatInputComponent {...{ handleSubmit, input, handleInputChange }} />
        </>
    );
};

export default ChatComponent;
