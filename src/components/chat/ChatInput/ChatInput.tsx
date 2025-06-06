import React from 'react';
import { Button, Input, Link } from '@heroui/react';
import { Send } from 'lucide-react';

const ChatInput = ({
  handleSubmit,
  input,
  handleInputChange,
}: {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  handleInputChange: any;
}): React.ReactElement => {
  return (
    <div className="w-full mb-4 flex flex-col items-center self-end">
      <form onSubmit={handleSubmit} className="w-[80%]">
        <Input
          placeholder="Escribe y recibe sabiduría..."
          value={input}
          variant="faded"
          onChange={handleInputChange}
          aria-label="Escribe tu mensaje aquí"
          fullWidth
          size="lg"
          type="text"
          endContent={
            <div className="m-auto">
              <Button
                isIconOnly
                aria-label="Send message"
                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                radius="full">
                <Send size={20} />
              </Button>
            </div>
          }
        />
      </form>
      <p style={{ color: '#333', margin: '1rem 0rem', textAlign: 'center' }}>Eres libre de escribir lo que quieras.</p>
    </div>
  );
};

export default ChatInput;
