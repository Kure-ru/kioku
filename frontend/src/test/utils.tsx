import { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';

const TestWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <MantineProvider>
            {children}
        </MantineProvider>
    );
};

export default TestWrapper;
