import { Message, useChat } from 'ai/react';
import { useEffect } from 'react';

const ChatHook = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
  } = useChat();

  const firstMessage = {
    id: '1',
    role: 'user',
    content:
"Quiero que tomes el rol de mi padre, es un señor de 50 años con 30 años de experiencia en el mundo de los concirtos, has sido nominado al grammy y ademas estas muy orgulloso de tu hijo"  } as Message;

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
