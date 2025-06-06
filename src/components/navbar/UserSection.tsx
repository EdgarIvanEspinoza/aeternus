import {
  Avatar,
  Button,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from '@heroui/react';
import { checkUserIsAdmin } from '@utils/main.utils';

export const UserSection = ({
  user,
  adminMode,
  setAdminMode,
}: {
  user: any;
  adminMode: boolean;
  setAdminMode: (adminMode: boolean) => void;
}) => {
  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <Dropdown>
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            color="success"
            src={user.picture || 'https://www.gravatar.com/avatar?d=mp'}
            alt={user.name}
            size="sm"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Action" onAction={(key) => key === 'adminMode' && setAdminMode(!adminMode)}>
          <DropdownItem key="profile" className="h-14 gap-2 font-bold">
            {user.email}
          </DropdownItem>
          {checkUserIsAdmin(user.email) ? (
            <DropdownItem key="adminMode" color={adminMode ? 'success' : 'danger'} isReadOnly>
              {adminMode ? 'Admin mode ON' : 'Admin mode OFF'}
            </DropdownItem>
          ) : null}
          <DropdownItem key="settings" isReadOnly>
            My Settings
          </DropdownItem>
          <DropdownItem key="team_settings" isReadOnly>
            Team Settings
          </DropdownItem>
          <DropdownItem key="analytics" isReadOnly>
            Analytics
          </DropdownItem>
          <DropdownItem key="configurations" isReadOnly>
            Configurations
          </DropdownItem>
          <DropdownItem key="terms_and_conditios" href="/policies">
            Terms & Conditions
          </DropdownItem>
          <DropdownItem key="logout" color="danger" href="/api/auth/logout">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
