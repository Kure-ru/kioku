import { Button, Container, Divider, Flex, Text } from "@mantine/core"

const CardPage = () => {

    return (
        <Container>
            <Text>Question</Text>
            <Divider my="lg" />
            <Text>Answer</Text>
            <Button>show answer</Button>
            <Flex mih={50}
                gap="md"
                justify="center"
                align="flex-start"
                direction="row"
                wrap="wrap">
                <Button>again</Button>
                <Button>hard</Button>
                <Button>good</Button>
                <Button>very good</Button>
            </Flex>
        </Container>
    )
}

export default CardPage