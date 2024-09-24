import { TextInput, Group, Button, Text, Notification } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../Types";

interface FormValues {
    question: string;
    answer: string;
}

interface CardFormProps {
    id: number;
    card?: { question: string; answer: string; id: number };
    closeModal?: () => void;
    onUpdate?: (updatedCard: Card) => void;
}

const CardForm = ({ id, card, closeModal, onUpdate }: CardFormProps) => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null);

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

    useEffect(() => {
        if (card) {
            form.setValues({
                question: card.question,
                answer: card.answer,
            });
        }
    }, [card]);

    const handleSubmit = async (values: FormValues) => {
        try {
            const token = localStorage.getItem('accessToken');
            const payload = { ...values, deck: id };
            const method = card ? 'PUT' : 'POST';
            const url = card ? `http://127.0.0.1:8000/cards/${card.id}/` : 'http://127.0.0.1:8000/cards/';
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                setError('Could not save card.')
                throw new Error('Could not save card.');
            }

            const data = await response.json();
            setSubmittedValues(data)
            form.reset();
            setShowNotification(true);
            if (onUpdate) onUpdate(data);
            if (closeModal) closeModal();
            else {
                setTimeout(() => {
                    setShowNotification(false)
                }, 1000);
            }
        } catch (error) {
            console.error('Error', error)
            setError('Could not save card. Try again later.')
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
                    {!closeModal && <Button type="reset" onClick={() => navigate(-1)}>Cancel</Button>}
                </Group>
                {error && <Text c="red">{error}</Text>}
            </form>
            {showNotification &&
                <Notification loading onClose={() => setShowNotification(false)} title="Card successfully saved:">
                    {submittedValues?.question}
                </Notification>
            }
        </>

    )
}

export default CardForm