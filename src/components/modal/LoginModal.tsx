'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Link, Button } from '@heroui/react';

export const LoginModal = ({ isOpen, onOpenChange }: any): React.ReactElement => {
  const [isHelixReady, setHelixReady] = useState(false);

  useEffect(() => {
    import('ldrs').then(({ helix }) => {
      helix.register();
      setHelixReady(true);
    });
  }, []);

  const { isLoading, error } = useUser();

  return (
    <Modal
      isOpen={isOpen}
      isDismissable={true}
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
                Bienvenido a <span className="text-[18px] font-bold">Aeternus 🐲</span>
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
                    Para empezar que tengas una experiencia única,
                    <br /> debes iniciar sesión
                  </span>
                  <Button
                    fullWidth
                    color={'primary'}
                    className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg mt-4"
                    href="/api/auth/login"
                    onPress={() => {
                      onClose();
                    }}>
                    <span className="text-[18px] font-bold">Iniciar sesión</span>
                  </Button>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Link href="/policies" color="warning">
                Términos y condiciones
              </Link>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
