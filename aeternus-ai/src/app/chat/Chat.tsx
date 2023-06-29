'use client';

import ChatHook from './hook/chat.hook';

const Chat = (): React.ReactElement => {
  const { messages, input, handleInputChange, handleSubmit } = ChatHook();
  return (
    <div className="flex flex-col max-w-xl px-8 mx-auto">
      {messages.slice(1).map((message) => {
        const isAeternus = message.role !== 'user';
        return (
          <div key={message.id}>
            {isAeternus ? 'Aeternus 🐲: ' : 'User 🧑‍💻: '}
            <span
              className={`${isAeternus ? 'text-green-500' : 'text-blue-300'}`}
            >
              {message.content}
            </span>
          </div>
        );
      })}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed w-full max-w-xl px-4 py-2 m-auto mb-8 border border-gray-200 rounded-full shadow-xl bottom-4
          "
          type="text"
          name="message"
          value={input}
          placeholder="Type wisdom for knowledge..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
};

export default Chat;
