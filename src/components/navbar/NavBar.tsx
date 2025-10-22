import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Avatar,
  Link as HeroUILink,
  Switch,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Button,
} from '@heroui/react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { AeternusTitle } from './Title';
import NextLink from 'next/link';
import { checkUserIsAdmin } from '@utils/main.utils';
import { ResetConversationButton } from './DeleteConversationButton';
import { CloseSessionButton } from './CloseSessionButton';
import { MenuIcon, MessageSquarePlus, MessageCircle, LayoutDashboard } from 'lucide-react';

type Props = {
  adminMode: boolean;
  jacquesMode: boolean;
  setAdminMode: (adminMode: boolean) => void;
  setJacquesMode: (jacquesMode: boolean) => void;
};

const NavbarComponent = ({ adminMode, jacquesMode, setAdminMode, setJacquesMode }: Props) => {
  const { user } = useUser();
  const [isChat, setIsChat] = React.useState(false);
  
  React.useEffect(() => {
    setIsChat(window.location.pathname.startsWith('/chat'));
  }, []);

  const handleJacquesMode = () => {
    localStorage.setItem('jacquesMode', JSON.stringify(!jacquesMode));
    setJacquesMode(!jacquesMode);
  };

  const handleAdminMode = () => {
    localStorage.setItem('adminMode', JSON.stringify(!adminMode));
    setAdminMode(!adminMode);
  };

  return (
  <Navbar isBordered className="px-6 py-3 shadow-md backdrop-blur-sm bg-black/80 border-b border-zinc-800/60 fixed top-0 left-0 right-0 z-30">
      <NavbarBrand>
        <NextLink href="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-sm">
          <AeternusTitle>Aeternus</AeternusTitle>
        </NextLink>
      </NavbarBrand>
      <NavbarContent justify="end">
        {/* Botones de navegación contextual */}
        {!isChat && (
          <Button
            color="secondary"
            variant="flat"
            aria-label="Ir al chat"
            className="mr-2"
            as={NextLink}
            href="/chat"
            startContent={<MessageCircle size={18} />}
          >
            <span className="hidden sm:inline">Ir al Chat</span>
            <span className="sm:hidden">Chat</span>
          </Button>
        )}
        
        {isChat && checkUserIsAdmin(user?.email || '') && (
          <Button
            color="secondary"
            variant="flat"
            aria-label="Admin Dashboard"
            className="mr-2"
            as={NextLink}
            href="/admin"
            startContent={<LayoutDashboard size={18} />}
          >
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Admin</span>
          </Button>
        )}
        
        {/* Botón de Feedback */}
        <Button
          isIconOnly
          color="primary"
          variant="flat"
          aria-label="Enviar feedback"
          className="mr-2"
          onPress={() => window.dispatchEvent(new CustomEvent('toggle-feedback'))}
        >
          <MessageSquarePlus size={20} />
        </Button>
        
        <Dropdown
          showArrow
          classNames={{
            base: 'before:bg-default-200',
            content: 'p-0 border-small border-divider bg-background',
          }}
          radius="sm"
          closeOnSelect={false}>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="flex items-center gap-2 min-w-0 px-3"
              startContent={<MenuIcon size={20} />}
            >
              <Avatar
                isBordered
                color="success"
                src={user?.picture || 'https://www.gravatar.com/avatar?d=mp'}
                alt="user-avatar"
                size="sm"
                className="ml-2"
              />
              <span className="hidden sm:inline text-sm">Menú</span>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Menu" className="p-3">
            <DropdownSection showDivider aria-label="Profile & Actions">
              <DropdownItem key="profile" isReadOnly className="h-14 gap-2 opacity-100">
                <p className="font-semibold text-white-100">{user?.name}</p>
                <p className="text-xs">{user?.email}</p>
              </DropdownItem>
            </DropdownSection>
            {checkUserIsAdmin(user?.email || '') ? (
              <DropdownSection aria-label="Admin Mode" showDivider>
                <DropdownItem key="dashboard">
                  <NextLink href="/admin" className="text-current">
                    Admin Dashboard
                  </NextLink>
                </DropdownItem>
                <DropdownItem key="invitations">
                  <NextLink href="/admin/invitations" className="text-current">
                    Gestionar Invitaciones
                  </NextLink>
                </DropdownItem>
                <DropdownItem key="feedbacks">
                  <NextLink href="/admin/feedbacks" className="text-current">
                    Feedback de Usuarios
                  </NextLink>
                </DropdownItem>
                <DropdownItem
                  key="admin_mode"
                  closeOnSelect={false}
                  endContent={<Switch isSelected={adminMode} color="success" onValueChange={handleAdminMode} />}>
                  Admin mode
                </DropdownItem>
                <DropdownItem
                  key="jacques_mode"
                  closeOnSelect={false}
                  endContent={<Switch isSelected={jacquesMode} color="success" onValueChange={handleJacquesMode} />}>
                  Jacques mode
                </DropdownItem>
                <DropdownItem key={'reset_conversation'} className="flex items-center gap-2">
                  <ResetConversationButton />
                </DropdownItem>
                <DropdownItem key={'close_session'} className="flex items-center gap-2">
                  <CloseSessionButton />
                </DropdownItem>
              </DropdownSection>
            ) : null}
            <DropdownSection aria-label="Help & Feedback">
              <DropdownItem 
                key="show_onboarding" 
                onPress={() => window.dispatchEvent(new CustomEvent('show-onboarding'))}
              >
                Ver guía de inicio
              </DropdownItem>
              <DropdownItem key="terms_and_conditions" href="/policies">
                <HeroUILink href="/policies">Terms & Condition</HeroUILink>
              </DropdownItem>
              <DropdownItem key="logout">
                <HeroUILink href="/api/auth/logout" color="danger">
                  Log Out
                </HeroUILink>
              </DropdownItem>
              <DropdownItem key="back_home">
                <HeroUILink href="/" color='danger'>Exit</HeroUILink>
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarComponent;
