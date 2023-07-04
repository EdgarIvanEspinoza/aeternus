// Vendor
import React from 'react';
// Components
import { Input } from '@nextui-org/react';
import { SendButton } from './components/send-button.styled';
import { SendIcon } from './components/send-icon';
// Constants
import constants from './constants/chat-input.constants';
// Styles
import ChatInputComponentStyled from './chat-input.component.styles';

const ChatInputComponent = ({
    handleSubmit,
    input,
    handleInputChange,
}: {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    input: string;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): React.ReactElement => (
    <ChatInputComponentStyled>
        <form onSubmit={handleSubmit}>
            <Input
                {...constants.INPUT_PROPS}
                value={input}
                onChange={handleInputChange}
                contentRight={
                    <SendButton>
                        <SendIcon />
                    </SendButton>
                }
            />
        </form>
    </ChatInputComponentStyled>
);

export default ChatInputComponent;
