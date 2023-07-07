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
import { ChatComponentStyled, ChatInputStyled } from './Chat.styled';

const ChatComponent = (): React.ReactElement => {
    const { messages, input, handleInputChange, handleSubmit } = ChatHook();
    const { setTheme } = useNextTheme();
    const { isDark, type } = useTheme();
    return (
        <Container fluid display="flex" direction="column" justify="center">
            <Row>
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
                            size="xl"
                            iconOn={
                                <MoonIcon
                                    filled
                                    size={undefined}
                                    height={undefined}
                                    width={undefined}
                                    label={undefined}
                                />
                            }
                            iconOff={
                                <SunIcon
                                    filled
                                    size={undefined}
                                    height={undefined}
                                    width={undefined}
                                    label={undefined}
                                />
                            }
                            aria-label="Toggle dark mode"
                            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                        />
                    </Navbar.Content>
                </Navbar>
            </Row>
            <Row justify="center" align="center">
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
            </Row>
            <Spacer y={1} />
            <Row fluid justify="center">
                <ChatInputComponent {...{ handleSubmit, input, handleInputChange }} />
            </Row>
        </Container>
    );
};

export default ChatComponent;
