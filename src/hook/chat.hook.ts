import { useEffect, useRef, useState } from 'react';
import { Message, useChat } from '@ai-sdk/react';
import config from './config/chat.hook.config';
import { rawTraitsToPrompt, getConversationStyle, getCurrentAge } from '../utils/jsonToSentence';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@auth0/nextjs-auth0/client';

const ChatHook = (
  username: string | null | undefined
): {
  messages: Message[];
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  append: (message: Message) => void;
  loading: boolean;
} => {
  const conversationId = useRef(localStorage.getItem('conversationId') || uuidv4());
  localStorage.setItem('conversationId', conversationId.current);

  const { user } = useUser();
  const [initialMessages, setInitialMessages] = useState<Message[] | null>(null);
  const [loading, setLoading] = useState(true);

  const saveMessage = async (role: 'user' | 'assistant' | 'system', content: string) => {
    if (!user?.sub) return;
    await fetch('/api/chat/saveMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.sub,
        conversationId: conversationId.current,
        role,
        content,
      }),
    });
  };

  const fetchTraits = async () => {
    try {
      const queryParams = username ? `?user=${encodeURIComponent(username)}` : '';
      const res = await fetch(`/api/ai/traits${queryParams}`);
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      return data.traits;
    } catch (err) {
      console.error('Error fetching traits:', err);
      return [];
    }
  };

  useEffect(() => {
    const initializeMessages = async () => {
      if (!user?.sub) return;
      setLoading(true);
      const [traits, msgRes] = await Promise.all([
        fetchTraits(),
        fetch('/api/chat/loadMessages', {
          method: 'POST',
          body: JSON.stringify({ userId: user.sub }),
        }),
      ]);

      let messages: Message[] = [];

      try {
        const data = await msgRes.json();
        if (data?.messages?.length > 0) {
          messages = data.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
          }));
        }
      } catch (err) {
        console.error('Error loading messages:', err);
      } finally {
        setLoading(false);
      }

      if (messages.length === 0) {
        const initialPrompt: Message = {
          id: 'system-init',
          role: 'system',
          content: `${config.ROL_CONFIG} ${config.PERSONALITY_CARACTERISTICS} ${rawTraitsToPrompt(traits)} ${
            config.CONVERSATION_STYLE
          } ${getConversationStyle({
            animic_state: traits[0]?.animic_state,
            relationships: traits[0]?.relationships,
            age: getCurrentAge(traits[0]?.date_of_birth, traits[0]?.date_of_death),
            user_age: getCurrentAge(traits[0]?.user_date_of_birth, traits[0]?.user_date_of_death),
          })} ${config.CHARACTER_STYLE} ${config.INITIAL_MESSAGE} ${username}`,
        };
        append(initialPrompt);

        await saveMessage('system', initialPrompt.content);
      }

      setInitialMessages(messages);
    };

    initializeMessages();
  }, [user?.sub, username]);

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    initialMessages: initialMessages ?? [],
    onFinish: async (message) => {
      await saveMessage('assistant', message.content);
    },
  });

  const wrappedHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    await saveMessage('user', input);
    handleSubmit(e); // lanza a la IA
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit: wrappedHandleSubmit,
    append,
    loading,
  };
};

export default ChatHook;
