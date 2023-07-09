// Vendor
import React from 'react';
// Components
import { Input, Text } from '@nextui-org/react';
import { SendButton } from './components/send-button.styled';
import { SendIcon } from './components/send-icon';
// Constants
import constants from './constants/chat-input.constants';
import { ChatInputStyled } from '../../Chat.styled';

const ChatInputComponent = ({
    handleSubmit,
    input,
    handleInputChange,
}: {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    input: string;
    handleInputChange: any;
}): React.ReactElement => {
    return (
        <ChatInputStyled>
            <form onSubmit={handleSubmit}>
                <Input
                    {...constants.INPUT_PROPS}
                    value={input}
                    css={{
                        width: '96rem',
                        maxWidth: '70vw',
                        fontSize: '1.6rem',
                    }}
                    onChange={handleInputChange}
                    contentRight={
                        <SendButton>
                            <SendIcon
                                filled={undefined}
                                size={undefined}
                                height={undefined}
                                width={undefined}
                                label={undefined}
                                className={undefined}
                            />
                        </SendButton>
                    }
                />
            </form>
            <Text color="#333" css={{ margin: '1rem 0rem', textAlign: 'center' }}>
                Eres libre de escribir lo que quieras, pero ten en cuenta que no se guardará nada de lo que escribas.
            </Text>
        </ChatInputStyled>
    );
};

export default ChatInputComponent;
