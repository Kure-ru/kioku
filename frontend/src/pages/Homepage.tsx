import { Container, Title, List, Anchor, Flex, Button, Dialog, Group, TextInput, ActionIcon } from "@mantine/core"
import { ChangeEvent, useEffect, useState } from "react";
import { Deck } from "../Types";
import { useDisclosure } from "@mantine/hooks";
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface DeckListProps {
    decks: Deck[];
}

interface DeckDialogProps {
    opened: boolean;
    close: () => void;
    onDeckAdded: (deck: Deck) => void;
}



export const Homepage = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [opened, { toggle, close }] = useDisclosure(false);
    const navigate = useNavigate();

    const fetchDecks = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch('http://127.0.0.1:8000/decks/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (response.status === 401) {
                navigate('/login')
                return;
            }
            const data = await response.json();
            setDecks(data);
        } catch (error) {
            console.error('Error when fetching the decks', error)
        }
    }

    useEffect(() => {
        fetchDecks();
    }, []);

    const handleDeckAdded = (newDeck: Deck) => {
        setDecks((prevDecks) => [...prevDecks, newDeck]);
    }

    return (
        <Container>
            <Flex gap={16}>
                <Title order={2}>decks</Title>
                <Button onClick={toggle}>new</Button>
            </Flex>
            <DeckDialog opened={opened} close={close} onDeckAdded={handleDeckAdded} />
            <DeckList decks={decks} />
        </Container >
    )
}

const DeckList: React.FC<DeckListProps> = ({ decks }) => (
    <List withPadding>
        {decks.map(deck => (
            <List.Item py={8} key={deck.id}>
                <Anchor href={`/decks/${deck.id}`}>{deck.name}</Anchor>
            </List.Item>
        ))}
    </List>
)

const DeckDialog: React.FC<DeckDialogProps> = ({ opened, close, onDeckAdded }) => {
    const [deckName, setDeckName] = useState<string>("");
    const [error, setError] = useState<string>("");

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
                onDeckAdded(newDeck);
                setDeckName("")
                setError("")
                close()
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