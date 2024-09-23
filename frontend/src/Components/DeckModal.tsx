import { Group, TextInput, ActionIcon, Modal, Button } from "@mantine/core";
import { useState, ChangeEvent, useEffect } from "react";
import { IoAdd } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { Deck } from "../Types";

interface DeckModalProps {
    opened: boolean;
    close: () => void;
    deck?: Deck;
}

const DeckModal: React.FC<DeckModalProps> = ({ opened, close, deck }) => {
    const [deckName, setDeckName] = useState<string>(deck?.name || '');
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setDeckName(deck?.name || '');
        setError('');
    }, [deck, opened]);

    const handleSaveDeck = async () => {
        if (!deckName.trim()) {
            setError("Deck name is required.")
        }
        else {
            try {
                const token = localStorage.getItem('accessToken');
                const method = deck ? 'PUT' : 'POST';
                const url = deck ? `http://127.0.0.1:8000/decks/${deck.id}/` : 'http://127.0.0.1:8000/decks/';
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: deckName })
                });

                if (!response.ok) {
                    throw new Error(deck ? 'Failed to update deck.' : 'Failed to create new deck.');
                }
                if (!deck) {
                    const newDeck = await response.json();
                    navigate(`/deck/${newDeck.id}`);
                }
                else {
                    navigate(0);
                }
            } catch (error) {
                console.error('Error when saving the deck', error);
                setError(deck ? 'Failed to update deck, please try again.' : 'Failed to create deck, please try again.');
            }
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDeckName(e.target.value)
        setError('');
    }

    const handleDelete = async () => {
        if (!deck) {
            return;
        }
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://127.0.0.1:8000/decks/${deck.id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Could not delete deck.');
            }
            close();
            if (location.pathname === '/') {
                navigate(0)
            }
            navigate('/');
        } catch (error) {
            console.error('Error deleting deck:', error);
        }
    }

    return (
        <Modal title={deck ? "Deck settings" : "Add a new deck"} opened={opened} withCloseButton onClose={close}>
            <Group>
                <TextInput value={deckName} style={{ width: '75%' }} placeholder={deck?.name || "Deck name"} onChange={(e) => handleChange(e)} error={error ? error : null}
                />
                <ActionIcon onClick={handleSaveDeck} variant="filled" aria-label="Submit deck name"><IoAdd /></ActionIcon>
            </Group>
            {deck && (
                <Button onClick={handleDelete} color="red">Delete deck</Button>
            )
            }
        </Modal>
    )
}

export default DeckModal;