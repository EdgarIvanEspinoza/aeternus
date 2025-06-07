import React, { useEffect, useRef } from 'react';
import ChatInputComponent from './ChatInput/ChatInput';
import ChatHook from '../../hook/chat.hook';
import { ChatMessage } from './ChatMessage/ChatMessage';
import { addToast } from '@heroui/react';
import { Wrench } from 'lucide-react';

export const Chat = ({
  username,
  adminMode,
}: {
  username: string | null | undefined;
  adminMode: boolean;
}): React.ReactElement => {
  const { messages, input, handleInputChange, handleSubmit } = ChatHook(username);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if (user && !isLoading) {
  //     fetch('/api/user/save', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(user),
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (adminMode) {
      const evtSource = new EventSource('/api/notifications');

      evtSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // (`${data.cypher}\n${data.purpose}\n${data.reaction}`);
        const toasts = [
          {
            title: 'Cypher Builder Tool',
            description: `Reaction: ${data.reaction}`,
          },
          {
            title: 'Cypher Builder Tool',
            description: `Purpose: ${data.purpose}`,
          },
          {
            title: 'Cypher Builder Tool',
            description: `Cypher: ${data.cypher}`,
          },
        ];

        toasts.forEach((toast, index) => {
          setTimeout(() => {
            addToast(toast);
          }, index * 100);
        });
      };

      return () => {
        evtSource.close();
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div className="flex flex-col justify-end dark flex-1 pb-10 w-[80%] bg-background">
        {messages
          .slice(1)
          .filter((msg) => msg.role !== 'system')
          .map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isAssistant={message.role === 'assistant'}
              username={username}
            />
          ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="sticky bottom-0 z-10 bg-background w-full mt-4">
        <ChatInputComponent {...{ handleSubmit, input, handleInputChange }} />
      </div>
    </>
  );
};
