import { styled } from '@nextui-org/react';

const MainStyled = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
});

const ChatComponentStyled = styled('div', {
    display: 'flex',
    flexDirection: 'column-reverse',
    margin: '0 auto',
    marginBottom: '50px',
    height: '70vh',
    width: '70vw',
    overflow: 'auto',
    padding: '20px',
    flexGrow: 4,
});

const ChatInputStyled = styled('div', {
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'sticky',
    bottom: '0',
    padding: '20px',
    zIndex: 1,
});

export { ChatComponentStyled, ChatInputStyled, MainStyled };
