import { Button, Container, Flex, Paper, Title } from "@mantine/core"
import { Deck } from "../Types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DeckPage = () => {

    const { id } = useParams();
    console.log(id)

    const [deck, setDeck] = useState<Deck>();

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/decks/${id}`)
            .then(response => response.json())
            .then(data => setDeck(data))
            .catch(error => console.error('Error when fetching the decks', error))
    }, []);

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

