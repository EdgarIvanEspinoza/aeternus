import { styled } from 'styled-components';

const ChatComponentStyled = styled.div`
    display: flex;
    flex-direction: column-reverse;
    margin: 0 auto;
    height: 80vh;
    width: 90%;
    overflow: auto;
    padding: 20px;
`;
ChatComponentStyled.displayName = 'ChatComponentStyled';

const ChatInputStyled = styled.div`
    transform: translateZ(0);
`;
ChatComponentStyled.displayName = 'ChatInputStyled';

export { ChatComponentStyled, ChatInputStyled };
