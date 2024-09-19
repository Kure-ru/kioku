import { Container, Title, List, Anchor } from "@mantine/core"
import { useEffect, useState } from "react";
import { Deck } from "../Types";

export const Homepage = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    useEffect(() => {
        fetch('http://127.0.0.1:8000/decks/')
            .then(response => response.json())
            .then(data => setDecks(data))
            .catch(error => console.error('Error when fetching the decks', error))
    }, []);

    return (
        <Container>
            <Title order={2}>decks</Title>
            <List withPadding>
                {decks && decks.map(deck => (
                    <List.Item py={8} key={deck.id}>
                        <Anchor href={`/decks/${deck.id}`}>{deck.name}</Anchor>
                    </List.Item>
                ))}
            </List>
        </Container >
    )
}