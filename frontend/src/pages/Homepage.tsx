import { Container, Title, List, Anchor, Flex, Button, Dialog, Group, TextInput, ActionIcon } from "@mantine/core"
import { useEffect, useState } from "react";
import { Deck } from "../Types";
import { useDisclosure } from "@mantine/hooks";
import { IoAdd } from "react-icons/io5";

interface DeckListProps {
    decks: Deck[];
}

interface DeckDialogProps {
    opened: boolean;
    close: () => void;
}

export const Homepage = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [opened, { toggle, close }] = useDisclosure(false);

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/decks/');
                const data = await response.json();
                setDecks(data);
            } catch (error) {
                console.error('Error when fetching the decks', error)
            }
        }
        fetchDecks();
    }, []);

    return (
        <Container>
            <Flex gap={16}>
                <Title order={2}>decks</Title>
                <Button onClick={toggle}>new</Button>
            </Flex>
            <DeckDialog opened={opened} close={close} />
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

const DeckDialog: React.FC<DeckDialogProps> = ({ opened, close }) => {
    const [deckName, setDeckName] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleAddDeck = () => {
        if (!deckName.trim()) {
            setError("Deck name is required.")
        }
        else {
            console.log("New deck", deckName)
            setDeckName("")
            setError("")
            close()
        }
    }

    return (
        <Dialog position={{ top: 60, right: 250 }} opened={opened} withCloseButton onClose={close}>
            <Group>
                <TextInput style={{ width: '75%' }} placeholder="new deck name" onChange={(e) => setDeckName(e.target.value)} error={error ? error : null} />
                <ActionIcon onClick={handleAddDeck} variant="filled" aria-label="Add deck"><IoAdd /></ActionIcon>
            </Group>
        </Dialog>
    )
}