import { Button, Container, Divider, Flex, Paper, Text } from "@mantine/core"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Card {
    answer: number;
    creation_date: Date;
    deck: number;
    id: number;
    question: string;
    reviewed_date: Date | null;
    score: number;
}

const CardPage = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
    const navigate = useNavigate();
    const { id } = useParams();

    const nextCard = () => setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);

    const fetchCards = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://127.0.0.1:8000/api/decks/${id}/cards/`, {
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
            setCards(data);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    }

    useEffect(() => {
        fetchCards();
    }, [])


    if (cards.length > 0) {
        return (
            <Container>
                <Text>{cards[currentCardIndex].question}</Text>
                <Divider my="lg" />
                <Text>{cards[currentCardIndex].answer}</Text>
                <Button>show answer</Button>
                <Flex mih={50}
                    gap="md"
                    justify="center"
                    align="flex-start"
                    direction="row"
                    wrap="wrap">
                    <Button onClick={nextCard}>again</Button>
                    <Button onClick={nextCard}>hard</Button>
                    <Button onClick={nextCard}>good</Button>
                    <Button onClick={nextCard}>very good</Button>
                </Flex>
            </Container>
        )
    } else {
        return (
            <Paper>
                <Text>No cards available.</Text>
            </Paper>
        )
    }
}

export default CardPage