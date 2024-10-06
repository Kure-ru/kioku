import { AppShell, Image, UnstyledButton, Container, Group, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import classes from './AppLayout.module.css';
import logo from '../assets/logo.jpg';


const links = [
    { link: '/', label: 'decks' },
    { link: 'browse', label: 'browse' },
    { link: 'stats', label: 'stats' },
];

const authLinks = [
    { link: '/login', label: 'Login' },
    { link: '/signup', label: 'Sign up' },
]

const Layout = () => {
    const [opened, { toggle }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);
    const navigate = useNavigate();

    const isAuthenticated = !!localStorage.getItem('accessToken');

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    const items = isAuthenticated
        ? links.map((link) => (
            <Link
                key={link.label}
                to={link.link}
                className={classes.link}
                data-active={active === link.link || undefined}
                onClick={() => setActive(link.link)}
            >
                {link.label}
            </Link>
        ))
        : authLinks.map((link) => (
            <Link
                key={link.label}
                to={link.link}
                className={classes.link}
                data-active={active === link.link || undefined}
                onClick={() => setActive(link.link)}
            >
                {link.label}
            </Link>
        ));

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md"
        >
            <AppShell.Header className={classes.header}>
                <Container className={classes.inner}>
                    <Image src={logo} style={{ width: '100px' }} />
                    <Group gap={5} visibleFrom="xs">
                        {items}
                        {isAuthenticated && <UnstyledButton className={classes.link} onClick={handleLogout}>logout</UnstyledButton>}
                    </Group>
                    <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
                </Container>
            </AppShell.Header>
            <AppShell.Main className={classes.main}>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
};

export default Layout;
