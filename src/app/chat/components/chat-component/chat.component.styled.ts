import { styled } from '@nextui-org/react';

const ChatComponentStyled = styled('div', {
    display: 'flex',
    flexDirection: 'column-reverse',
    margin: '10px auto',
    paddingBottom: '50px',
    width: '70vw',
    overflow: 'auto',
    height: '100vh',
    maxHeight: '70vh',
});

const ChatInputStyled = styled('div', {
    maxWidth: '100%',
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

export { ChatComponentStyled, ChatInputStyled };
