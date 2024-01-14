import type { ChatHandlersBuilderType } from './types/chat.handerls.type';

const registerUser = async ({ name, email }: Pick<ChatHandlersBuilderType, 'name' | 'email'>): Promise<any> => {
  try {
    const response = await fetch('/api/user/id/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al registrar el usuario');
    }

    const data = await response.json();
    console.log('Usuario registrado:', data);
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
  }
};

const searchUser = async (UserID: string) => {
  try {
    const response = await fetch(`/api/usuario/${encodeURIComponent(UserID)}`);

    if (!response.ok) {
      throw new Error('Error al buscar el usuario');
    }

    const data = await response.json();
    console.log('Usuario y messages del usuario encontrado:', data.usuario, data.messages);
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
  }
};

const getMessages = async ({ email }: Pick<ChatHandlersBuilderType, 'email'>) => {
  try {
    const response = await fetch(`/api/user/email/${email}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al buscar los mensajes');
    }

    const data = await response.json();
    console.log('Messages del usuario encontrado:', data);
  } catch (error) {
    console.error(error);
  }
};

const ChatHandlers = ({ name, email }: ChatHandlersBuilderType): any => ({
  handleRegisterUser: () => registerUser({ name, email }),
  handlerGetMessages: () => getMessages({ email }),
  /*   handlerSendMessage: () => sendMessage(userID, conversationID, content),
  handlerGetUser: () => getUser(userID),
  handlerGetUserMessages: () => getUserMessages(userID),
  handlerGetConversation: () => getConversation(conversationID),
  handlerGetConversationMessages: () => getConversationMessages(conversationID),
  handlerCreateConversation: () => createConversation(userID, contactID),
  handlerGetConversations: () => getConversations(userID),
  handlerGetConversationsMessages: () => getConversationsMessages(userID),
  handlerGetConversationsUsers: () => getConversationsUsers(userID),
  */
});

export default ChatHandlers;
