import { Group, Title, Text, Button, TextInput, Stack, PasswordInput } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlassPaper from "../Components/GlassPaper";

interface formValues {
    username: string;
    password: string;
}

const SignupPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => {
                if (value.length < 8) {
                    return 'Password must be at least 8 characters long';
                }
                if (!/[A-Z]/.test(value)) {
                    return 'Password must contain at least one uppercase letter';
                }
                if (!/[a-z]/.test(value)) {
                    return 'Password must contain at least one lowercase letter';
                }
                if (!/[0-9]/.test(value)) {
                    return 'Password must contain at least one number';
                }
                if (!/[!@#$%^&*]/.test(value)) {
                    return 'Password must contain at least one special character';
                }
                return null;
            },
            confirmPassword: (value, values) => value !== values.password ? 'Passwords did not match' : null,
        }
    });

    const handleSubmit = async (values: formValues) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                setError('Signup failed.')
                throw new Error('Signup failed');
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            navigate('/');
        } catch (error) {
            console.error('Error', error)
            setError('Signup failed, Please check your credentials.')
        }
    }

    return (
        <GlassPaper>
            <Stack>
                <Title>Signup</Title>
                <Text>Start learning now</Text>

                <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                    <TextInput
                        withAsterisk
                        label="Username"
                        key={form.key('username')}
                        {...form.getInputProps('username')}
                    />
                    <TextInput
                        withAsterisk
                        label="Email"
                        key={form.key('email')}
                        {...form.getInputProps('email')}
                    />

                    <PasswordInput
                        label="Password"
                        key={form.key('password')}
                        {...form.getInputProps('password')}
                    />

                    <PasswordInput
                        label="Confirm password"
                        key={form.key('confirmPassword')}
                        {...form.getInputProps('confirmPassword')}
                    />
                    <Group justify="flex-end" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                    {error && <Text c="red">{error}</Text>}
                </form>
                <Text>Already have an account? <Link to={'/login'}>Login</Link></Text>
            </Stack>
        </GlassPaper>
    )
}

export default SignupPage;