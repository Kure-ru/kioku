import { Button, Container, Flex, Paper, Title } from "@mantine/core"
import { Deck } from "../Types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeckPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    console.log(id)

    const [deck, setDeck] = useState<Deck>();

    useEffect(() => {

        const fetchDeck = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const response = await fetch(`http://127.0.0.1:8000/decks/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                })
                if (response.status === 401) {
                    navigate('/login')
                    return;
                }
                const data = await response.json();
                setDeck(data);
            } catch (error) {
                console.error('Error when fetching the decks', error)
            }
        }
        fetchDeck();
    }, [id, navigate]);

    if (!deck) return <div>Deck not found</div>

    return (
        <Container>
            <Paper m={32} shadow="xs" withBorder p="xl">
                <Title order={3} >{deck.name}</Title>
                Deck information
            </Paper>
            <Flex mih={50}
                gap="md"
                justify="center"
                align="flex-start"
                direction="row"
                wrap="wrap">
                <Button>add new card</Button>
                <Button component="a" href="/cards">study</Button>
            </Flex>
        </Container>
    )
}

export default DeckPage

