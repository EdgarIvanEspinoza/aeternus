import React, { useEffect, useRef, useState } from 'react';
import { Button, Input } from '@heroui/react';
import { Send } from 'lucide-react';

const ChatInput = ({
  handleSubmit,
  input,
  handleInputChange,
  disabled,
  scrollToBottom,
}: {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  scrollToBottom?: (smooth?: boolean) => void;
}): React.ReactElement => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Autofocus on mount (small delay to allow layout to settle and avoid keyboard overlay)
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  const handleFocus = () => {
    // ensure the input is visible when keyboard opens
    requestAnimationFrame(() => {
      try {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch {
        // ignore
      }
      // also call external scrollToBottom if provided
      scrollToBottom?.(true);
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const result = handleSubmit(e);
      if (result && typeof (result as Promise<void>).then === 'function') {
        await result;
      }
      // Scrollear hacia abajo inmediatamente después de enviar
      scrollToBottom?.(false);
      // Re-focus después para asegurar que el usuario pueda seguir escribiendo
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        // Segundo intento en caso de que el primero falle
        scrollToBottom?.(true);
      });
    } finally {
      setSubmitting(false);
    }
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
          disabled={disabled || submitting}
          placeholder="Escribe y recibe sabiduría..."
          value={input}
          variant="faded"
          onChange={handleInputChange}
          onKeyDown={onKeyDown}
          onFocus={handleFocus}
          name="chat-input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          inputMode="text"
          enterKeyHint="send"
          aria-label="Escribe tu mensaje aquí"
          fullWidth
          size="lg"
          type="text"
          className={disabled || submitting ? 'opacity-60' : undefined}
          endContent={
            <div className="m-auto">
              <Button
                isIconOnly
                aria-label="Send message"
                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                radius="full"
                disabled={disabled || submitting}
                type="submit"
                onPress={() => {
                  // quick scroll to bottom; submit is handled natively by button type
                  scrollToBottom?.(false);
                }}>
                {submitting ? (
                  <svg
                    className="animate-spin"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                ) : (
                  <Send size={20} />
                )}
              </Button>
            </div>
          }
        />
      </form>
    </div>
  );
};

export default ChatInput;
