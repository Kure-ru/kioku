import { Group, Title, Text, Button, TextInput, Stack, PasswordInput } from "@mantine/core"
import { useForm } from "@mantine/form";

const LoginPage = () => {

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: '',
            password: '',
        },
    });

    const handleSubmit = async (values) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log('login successful', data)
        } catch (error) {
            console.error('Error', error);
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
                    placeholder="*******"
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                />
                <Group justify="flex-end" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </Stack>
    )
}

export default LoginPage