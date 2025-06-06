import React, { useEffect, useRef } from 'react';
import ChatInputComponent from './ChatInput/ChatInput';
import ChatHook from '../../hook/chat.hook';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ChatMessage } from './ChatMessage/ChatMessage';

export const Chat = ({ username }: { username: string | null | undefined }): React.ReactElement => {
  const { messages, input, handleInputChange, handleSubmit } = ChatHook(username);
  const { user, isLoading } = useUser();
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div className="flex flex-col my-10 mx-auto pb-[50px] w-[70vw] h-[100vh] max-h-[70vh] overflow-y-auto">
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
      <ChatInputComponent {...{ handleSubmit, input, handleInputChange }} />
    </>
  );
};
