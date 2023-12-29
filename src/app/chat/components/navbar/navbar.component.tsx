import { Navbar, Switch, useTheme, Text, Container } from '@nextui-org/react';
import { useTheme as useNextTheme } from 'next-themes';
import { MoonIcon } from '@/app/resources/icons/moon-icon';
import { SunIcon } from '@/app/resources/icons/sun-icon';

const NavbarComponent = () => {
    const { setTheme } = useNextTheme();
    const { isDark } = useTheme();

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
