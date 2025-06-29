import React from 'react';
import { Button, Input, Link } from '@heroui/react';
import { Send } from 'lucide-react';

const ChatInput = ({
  handleSubmit,
  input,
  handleInputChange,
  disabled,
}: {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  handleInputChange: any;
  disabled: boolean;
}): React.ReactElement => {
  return (
    <div className="w-full mb-4 flex flex-col items-center self-end">
      <form onSubmit={handleSubmit} className="w-[80%]">
        <Input
          disabled={disabled}
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
                radius="full"
                disabled={disabled}
                onPress={() => {
                  const form = document.querySelector('form');
                  form && form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }}>
                <Send size={20} />
              </Button>
            </div>
          }
        />
      </form>
    </div>
  );
};

export default ChatInput;
