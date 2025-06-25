import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Avatar,
  Link,
  NavbarItem,
  Switch,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { AeternusTitle } from './Title';
import { useState } from 'react';
import { checkUserIsAdmin } from '@utils/main.utils';
import { Delete } from 'lucide-react';
import { ResetConversationButton } from './DeleteConversationButton';

type Props = {
  adminMode: boolean;
  jacquesMode: boolean;
  setAdminMode: (adminMode: boolean) => void;
  setJacquesMode: (jacquesMode: boolean) => void;
};

const NavbarComponent = ({ adminMode, jacquesMode, setAdminMode, setJacquesMode }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  const handleJacquesMode = () => {
    localStorage.setItem('jacquesMode', JSON.stringify(!jacquesMode));
    setJacquesMode(!jacquesMode);
  };

  const handleAdminMode = () => {
    localStorage.setItem('adminMode', JSON.stringify(!adminMode));
    setAdminMode(!adminMode);
  };

  return (
    <Navbar isBordered className="px-6 py-3 shadow-md backdrop-blur-sm bg-opacity-90" onMenuOpenChange={setIsMenuOpen}>
      <NavbarBrand>
        <AeternusTitle>Aeternus</AeternusTitle>
      </NavbarBrand>
      <NavbarContent justify="end">
        <Dropdown
          showArrow
          classNames={{
            base: 'before:bg-default-200',
            content: 'p-0 border-small border-divider bg-background',
          }}
          radius="sm"
          closeOnSelect={false}>
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              color="success"
              src={user?.picture || 'https://www.gravatar.com/avatar?d=mp'}
              alt="user-avatar"
              size="sm"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Menu" className="p-3">
            <DropdownSection showDivider aria-label="Profile & Actions">
              <DropdownItem key="profile" isReadOnly className="h-14 gap-2 opacity-100">
                <p className="font-semibold text-white-100">{user?.name}</p>
                <p className="text-xs">{user?.email}</p>
              </DropdownItem>
              <DropdownItem key="dashboard">Dashboard</DropdownItem>
              <DropdownItem key="settings">Settings</DropdownItem>
            </DropdownSection>
            {checkUserIsAdmin(user?.email || '') ? (
              <DropdownSection aria-label="Admin Mode">
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
              </DropdownSection>
            ) : null}
            <DropdownSection aria-label="Help & Feedback">
              <DropdownItem key="terms_and_conditions" href="/policies">
                <Link href="/policies">Terms & Condition</Link>
              </DropdownItem>
              <DropdownItem key="logout">
                <Link href="/api/auth/logout" color="danger">
                  Log Out
                </Link>
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarComponent;
