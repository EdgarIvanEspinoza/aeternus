import { useEffect } from 'react';
import { Message, useChat } from '@ai-sdk/react';
import config from './config/chat.hook.config';

const ChatHook = (
  username: string | null | undefined
): {
  messages: Message[];
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  append: (message: Message) => void;
} => {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat();

  useEffect(() => {
    append({
      id: '1',
      role: 'system' as 'system',
      content: `${config.ROL_CONFIG} ${config.PERSONALITY_CARACTERISTICS} ${config.INITIAL_MESSAGE} ${username}`,
    });
  }, []);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
  };
};

export default ChatHook;
