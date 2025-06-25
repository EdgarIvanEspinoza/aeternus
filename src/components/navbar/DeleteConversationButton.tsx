import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@heroui/react';
import { useState } from 'react';

export const ResetConversationButton = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleReset = async () => {
    if (!user?.sub) return;
    setLoading(true);
    try {
      const res = await fetch('/api/chat/deleteMessages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.sub }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setDone(true);
      window.location.reload(); // o también puedes limpiar el state manualmente
    } catch (err) {
      console.error('Error resetting conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onPress={handleReset} variant="flat" color="danger" className="hidden md:inline-flex" disabled={loading}>
      {loading ? 'Borrando...' : done ? 'Reiniciado' : 'Reiniciar conversación'}
    </Button>
  );
};
