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
    handleInputChange: any;
}): React.ReactElement => (
    <ChatInputComponentStyled>
        <form onSubmit={handleSubmit}>
            <Input
                {...constants.INPUT_PROPS}
                value={input}
                css={{ width: '70vh' }}
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
    </ChatInputComponentStyled>
);

export default ChatInputComponent;
