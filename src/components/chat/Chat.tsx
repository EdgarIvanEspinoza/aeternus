import React, { useEffect, useRef } from 'react';
import ChatInputComponent from './ChatInput/ChatInput';
import ChatHook from '../../hook/chat.hook';
import { ChatMessage } from './ChatMessage/ChatMessage';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getNameAndFamilyFromUser, getNameFromUser } from '@utils/main.utils';

export const Chat = ({
  adminMode,
}: {
  adminMode: boolean;
}): React.ReactElement => {
  const { user } = useUser();
  const { messages, input, handleInputChange, handleSubmit, loading, savingMessages } = ChatHook(getNameFromUser(user));

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
              <ChatMessage key={message.id} message={message} role={message.role} username={getNameAndFamilyFromUser(user)} />
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
