import { Message, useChat } from 'ai/react';
import { useEffect } from 'react';
import config from './config/chat.hook.config';
import React from 'react';

const ChatHook = (
  username: string | null | undefined
): {
  messages: Message[];
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  append: (message: Message) => void;
} => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat();
  useEffect(() => {
    append({
      id: '1',
      role: 'system' as 'system',
      content: `${config.ROL_CONFIG} ${config.PERSONALITY_CARACTERISTICS} ${config.INITIAL_MESSAGE}${username}`,
    });
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
