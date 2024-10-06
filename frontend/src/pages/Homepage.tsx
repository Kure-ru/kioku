import { Container, Title, Text, Flex, Button, Card, useMantineTheme } from "@mantine/core"
import { useEffect, useState } from "react";
import { Deck } from "../Types";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import DeckDialog from "../Components/DeckModal";
import DeckList from "../Components/DeckList";
import CsvUpload from "../Components/CsvUpload";

export const Homepage = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [opened, { toggle, close }] = useDisclosure(false);
    const [showUploader, setShowUploader] = useState<boolean>(false);
    const navigate = useNavigate();
    const theme = useMantineTheme();

    useEffect(() => {
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
        fetchDecks();
    }, [navigate]);

    return (
        <Container>
            <Title order={2}>start studying</Title>
            <DeckDialog opened={opened} close={close} />
            <Card my={32}
                radius="md" style={{
                    borderColor: theme.colors.indigo[1],
                    background: 'none',
                    color: theme.colors.indigo[9],
                    justifyContent: "space-between",
                    minHeight: '50vh',
                }} >
                <Text style={{ fontWeight: 700 }} pb={16}>Decks</Text>
                <DeckList decks={decks} />
                <Flex pt={24} gap={16} justify="flex-end">
                    <Button onClick={toggle}>new deck</Button>
                    <Button onClick={() => setShowUploader(prev => !prev)}>
                        {showUploader
                            ? "close"
                            : "CSV file"
                        }</Button>
                </Flex>
            </Card>
            {showUploader && <CsvUpload />}
        </Container >
    )
}