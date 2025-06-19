import { useEffect } from 'react';
import { Message, useChat } from '@ai-sdk/react';
import config from './config/chat.hook.config';
import rawTraitsToPrompt from '../utils/jsonToSentence';

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

  const fetchTraits = async () => {
    try {
      const res = await fetch('/api/ai/traits');
      if (!res.ok) throw new Error('Server error');

      const data = await res.json();
      const traits = data.traits;

      return rawTraitsToPrompt(traits);
    } catch (err) {
      console.error('Error fetching traits:', err);
      return '';
    }
  };

  const initializeChat = async () => {
    const personality = await fetchTraits();
    append({
      id: '1',
      role: 'system',
      content: `${config.ROL_CONFIG} ${config.PERSONALITY_CARACTERISTICS} ${personality} ${config.INITIAL_MESSAGE} ${username}`,
    });
  };

  useEffect(() => {
    initializeChat();
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
