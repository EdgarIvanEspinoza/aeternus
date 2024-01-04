'use client';
// Vendors
import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
// Themes
import { Container } from '@nextui-org/react';
// Components
import ChatComponent from './components/chat-component/chat.component';
import NavbarComponent from './components/navbar/navbar.component';
import ModalComponent from './components/modal/modal.component';
// Styles
import { MainStyled } from './Main.styled';
// Utils
import { getNameFromUser } from './utils/main.utils';

const MainComponent = (): React.ReactElement => {
  const [username, setUsername] = React.useState('');
  const { user, isLoading } = useUser();
  console.log('user', user);
  return (
    <>
      <MainStyled>
        <Container>
          <NavbarComponent />
          {!user ? (
            <ModalComponent {...{ setUsername, username }} />
          ) : (
            <ChatComponent {...{ username: getNameFromUser(user) }} />
          )}
        </Container>
      </MainStyled>
    </>
  );
};

export default MainComponent;
