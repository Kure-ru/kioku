import { Button, Container, Flex, Paper } from "@mantine/core"

const DeckPage = () => {
    return (
        <Container>
            <Paper shadow="xs" withBorder p="xl">
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