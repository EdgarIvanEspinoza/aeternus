import React, { useEffect, useRef } from 'react';
import { Button, Input } from '@heroui/react';
import { Send } from 'lucide-react';

const ChatInput = ({
  handleSubmit,
  input,
  handleInputChange,
  disabled,
  scrollToBottom,
}: {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  scrollToBottom?: (smooth?: boolean) => void;
}): React.ReactElement => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Autofocus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
    // Scrollear hacia abajo inmediatamente después de enviar
    scrollToBottom?.(false);
    // Re-focus después para asegurar que el usuario pueda seguir escribiendo
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      // Segundo intento en caso de que el primero falle
      scrollToBottom?.(true);
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return (
    <div className="w-full flex flex-col items-center self-end">
      <form onSubmit={onSubmit} className="w-full">
        <Input
          // HeroUI Input ref using callback to keep strong typing
          ref={(el) => { inputRef.current = el as HTMLInputElement | null; }}
          disabled={disabled}
          placeholder="Escribe y recibe sabiduría..."
          value={input}
          variant="faded"
          onChange={handleInputChange}
          onKeyDown={onKeyDown}
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
                  const form = inputRef.current?.form;
                  if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                  scrollToBottom?.(false); // Scroll inmediato al dar click
                  requestAnimationFrame(() => {
                    inputRef.current?.focus();
                    scrollToBottom?.(true); // Segundo intento
                  });
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
