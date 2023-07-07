import { styled } from 'styled-components';

const ChatComponentStyled = styled.div`
    display: flex;
    flex-direction: column-reverse;
    margin: 0 auto;
    height: 70vh;
    width: 70vw;
    overflow: auto;
    padding: 20px;
`;
ChatComponentStyled.displayName = 'ChatComponentStyled';

const ChatInputStyled = styled.div`
    transform: translateZ(0);
`;
ChatComponentStyled.displayName = 'ChatInputStyled';

const MainStyled = styled.div`
    max-width: 70vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
`;
ChatComponentStyled.displayName = 'MainStyled';

export { ChatComponentStyled, ChatInputStyled, MainStyled };
