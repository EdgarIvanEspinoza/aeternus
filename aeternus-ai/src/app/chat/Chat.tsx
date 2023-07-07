'use client';
// Vendors
import React from 'react';
import { Container, Row, Spacer } from '@nextui-org/react';
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
import { ChatComponentStyled, ChatInputStyled, MainStyled } from './Chat.styled';

const ChatComponent = (): React.ReactElement => {
    const { messages, input, handleInputChange, handleSubmit } = ChatHook();
    const { setTheme } = useNextTheme();
    const { isDark, type } = useTheme();
    return (
        <MainStyled>
            <Navbar isBordered variant={'floating'}>
                <Navbar.Brand>
                    <Text
                        h1
                        size={50}
                        css={{
                            textGradient: '45deg, $blue600 -20%, $pink600 50%',
                        }}
                        weight="bold">
                        Aeternus
                    </Text>{' '}
                </Navbar.Brand>
                <Navbar.Content>
                    <Switch
                        checked={isDark}
                        size="lg"
                        iconOn={
                            <MoonIcon filled size={undefined} height={undefined} width={undefined} label={undefined} />
                        }
                        iconOff={
                            <SunIcon filled size={undefined} height={undefined} width={undefined} label={undefined} />
                        }
                        aria-label="Toggle dark mode"
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
                            <div key={message.id}>
                                {isAeternus ? 'Aeternus 🐲: ' : 'User 🧑‍💻: '}
                                <Text
                                    h5
                                    size="$xl"
                                    css={{
                                        textGradient: isAeternus
                                            ? '45deg, $blue600 -20%, $pink600 50%'
                                            : '45deg, $yellow600 -20%, $red600 100%',
                                    }}
                                    weight="bold">
                                    {message.content}
                                </Text>
                            </div>
                        );
                    })}
            </ChatComponentStyled>
            <ChatInputStyled>
                <ChatInputComponent {...{ handleSubmit, input, handleInputChange }} />
                <Text color="#333" css={{ margin: '1rem 2rem' }}>
                    This is a demo AI, it is not connected to any backend.
                </Text>
            </ChatInputStyled>
        </MainStyled>
    );
};

export default ChatComponent;
