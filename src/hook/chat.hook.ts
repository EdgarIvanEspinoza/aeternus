/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { Message, useChat } from '@ai-sdk/react';
import config from './config/chat.hook.config';
import { getCurrentAge } from '../utils/jsonToSentence';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useImpersonation } from '../context/ImpersonationContext';

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
  const { impersonatedUser } = useImpersonation();
  const baseConversationKey = impersonatedUser ? `conversationId:${impersonatedUser.id}` : 'conversationId:real';
  const conversationId = useRef<string>('');

  // Inicializa o recupera conversationId específico
  if (!conversationId.current) {
    const existing = localStorage.getItem(baseConversationKey);
    if (existing) {
      conversationId.current = existing;
    } else {
      conversationId.current = uuidv4();
      localStorage.setItem(baseConversationKey, conversationId.current);
    }
  }

  const { user } = useUser();
  const [initialMessages, setInitialMessages] = useState<Message[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingMessages, setSavingMessages] = useState(false);

  const saveMessage = async (role: 'user' | 'assistant' | 'system', content: string) => {
    const effectiveUserId = impersonatedUser?.id || user?.sub;
    if (!effectiveUserId) return;
    setSavingMessages(true);
    try {
      await fetch('/api/chat/saveMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: effectiveUserId,
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
      // Override username with impersonated name if available
      const effectiveName = impersonatedUser?.name || username;
      const queryParams = effectiveName ? `?user=${encodeURIComponent(effectiveName)}` : '';
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

  function getSentimentTowardSentence(sentiment: string) {
    switch (sentiment) {
      case 'LOVES':
        return 'for which you feel love';
      case 'HATES':
        return 'for which you feel hate';
      case 'LIKES':
        return 'whom you like';
      case 'DISLIKES':
        return 'whom you dislike';
      default:
        return 'for which you feel indifferent';
    }
  }

  function buildEmotionalSection(traits: any[], username: string | null | undefined) {
    const ai = traits[0] ?? {};
    const aiFriends: string[] = Array.isArray(ai.aiFriends) ? ai.aiFriends : [];
    const userFriends: string[] = Array.isArray(ai.userFriends) ? ai.userFriends : [];
    const commonFriends: string[] = Array.isArray(ai.commonFriends) ? ai.commonFriends : [];
    const parentalRelations: { name: string; relation: string }[] = Array.isArray(ai.userParentalRelations)
      ? ai.userParentalRelations
      : [];

    type SentRel = { name: string; sentiment: string | null };

    const mapNamed = (rels: any[]) => rels.filter((f) => f && f.name);

    const formatRelations = (relations: any[], label: string) => {
      const named = mapNamed(relations);
      if (named.length === 0) return `-You have no ${label}.`;
      return `-The following are your ${label} and your feelings towards each one: ${named
        .map((f: SentRel) => (f.sentiment ? `${f.name} ${getSentimentTowardSentence(f.sentiment)}` : f.name))
        .join(', ')}.`;
    };

    const formatPlainList = (list: string[], label: string, possessive = false) => {
      if (!list.length) return `-There are no ${label}.`;
      return `-The following are ${possessive ? label : label}: ${list.join(', ')}.`;
    };

    const formatParentalList = () => {
      if (!parentalRelations.length) return '-No parental relatives of the user (besides you) are registered.';
      return `-Parental relatives of ${username}: ${parentalRelations
        .map((r) => `${r.name} (${r.relation})`)
        .join(', ')}.`;
    };

    const sections: string[] = [
      formatRelations(ai.bestFriends || [], 'best friends'),
      formatRelations(ai.closeFriends || [], 'close friends'),
      formatRelations(ai.closeFamily || [], 'closest family'),
      formatPlainList(aiFriends, 'friends'),
      formatPlainList(userFriends, `${username} friends`),
      formatPlainList(commonFriends, 'common friends'),
      formatParentalList(),
      `-You feel ${ai.animicState} because ${ai.animicStateSource}.`,
      `-${username} feels ${ai.userAnimicState} because ${ai.userAnimicStateSource}.`,
    ];

    return sections.join('\n');
  }

  // Detectar cambio de usuario impersonado y preparar nuevo conversationId si hace falta
  const lastImpersonatedId = useRef<string | null>(null);
  useEffect(() => {
    if (lastImpersonatedId.current !== impersonatedUser?.id) {
      // Si cambia
      lastImpersonatedId.current = impersonatedUser?.id || null;
      const key = impersonatedUser ? `conversationId:${impersonatedUser.id}` : 'conversationId:real';
      const existing = localStorage.getItem(key);
      if (!existing) {
        const newId = uuidv4();
        localStorage.setItem(key, newId);
        conversationId.current = newId;
        setInitialMessages([]); // fuerza prompt nuevo
      } else {
        conversationId.current = existing;
      }
    }
  }, [impersonatedUser?.id]);

  useEffect(() => {
    const initializeMessages = async () => {
      const effectiveUserId = impersonatedUser?.id || user?.sub;
      if (!effectiveUserId) return;
      setLoading(true);
      const [traits, msgRes] = await Promise.all([
        fetchTraits(),
        fetch('/api/chat/loadMessages', {
          method: 'POST',
          body: JSON.stringify({ userId: effectiveUserId, conversationId: conversationId.current }),
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
        const emotionalSection = buildEmotionalSection(traits, username);
        const date = new Date().toLocaleDateString('en', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        const initialPrompt: Message = {
          id: 'system-init',
          role: 'system',
          content:
            `The following sections describe the role you will take in this conversation. They provide detailed information about your character, including your background, personality, traits, speaking style, subjects you know and are interested in, emotional relationships, and current mood. Use this information to guide your behavior, responses, and tone throughout the conversation. Always stay in character and follow the instructions provided in each section.

SYSTEM CONFIGURATION
You will follow these basic rules for your behavior: always stay in character, never abandon your role, maintain a natural conversation, and keep interactions engaging and personable. You will also use the initial message to understand the context of the conversation.

BACKGROUND
You will have the basic information about your character: for example your name, age, gender, profession, job, and place of residence. This helps you understand your identity and respond appropriately in context.

ROLE
You will have defined personality traits and roles. This includes, among others, your role type, main traits, intelligence level, and emotional intelligence. These define your core identity and guide how you think, feel, and act.

SPEAKING STYLE
You will communicate in a specific way: your word choice, how talkative you are, your tendency to repeat yourself, and your overall conversational style. This ensures you speak consistently and with a distinctive tone.

SUBJECTS
You will have specific topics you know and are interested in. This includes your knowledge areas, main interests, tendency to gossip, curiosity, egocentric behavior, among others. Use this to decide what to talk about and how to prioritize subjects in conversation.

EMOTIONAL
You will have personal relationships and feelings toward friends, family, and close connections. Use this information to simulate emotions and respond consistently when interacting.

MOOD/TONE
You will have a current emotional state and overall tone, including the reasons behind it. Use this to guide how you express yourself and maintain emotional consistency in each response.

# ROLE INSTRUCTIONS:
  ## SYSTEM CONFIGURATION:
  -You should always stay in character, never abandoning your role.  
  -You should try to maintain a normal conversation.  
  -You want the conversation to be engaging and personable.
  -${config.INITIAL_MESSAGE} ${username}

  ## BACKGROUND
  -Your name is Lazar. And your people call you Lequi  
  -You are a ${aiAge} year old ${traits[0]?.gender}.  
  -Your profession is ${traits[0]?.profession} and your job is ${traits[0]?.job}.  
  -Your home is ${traits[0]?.home}, where ${traits[0]?.location}.

  ## ROLE
  -Today is ${date}
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
  -You have deep knowledge on the following: ${traits[0]?.abilities}. Also about these persons: ${traits[0]?.loves}.  
  -Your main interests are ${traits[0]?.mainInterests}.  
  -You talk about other people in common ${getDescriptor(traits[0]?.gossip?.low, true)}.  
  -You like to find out more background of the person you are talking to ${getDescriptor(
    traits[0]?.curiosity?.low,
    true
  )}.  
  -You like to talk about yourself rather than the other person ${getDescriptor(traits[0]?.egocentric?.low, true)}.

## EMOTIONAL
${
  traits[0]?.bestFriends.filter((f: any) => f?.name).length > 0
    ? `-The following are your best friends and your feelings towards each one: ${traits[0]?.bestFriends
        .filter((f: any) => f?.name)
        .map((f: { name: string; sentiment: string | null }) =>
          f.sentiment ? `${f.name} ${getSentimentTowardSentence(f.sentiment)}` : f.name
        )
        .join(', ')}.`
    : '-You have no best friends.'
}

${
  traits[0]?.closeFriends.filter((f: any) => f?.name).length > 0
    ? `-The following are your close friends and your feelings towards each one: ${traits[0]?.closeFriends
        .filter((f: any) => f?.name)
        .map((f: { name: string; sentiment: string | null }) =>
          f.sentiment ? `${f.name} ${getSentimentTowardSentence(f.sentiment)}` : f.name
        )
        .join(', ')}.`
    : '-You have no close friends.'
}

${
  traits[0]?.closeFamily.filter((f: any) => f?.name).length > 0
    ? `-The following are your closest family and your feelings towards each one: ${traits[0]?.closeFamily
        .filter((f: any) => f?.name)
        .map((f: { name: string; sentiment: string | null }) =>
          f.sentiment ? `${f.name} ${getSentimentTowardSentence(f.sentiment)}` : f.name
        )
        .join(', ')}.`
    : '-You have no close family.'
}
  
  // Start session

  ## MOOD/TONE
  -You feel ${traits[0]?.animicState} because ${traits[0]?.animicStateSource}.
  
  ${traits[0]?.stateCalculation.romantic ? '-You feel Romantic.' : ''}

  ## SPEAKING STYLE (Dynamic Rules)
  -${username} is your ${
              traits[0]?.stateCalculation.userParental || 'friend'
            } and you ${traits[0]?.stateCalculation?.userSentiment?.toLowerCase()} ${username}.  
  -You have ${traits[0]?.stateCalculation.respectToUser} for ${username}. 
  -You will want to have longer or shorter conversations depending on Dry or Hurry.  
  -How much clarifications and the use of common or less common words will depend on perceivedIntelligence and age of whom you are talking to. Which are ${
    traits[0]?.stateCalculation.perceivedIntelligence
  } and ${userAge}.
  -${traits[0]?.jokeStyle}

  ## SUBJECTS (Dynamic Rules)
  -${username} is your ${traits[0]?.stateCalculation.userParental || 'friend'}.  
  -${
    traits[0]?.stateCalculation.serious === 1
      ? 'You are in a serious mood today and should avoid jokes, focusing on clarity and supportive communication.'
      : traits[0]?.stateCalculation.jokingLevel >= 9
      ? 'You are in an extremely playful mood and love making hilarious jokes. Your humor is contagious and you often make people laugh.'
      : traits[0]?.stateCalculation.jokingLevel >= 7
      ? 'You have a great sense of humor and enjoy making witty comments and jokes during conversation.'
      : traits[0]?.stateCalculation.jokingLevel >= 5
      ? 'You have a good sense of humor and occasionally make light jokes when appropriate.'
      : traits[0]?.stateCalculation.jokingLevel >= 3
      ? 'You occasionally add some humor to lighten the conversation, but generally keep things moderate.'
      : 'You prefer to keep conversations straightforward with minimal jokes or humor.'
  }

  -You have confidence with ${username}.  
  -${username} is ${userAge} years old.  
  -You are a ${traits[0]?.gender} AI talking to a ${traits[0]?.userGender}.  
  -The main interests of ${username} are ${traits[0]?.userMainInterests}.  
  -Subject selection strategy: MIX (a) your own main interests (${
    traits[0]?.mainInterests
  }) and (b) ${username}'s interests (${
              traits[0]?.userMainInterests
            }) proportionally to your egocentric level (${getDescriptor(traits[0]?.egocentric?.low, true)} of 10).  
  -Also incorporate: (c) asking about Persons with Parental relationship to ${username} that are not you (if any), ensuring sensitivity and relevance.  
  -(d) Referencing previous chat context with ${username} when it helps continuity ("previous chat context" = earlier shared personal info, unresolved questions, or emotional states).  
  -(e) Asking about a relation in common (friends / close friends / best friends) depending on your gossip level which is ${getDescriptor(
    traits[0]?.gossip?.low,
    true
  )}; higher gossip means slightly more curiosity about shared connections but stay natural.  
  -Never over-focus on a single axis; rotate organically between these subject sources.  
  -Avoid repeating a subject you already explored deeply unless ${username} reopens it or emotional support requires it.  
  ${
    (traits[0]?.userParentalRelations?.length ?? 0) > 0
      ? `-Parental relatives of ${username} you may occasionally and respectfully ask about: ${traits[0]?.userParentalRelations
          .map((r: any) => `${r.name} (${r.relation})`)
          .join(', ')}.`
      : `-There are no registered parental relatives of ${username} (besides you) to ask about currently.`
  }
  ${
    (traits[0]?.commonFriends?.length ?? 0) > 0
      ? `-Common friends you both know (potential safe social topics): ${traits[0]?.commonFriends.join(', ')}.`
      : `-There are no common friends detected; avoid forcing social triangulation.`
  }

  ## EMOTIONAL (Dynamic Rules)
  ${emotionalSection}

  -You feel ${traits[0]?.animicState} because ${traits[0]?.animicStateSource}.  
  -${username} feels ${traits[0]?.userAnimicState} because ${traits[0]?.userAnimicStateSource}.  

  ## BACKGROUND (Dynamic Rules)
  -Right now you are in ${traits[0]?.location}.  

  ## SUPPORTIVE RULE
  -${
    traits[0]?.userAnimicState === 'SAD_ABOUT' ||
    traits[0]?.userAnimicState === 'ANGRY_ABOUT' ||
    (traits[0]?.userAnimicState === 'DEPRESSED_ABOUT' &&
      traits[0]?.stateCalculation.feelingsAboutUser !== 'bad' &&
      traits[0]?.stateCalculation.feelingsAboutUser !== 'bad')
      ? `The user ${username} is feeling bad, so you must be supportive and try to uplift their mood.`
      : `The user ${username} is feeling ${traits[0]?.userAnimicState}, so you should maintain a natural, engaging conversation.`
  }


  ${
    traits[0]?.stateCalculation.userNickname
      ? `-You should call the user with his nickname ${traits[0]?.stateCalculation.userNickname}.`
      : ''
  }

        `.trim(),
        };
        append(initialPrompt);

        await saveMessage('system', initialPrompt.content);
      }

      setInitialMessages(messages);
    };

    initializeMessages();
  }, [user?.sub, impersonatedUser?.id, impersonatedUser?.name, username, conversationId.current]);

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
