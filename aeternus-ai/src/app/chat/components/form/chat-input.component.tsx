// Vendor
import React from 'react';
// Components
import { Input } from '@nextui-org/react';
import { SendButton } from './components/send-button.styled';
import { SendIcon } from './components/send-icon';
// Constants
import constants from './constants/chat-input.constants';

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
        <form onSubmit={handleSubmit}>
            <Input
                {...constants.INPUT_PROPS}
                value={input}
                css={{ maxWidth: '70vh', height: '10vh' }}
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
    );
};

export default ChatInputComponent;
