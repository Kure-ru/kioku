import { AppShell, Flex, Title, Button } from '@mantine/core';
import { Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md"
        >
            <AppShell.Header>
                <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                    <Title onClick={() => navigate('/')} order={1}>kioku</Title>
                    <Button onClick={handleLogout}>Logout</Button>
                </Flex>
            </AppShell.Header>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
};

export default Layout;
