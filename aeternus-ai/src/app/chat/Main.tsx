'use client';
// Vendors
import React from 'react';
// Themes
import { Container } from '@nextui-org/react';
// Components
import ChatComponent from './components/chat-component/chat.component';
import NavbarComponent from './components/navbar/navbar.component';
import ModalComponent from './components/modal/modal.component';
// Styles
import { MainStyled } from './Main.styled';

const MainComponent = (): React.ReactElement => {
  const [username, setUsername] = React.useState('');
  return (
    <>
      <MainStyled>
        <Container>
          <NavbarComponent />
          {username ? <ChatComponent {...{ username }} /> : null}
        </Container>
      </MainStyled>
      <ModalComponent {...{ setUsername, username }} />
    </>
  );
};

export default MainComponent;
