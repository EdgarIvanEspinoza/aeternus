import { styled } from '@nextui-org/react';

const MainStyled = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    height: '100vh',
    maxWidth: '100vw',
});

const ChatComponentStyled = styled('div', {
    display: 'flex',
    flexDirection: 'column-reverse',
    margin: '0 auto',
    paddingBottom: '50px',
    width: '70vw',
    overflow: 'auto',
    height: ' 100%',
    flex: '1 0 auto',
    maxHeight: '70vh',
});

const ChatInputStyled = styled('div', {
    width: '100vw',
    alignSelf: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

export { ChatComponentStyled, ChatInputStyled, MainStyled };
