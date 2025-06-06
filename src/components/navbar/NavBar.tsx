import { Navbar, NavbarBrand, NavbarContent, Avatar, Button } from '@heroui/react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { UserSection } from './UserSection';
import { AeternusTitle } from './Title';

type Props = {
  adminMode: boolean;
  setAdminMode: (adminMode: boolean) => void;
};

const NavbarComponent = ({ adminMode, setAdminMode }: Props) => {
  const { user } = useUser();

  return (
    <Navbar isBordered className="px-6 py-3 shadow-md backdrop-blur-sm bg-opacity-90">
      <NavbarBrand>
        <AeternusTitle>Aeternus</AeternusTitle>
      </NavbarBrand>
      <NavbarContent justify="end">
        <UserSection user={user} adminMode={adminMode} setAdminMode={setAdminMode} />
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarComponent;
