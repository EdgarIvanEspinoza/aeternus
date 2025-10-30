import React, { useEffect, useRef } from 'react';
import ChatInput from './ChatInput/ChatInput';

export const MobileChatModal = ({
  isOpen,
  onClose,
  handleSubmit,
  input,
  handleInputChange,
  disabled,
  scrollToBottom,
}: {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  scrollToBottom?: (smooth?: boolean) => void;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // prevent background scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const wrappedSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const res = handleSubmit(e);
    if (res && typeof (res as Promise<void>).then === 'function') await res;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center sm:hidden">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        ref={containerRef}
        className="relative w-full max-w-md mx-auto bg-zinc-900 p-4 rounded-xl shadow-lg overflow-auto"
        style={{ maxHeight: '90vh' }}
      >
        <div className="max-w-[1200px] mx-auto">
          <ChatInput
            handleSubmit={wrappedSubmit}
            input={input}
            handleInputChange={handleInputChange}
            disabled={disabled}
            scrollToBottom={scrollToBottom}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileChatModal;
