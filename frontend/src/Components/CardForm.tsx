import { TextInput, Group, Button, Text, Notification } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useState } from "react";

interface formValues {
    question: string;
    answer: string;
}

const CardForm = ({ id }: { id: number }) => {
    const [error, setError] = useState<string>('');
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [submittedValues, setSubmittedValues] = useState<formValues | null>(null);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            question: '',
            answer: '',
        },
        validate: {
            question: (value) => value.length < 2
                ? 'Question field must have at least 2 letters.'
                : null,
            answer: (value) => value.length < 1
                ? 'Please add an answer.'
                : null,
        }
    });

    const handleSubmit = async (values: formValues) => {
        try {
            const token = localStorage.getItem('accessToken');
            const payload = { ...values, deck: id };
            const response = await fetch(`http://127.0.0.1:8000/cards/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                setError('Could not add card.')
                throw new Error('Could not add card.');
            }

            const data = await response.json();
            setSubmittedValues(data)
            form.reset();
            setShowNotification(true);

            setTimeout(() => {
                setShowNotification(false)
            }, 1000);

        } catch (error) {
            console.error('Error', error)
            setError('Could not add card. Try again later.')
        }
    }
    return (
        <>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <TextInput
                    withAsterisk
                    label="Question"
                    key={form.key('question')}
                    {...form.getInputProps('question')}
                />

                <TextInput
                    withAsterisk
                    label="Answer"
                    key={form.key('answer')}
                    {...form.getInputProps('answer')}
                />
                <Group justify="flex-end" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
                {error && <Text c="red">{error}</Text>}
            </form>
            {showNotification &&
                <Notification loading onClose={() => setShowNotification(false)} title="Card successfully added">
                    {submittedValues?.question}
                </Notification>
            }
        </>

    )
}

export default CardForm