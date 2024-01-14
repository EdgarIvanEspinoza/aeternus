//Vendor
import React, { useEffect } from 'react';
import { Message, useChat } from 'ai/react';
// Config
import config from './config/chat.hook.config';
// Handlers
import ChatHandlers from '../handlers/chat.handlers';

const ChatHook = (
  user: any
): {
  messages: Message[];
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  append: (message: Message) => void;
} => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat();
  const { handleRegisterUser, handlerGetMessages } = ChatHandlers({ name: user.name, email: user.email });

  useEffect(() => {
    console.log('user', user);
    handleRegisterUser();
    handlerGetMessages();
    append({
      id: '1',
      role: 'system' as 'system',
      content: `${config.ROL_CONFIG} ${config.PERSONALITY_CARACTERISTICS} ${config.INITIAL_MESSAGE}${user.name}`,
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
