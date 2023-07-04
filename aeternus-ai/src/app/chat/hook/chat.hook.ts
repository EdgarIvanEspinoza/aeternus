import { Message, useChat } from 'ai/react';
import { useEffect } from 'react';
import config from './config/chat.hook.config';

const ChatHook = (): {
    messages: Message[];
    input: string;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    append: (message: Message) => void;
} => {
    const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat();

    const firstMessage: Message = config;

    useEffect(() => {
        append(firstMessage);
    }, []);

    return {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        append,
    };
};

export default ChatHook;
