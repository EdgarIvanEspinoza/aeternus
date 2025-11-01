'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { GradientText } from '@components/landing/GradientText';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LoginModal = ({ isOpen, onOpenChange }: any): React.ReactElement => {
  const [isHelixReady, setHelixReady] = useState(false);

  useEffect(() => {
    import('ldrs').then(({ helix }) => {
      helix.register();
      setHelixReady(true);
    });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlerLoginButton = (): any => {
    window.location.href = '/api/auth/login';
  };

  const { isLoading, error } = useUser();

  return (
    <Modal
      isOpen={isOpen}
      isDismissable={false}
      backdrop="blur"
      onOpenChange={onOpenChange}
      hideCloseButton={true}
      classNames={{
        base: 'border-[1px] border-[#ff11ff]',
      }}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <span id="modal-title" className="text-[18px]">
                Welcome to <span className="text-[18px] font-bold">Aeternus 🐲</span>
              </span>
            </ModalHeader>
            <ModalBody>
              {error ? (
                <div>{error.message}</div>
              ) : isLoading ? (
                <div className="w-full text-center">
                  {isHelixReady && <l-helix size="45" speed="2.5" color="white" />}
                </div>
              ) : (
                <>
                  <span>
                    To get started and enjoy a tailored experience,
                    <br /> please sign in
                  </span>
                  <Button
                    fullWidth
                    color={'primary'}
                    className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg mt-4"
                    onPress={() => {
                      handlerLoginButton();
                      onClose();
                    }}>
                    <span className="text-[18px] font-bold">Sign in</span>
                  </Button>
                </>
              )}
            </ModalBody>
            <ModalFooter>
                       <span className="text-zinc-600">Built with <GradientText>Affective Intelligence</GradientText></span>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
