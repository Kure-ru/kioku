import { Dialog, Group, TextInput, ActionIcon } from "@mantine/core";
import { useState, ChangeEvent } from "react";
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface DeckDialogProps {
    opened: boolean;
    close: () => void;
}

const DeckDialog: React.FC<DeckDialogProps> = ({ opened, close }) => {
    const [deckName, setDeckName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleAddDeck = async () => {
        if (!deckName.trim()) {
            setError("Deck name is required.")
        }
        else {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch('http://127.0.0.1:8000/decks/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: deckName })
                });

                if (!response.ok) {
                    setError("Deck name is required.")
                    throw new Error('Failed to create new deck.');
                }
                const newDeck = await response.json();
                navigate(`/deck/${newDeck.id}`);
            } catch (error) {
                console.error('Error when creating the deck', error);
                setError('Failed to create deck, please try again.');
            }
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDeckName(e.target.value)
        setError('');
    }

    return (
        <Dialog position={{ top: 60, right: 250 }} opened={opened} withCloseButton onClose={close}>
            <Group>
                <TextInput style={{ width: '75%' }} placeholder="new deck name" onChange={(e) => handleChange(e)} error={error ? error : null}
                />
                <ActionIcon onClick={handleAddDeck} variant="filled" aria-label="Add deck"><IoAdd /></ActionIcon>
            </Group>
        </Dialog>
    )
}

export default DeckDialog;