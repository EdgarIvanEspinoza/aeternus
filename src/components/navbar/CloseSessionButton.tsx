import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@heroui/react';
import { getNameFromUser } from '@utils/main.utils';
import ChatHook from 'hook/chat.hook';
import { useState } from 'react';

export const CloseSessionButton = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { messages } = ChatHook(getNameFromUser(user));

  const handleSaveConversation = async () => {
    try {
      const response = await fetch('/api/chat/saveSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation: messages.map((m) => `${m.role}: ${m.content}`),
          userName: getNameFromUser(user),
        }),
      });

      if (response.status === 200) {
        const successData = await response.json();
        console.log('Conversation saved successfully:', successData);
      }
      setDone(true);
    } catch (error) {
      console.error('Error saving conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onPress={handleSaveConversation} variant="flat" color="warning" disabled={loading}>
      {loading ? 'Guardando...' : done ? 'Guardado' : 'Guardar conversación'}
    </Button>
  );
};
