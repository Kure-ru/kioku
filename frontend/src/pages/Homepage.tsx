import { Container, Title, Flex, Anchor } from "@mantine/core"

export const Homepage = () => (
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
            <Anchor>Deck 1</Anchor>
            <Anchor>Deck 2</Anchor>
            <Anchor>Deck 3</Anchor>
        </Flex>
    </Container>
)