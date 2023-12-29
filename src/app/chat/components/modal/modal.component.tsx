import React from 'react';
import { Link, Modal, Input, Button, Text } from '@nextui-org/react';

const ModalComponent = ({
    setUsername,
    username,
}: {
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    username: string;
}): React.ReactElement => {
    const [visible, setVisible] = React.useState(true);
    const [newUsername, setNewUsername] = React.useState('');
    const closeHandler = (username: string): any => {
        setUsername(username);
        setVisible(false);
    };
    return (
        <>
            {username === '' ? (
                <Button
                    auto
                    shadow
                    color="secondary"
                    css={{ margin: 'auto', marginTop: '$4xl' }}
                    onPress={() => setVisible(true)}>
                    Iniciar
                </Button>
            ) : null}
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
                    <Text>
                        Para empezar que tengas una experiencia única,
                        <br /> debes escribir tu nombre:
                    </Text>
                    <Input
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Tu nombre"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        aria-label="Name input"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Link href="/policies">Términos y condiciones</Link>
                    <Button
                        auto
                        color={'gradient'}
                        onPress={() => closeHandler(newUsername)}
                        disabled={newUsername === ''}>
                        Entrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default ModalComponent;
