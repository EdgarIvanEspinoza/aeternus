import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Text } from '@nextui-org/react';
import ChatInputComponent from './components/chat-input/chat-input.component';
import ChatHook from '../../hook/chat.hook';
import { ChatComponentStyled, ChatTextStyled, GradientText } from './chat.component.styled';

const ChatComponent = ({ username }: { username: string | null | undefined }): React.ReactElement => {
  const { messages, input, handleInputChange, handleSubmit } = ChatHook(username);
  console.log('messages', messages);
  return (
    <>
      <ChatComponentStyled>
        {messages
          .slice(1)
          .reverse()
          .map((message) => {
            const isAeternus = message.role !== 'user';
            return (
              <div key={message.id}>
                <ChatTextStyled>
                  <p>{isAeternus ? `Aeternus 🐲: ` : `${username} 🧑‍💻: `}</p>
                  <GradientText isAeternus={isAeternus}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </GradientText>
                </ChatTextStyled>
              </div>
            );
          })}
      </ChatComponentStyled>
      <ChatInputComponent {...{ handleSubmit, input, handleInputChange }} />
    </>
  );
};

export default ChatComponent;
