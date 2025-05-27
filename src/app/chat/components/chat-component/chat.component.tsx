import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import ChatInputComponent from './components/chat-input/chat-input.component';
import ChatHook from '../../hook/chat.hook';
import { ChatComponentStyled, ChatTextStyled, GradientText } from './chat.component.styled';
import { useUser } from '@auth0/nextjs-auth0/client';

const ChatComponent = ({ username }: { username: string | null | undefined }): React.ReactElement => {
  const { messages, input, handleInputChange, handleSubmit } = ChatHook(username);
  // Save messages in db

  const { user, isLoading } = useUser();

  useEffect(() => {
    if (user && !isLoading) {
      const saveUser = async () => {
        await fetch('/api/user/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });
      };

      saveUser();
    }
  }, []);

  const saveMessages = async () => {
    try {
      const response = await fetch('/api/chat/saveMessages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.sub,
          content: messages[messages.length - 1].content || '',
          role: messages[messages.length - 1].role || 'user',
        }),
      });
      if (!response.ok) {
        throw new Error('Error saving messages');
      }
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  // Save messages when the component mounts
  // useEffect(() => {
  //   if (messages.length === 0) return;
  //   console.log('saving messages...');
  //   saveMessages();
  // }, [messages]);

  return (
    <>
      <ChatComponentStyled>
        {messages
          .slice(1)
          .reverse()
          .map((message) => {
            const isAeternus = message.role === 'assistant';
            const isSystem = message.role === 'system';
            return (
              <>
                {!isSystem ? (
                  <div key={message.id}>
                    <ChatTextStyled>
                      <p>{isAeternus ? `Aeternus 🐲: ` : `${username} 🧑‍💻: `}</p>
                      <GradientText isAeternus={isAeternus}>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </GradientText>
                    </ChatTextStyled>
                  </div>
                ) : null}
              </>
            );
          })}
      </ChatComponentStyled>
      <ChatInputComponent {...{ handleSubmit, input, handleInputChange }} />
    </>
  );
};

export default ChatComponent;
