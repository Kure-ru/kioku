import { Container, Title, List, Anchor, Flex, Button } from "@mantine/core"
import { useEffect, useState } from "react";
import { Deck } from "../Types";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import DeckDialog from "../Components/DeckDialog";

interface DeckListProps {
    decks: Deck[];
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <Anchor href={`/deck/${deck.id}`}>{deck.name}</Anchor>
            </List.Item>
        ))}
    </List>
)