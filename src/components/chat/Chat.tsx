import React, { useEffect, useRef } from 'react';
import ChatInputComponent from './ChatInput/ChatInput';
import ChatHook from '../../hook/chat.hook';
import { ChatMessage } from './ChatMessage/ChatMessage';
// import { addToast } from '@heroui/react';
// import pusherClient from '@lib/events/notifications';

export const Chat = ({
  username,
  adminMode,
}: {
  username: string | null | undefined;
  adminMode: boolean;
}): React.ReactElement => {
  const { messages, input, handleInputChange, handleSubmit, loading, savingMessages } = ChatHook(username);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if (adminMode) {
  //     const channel = pusherClient.subscribe('aeternus');

  //     channel.bind('cypher-tool-notification', (data: { reaction: string; purpose: string; cypher: string }) => {
  //       const toasts = [
  //         {
  //           title: 'Cypher Builder Tool',
  //           description: `Reaction: ${data.reaction}`,
  //         },
  //         {
  //           title: 'Cypher Builder Tool',
  //           description: `Purpose: ${data.purpose}`,
  //         },
  //         {
  //           title: 'Cypher Builder Tool',
  //           description: `Cypher: ${data.cypher}`,
  //         },
  //       ];

  //       toasts.forEach((toast, index) => {
  //         setTimeout(() => {
  //           addToast(toast);
  //         }, index * 100);
  //       });
  //     });

  //     return () => {
  //       pusherClient.unsubscribe('cypher-builder-tool');
  //     };
  //   }
  // }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center flex-1 h-full w-full">
          <div className="loader">
            <l-quantum size="45" speed="1.75" color="#ec4899"></l-quantum>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-end dark flex-1 pb-10 w-[80%] bg-background">
          {messages
            .filter((msg) => (adminMode ? true : msg.role !== 'system'))
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
      )}
      <div className="sticky bottom-0 z-10 bg-background w-full mt-4">
        <ChatInputComponent disabled={savingMessages} {...{ handleSubmit, input, handleInputChange }} />
      </div>
    </>
  );
};
