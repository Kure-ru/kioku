import { Group, Title, Text, Button, TextInput, Stack, PasswordInput } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface formValues {
    username: string;
    password: string;
}

const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: '',
            password: '',
        },
    });

    const handleSubmit = async (values: formValues) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                setError('Login failed.')
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            navigate('/');
        } catch (error) {
            console.error('Error', error)
            setError('Login failed, Please check your credentials.')
        }
    }

    return (
        <Stack>
            <Title>Sign in</Title>
            <Text>Start learning now</Text>

            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <TextInput
                    withAsterisk
                    label="Username"
                    key={form.key('username')}
                    {...form.getInputProps('username')}
                />

                <PasswordInput
                    label="Password"
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                />
                <Group justify="flex-end" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
                {error && <Text c="red">{error}</Text>}
            </form>
            <Text>Don't have an account? <Link to={'/signup'}>Signup</Link></Text>
        </Stack>
    )
}

export default LoginPage