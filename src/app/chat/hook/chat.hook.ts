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

  const fetchTraits = async () => {
    try {
      const res = await fetch('/api/ai/traits');
      if (!res.ok) throw new Error('Server error');

      const data = await res.json();
      const traits = data.traits;

      const described = traits.filter((t: any) => t.description);
      const named = traits.filter((t: any) => !t.description).map((t: any) => t.name);

      const describedText = described.map((t: any) => t.description).join(' ');
      const namedText = named.length ? `He is ${named.slice(0, -1).join(', ')} and ${named.slice(-1)}.` : '';
      const personality = `${namedText} ${describedText}`;

      return personality;
    } catch (err) {
      console.error('Error fetching traits:', err);
      return '';
    }
  };

  console.log(messages);

  useEffect(() => {
    const initializeChat = async () => {
      const personality = await fetchTraits();
      console.log('Personality:', personality);
      append({
        id: '1',
        role: 'system',
        content: `${config.ROL_CONFIG} ${config.PERSONALITY_CARACTERISTICS} ${personality} ${config.INITIAL_MESSAGE} ${username}`,
      });
    };

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
