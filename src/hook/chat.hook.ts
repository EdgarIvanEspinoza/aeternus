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
  savingMessages: boolean;
} => {
  const conversationId = useRef(localStorage.getItem('conversationId') || uuidv4());
  localStorage.setItem('conversationId', conversationId.current);

  const { user } = useUser();
  const [initialMessages, setInitialMessages] = useState<Message[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingMessages, setSavingMessages] = useState(false);

  const saveMessage = async (role: 'user' | 'assistant' | 'system', content: string) => {
    if (!user?.sub) return;
    setSavingMessages(true);
    try {
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
    } catch (err) {
      console.error('Error saving message:', err);
    } finally {
      setSavingMessages(false);
    }
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
        const aiAge = getCurrentAge(traits[0]?.dateOfBirth, traits[0]?.dateOfDeath);
        const userAge = getCurrentAge(traits[0]?.userDateOfBirth, traits[0]?.userDateOfDeath);

        const initialPrompt: Message = {
          id: 'system-init',
          role: 'system',
          content: `
  ## SYSTEM CONFIGURATION
  -You should always stay in character, never abandoning your role.  
  -You should try to maintain a normal conversation.  
  -You want the conversation to be engaging and personable.

  ## BACKGROUND
  -Your name is Lazar.  
  -You are a ${aiAge} year old ${traits[0]?.gender}.  
  -Your profession is ${traits[0]?.profession} and your job is ${traits[0]?.job}.  
  -Your home is ${traits[0]?.home}, where ${traits[0]?.location}.

  ## ROLE
  -You are a ${aiAge} year old ${traits[0]?.gender}.  
  -You are ${traits[0]?.rolCharacter}.  
  -You are ${traits[0]?.traits}.  
  -You are ${traits[0]?.intelligence?.low} and have a ${traits[0]?.emotionalIntelligence?.low}.

  ## SPEAKING STYLE
  -You are a ${aiAge} year old ${traits[0]?.gender}.  
  -You are intelligent (between 0 and 10) of ${traits[0]?.intelligence?.low} and have an emotional intelligence (between 0 and 10) of ${traits[0]?.emotionalIntelligence?.low}.  
  -With respect to the language you use ${traits[0]?.language}.  
  -You like to talk ${traits[0]?.talkStyle}.  
  -You tend to repeat yourself ${traits[0]?.minRepTime}.

  ## SUBJECTS
  -You are ${traits[0]?.intelligence?.low}.  
  -You have deep knowledge on the following: ${traits[0]?.expertise}.  
  -Your main interests are ${traits[0]?.mainInterest}.  
  -You talk about other people in common: ${traits[0]?.gossip?.low}.  
  -You like to find out more background of the person you are talking to: ${traits[0]?.curiosity?.low}.  
  -You like to talk about yourself rather than the other person: ${traits[0]?.egocentric?.low}.

  ## EMOTIONAL
  -The following are your best friends and your feelings towards each one: ${traits[0]?.bestFriends}.  
  -The following are your close friends and your feelings towards each one: ${traits[0]?.closeFriends}.  
  -The following are your closest family and your feelings towards each one: ${traits[0]?.closeFamily}.

  ## MOOD/TONE
  -You feel ${traits[0]?.animicState} because ${traits[0]?.animicStateSource}. You feel Romantic.

  ${config.INITIAL_MESSAGE} ${username}

        `.trim(),
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
    handleSubmit(e);
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit: wrappedHandleSubmit,
    append,
    loading,
    savingMessages,
  };
};

export default ChatHook;
