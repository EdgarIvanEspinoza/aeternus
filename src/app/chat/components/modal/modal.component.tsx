import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Link, Modal, Button, Text, Loading } from '@nextui-org/react';

const ModalComponent = ({
  setUsername,
  username,
}: {
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  username: string;
}): React.ReactElement => {
  const [visible, setVisible] = React.useState(true);
  const handlerLoginButton = (): any => {
    setVisible(false);
    window.location.href = '/api/auth/login';
  };
  const { isLoading, error } = useUser();

  return (
    <>
      <Modal
        closeButton
        preventClose
        blur
        animated
        aria-labelledby="modal-title"
        open={visible}
        onClose={() => setVisible(false)}>
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Bienvenido a{' '}
            <Text b size={18}>
              Aeternus 🐲
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          {error ? (
            <div>{error.message}</div>
          ) : isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              <Text>
                Para empezar que tengas una experiencia única,
                <br /> debes iniciar sesión
              </Text>
              <Button auto color={'gradient'} onPress={() => handlerLoginButton()}>
                {isLoading ? (
                  <Loading color="currentColor" size="sm" />
                ) : (
                  <Text b size={18}>
                    Iniciar sesión
                  </Text>
                )}
              </Button>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Link href="/policies">Términos y condiciones</Link>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalComponent;
