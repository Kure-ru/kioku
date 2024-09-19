import { Container, Title, Flex, Anchor } from "@mantine/core"
import { useEffect, useState } from "react";


type Deck = {
    name: string
}

export const Homepage = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    useEffect(() => {
        fetch('http://127.0.0.1:8000/decks/')
            .then(response => response.json())
            .then(data => setDecks(data))
            .catch(error => console.error('Error when fetching the decks', error))
    }, []);

    console.log(decks)
    return (
        <Container>
            <Title order={2}>decks</Title>
            <Flex
                p={25}
                mih={50}
                gap="md"
                justify="flex-start"
                align="flex-start"
                direction="column"
                wrap="wrap"
            >
                {decks && decks.map(deck => (
                    <Anchor>{deck.name}</Anchor>
                ))}

            </Flex>
        </Container>
    )
}