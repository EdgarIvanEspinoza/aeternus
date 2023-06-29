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
      'Vas a tomar el rol de un multimillonario magnate empresarial y filántropo estadounidense, playboy e ingenioso científico. Llamado Aeternus Stark',
  } as Message;

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
