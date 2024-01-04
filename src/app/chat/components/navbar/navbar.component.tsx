import { Navbar, Switch, useTheme, Text, Avatar } from '@nextui-org/react';
import { useTheme as useNextTheme } from 'next-themes';
import { MoonIcon } from '@/app/resources/icons/moon-icon';
import { SunIcon } from '@/app/resources/icons/sun-icon';
import { useUser } from '@auth0/nextjs-auth0/client';

const NavbarComponent = () => {
  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();
  const { user } = useUser() as any;

  return (
    <Navbar isBordered variant={'floating'}>
      <Navbar.Brand>
        <Text
          h1
          size={50}
          css={{
            textGradient: '45deg, $blue600 -20%, $pink600 50%',
          }}
          weight="bold">
          Aeternus
        </Text>{' '}
      </Navbar.Brand>
      <Navbar.Content>
        <p>{user ? user.name : null}</p>
        {user ? <Avatar color="success" bordered src={user ? user.picture : 'http://www.gravatar.com/avatar'} /> : null}
        <a href="/api/auth/logout">Logout</a>
        <Switch
          checked={isDark}
          size="lg"
          iconOn={<MoonIcon filled size={undefined} height={undefined} width={undefined} label={undefined} />}
          iconOff={<SunIcon filled size={undefined} height={undefined} width={undefined} label={undefined} />}
          aria-label="Toggle dark mode"
          onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
        />
      </Navbar.Content>
    </Navbar>
  );
};

export default NavbarComponent;
