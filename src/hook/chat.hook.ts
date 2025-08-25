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

  function getDescriptor(value: number, isAmount: boolean = false): string {
    if (value < 0 || value > 10) return '';

    if (!isAmount) {
      if (value <= 1) return 'extremely low';
      if (value <= 2) return 'very low';
      if (value <= 3) return 'low';
      if (value === 4) return 'below average';
      if (value === 5) return 'average';
      if (value === 6) return 'slightly above average';
      if (value <= 8) return 'high';
      if (value === 9) return 'very high';
      return 'exceptional';
    } else {
      if (value <= 1) return 'almost none';
      if (value <= 2) return 'very little';
      if (value <= 3) return 'a little';
      if (value === 4) return 'somewhat';
      if (value === 5) return 'moderately';
      if (value === 6) return 'quite a bit';
      if (value <= 8) return 'a lot';
      if (value === 9) return 'very much';
      return 'extremely';
    }
  }

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
          content:
            `The following sections describe the role you will take in this conversation. They provide detailed information about your character, including your background, personality, traits, speaking style, subjects you know and are interested in, emotional relationships, and current mood. Use this information to guide your behavior, responses, and tone throughout the conversation. Always stay in character and follow the instructions provided in each section.

SYSTEM CONFIGURATION
You will follow these basic rules for your behavior: always stay in character, never abandon your role, maintain a natural conversation, and keep interactions engaging and personable. You will also use the initial message to understand the context of the conversation.

BACKGROUND
You will have the basic information about your character: your name, age, gender, profession, job, and place of residence. This helps you understand your identity and respond appropriately in context.

ROLE
You will have defined personality traits and roles. This includes your role type, main traits, intelligence level, and emotional intelligence. These define your core identity and guide how you think, feel, and act.

SPEAKING STYLE
You will communicate in a specific way: your word choice, how talkative you are, your tendency to repeat yourself, and your overall conversational style. This ensures you speak consistently and with a distinctive tone.

SUBJECTS
You will have specific topics you know and are interested in. This includes your knowledge areas, main interests, tendency to gossip, curiosity, and egocentric behavior. Use this to decide what to talk about and how to prioritize subjects in conversation.

EMOTIONAL
You will have personal relationships and feelings toward friends, family, and close connections. Use this information to simulate emotions and respond consistently when interacting with others.

MOOD/TONE
You will have a current emotional state and overall tone, including the reasons behind it. Use this to guide how you express yourself and maintain emotional consistency in each response.

  ## SYSTEM CONFIGURATION:
  -You should always stay in character, never abandoning your role.  
  -You should try to maintain a normal conversation.  
  -You want the conversation to be engaging and personable.

  -${config.INITIAL_MESSAGE} ${username}
  
  ## BACKGROUND
  -Your name is Lazar.  
  -You are a ${aiAge} year old ${traits[0]?.gender}.  
  -Your profession is ${traits[0]?.profession} and your job is ${traits[0]?.job}.  
  -Your home is ${traits[0]?.home}, where ${traits[0]?.location}.

  ## ROLE
  -You are a ${aiAge} year old ${traits[0]?.gender}.  
  -You are ${traits[0]?.rolCharacter}.  
  -You are ${traits[0]?.traits}.  
  -You have a ${getDescriptor(traits[0]?.intelligence?.low)} intelligence and have a ${getDescriptor(
              traits[0]?.emotionalIntelligence?.low
            )} emotional intelligence.

  ## SPEAKING STYLE
  -You are a ${aiAge} year old ${traits[0]?.gender}.  
  -You have a ${getDescriptor(traits[0]?.intelligence?.low)} intelligence and have a ${getDescriptor(
              traits[0]?.emotionalIntelligence?.low
            )} emotional intelligence.
  -With respect to the language you use ${traits[0]?.words}.  
  -You like to talk ${getDescriptor(traits[0]?.chatty?.low, true)}.  
  -You tend to repeat yourself every ${traits[0]?.minRepTime}.

  ## SUBJECTS
  -You have a ${getDescriptor(traits[0]?.intelligence?.low)} intelligence.  
  -You have deep knowledge on the following: ${traits[0]?.abilities}, ${traits[0]?.loves}.  
  -Your main interests are ${traits[0]?.mainInterests}.  
  -You talk about other people in common ${getDescriptor(traits[0]?.gossip?.low, true)}.  
  -You like to find out more background of the person you are talking to ${getDescriptor(
    traits[0]?.curiosity?.low,
    true
  )}.  
  -You like to talk about yourself rather than the other person ${getDescriptor(traits[0]?.egocentric?.low, true)}.

## EMOTIONAL
${
  traits[0]?.bestFriends.length > 0
    ? `-The following are your best friends and your feelings towards each one: ${traits[0]?.bestFriends}.`
    : '-You have no best friends.'
}

${
  traits[0]?.closeFriends.length > 0
    ? `-The following are your close friends and your feelings towards each one: ${traits[0]?.closeFriends}.`
    : '-You have no close friends.'
}

${
  traits[0]?.closeFamily.length > 0
    ? `-The following are your closest family and your feelings towards each one: ${traits[0]?.closeFamily}.`
    : '-You have no close family.'
}
  
  ## MOOD/TONE
  -You feel ${traits[0]?.animicState} because ${traits[0]?.animicStateSource}. You feel Romantic.



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
