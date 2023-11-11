import React from 'react';
// Components
import { Text } from '@nextui-org/react';
import ChatInputComponent from './components/chat-input/chat-input.component';
// Hooks
import ChatHook from '../../hook/chat.hook';
// Styles
import { ChatComponentStyled } from './chat.component.styled';

const ChatComponent = ({ username }: { username: string }): React.ReactElement => {
  const { messages, input, handleInputChange, handleSubmit, moodMessages } = ChatHook(username);
  // TODO: Send mood message to another call with the previous message to analyze the mood
  const moodResponse = moodMessages
    .slice(1)
    .reverse()
    .map((message: any) => message.content);
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
                {isAeternus ? `Aeternus 🐲: ${moodResponse}` : `${username} 🧑‍💻: `}
                <Text
                  h5
                  size="$xl"
                  css={{
                    textGradient: isAeternus
                      ? '45deg, $blue600 -20%, $pink600 50%'
                      : '45deg, $yellow600 -20%, $red600 100%',
                  }}
                  weight="bold">
                  {message.content}
                </Text>
              </div>
            );
          })}
      </ChatComponentStyled>
      <ChatInputComponent {...{ handleSubmit, input, handleInputChange }} />
    </>
  );
};

export default ChatComponent;
