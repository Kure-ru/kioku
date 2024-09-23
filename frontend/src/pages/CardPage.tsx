import { ActionIcon, Button, Container, Divider, Flex, Modal, Paper, Text, Notification, Title, Stack } from "@mantine/core"
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import { useDisclosure } from "@mantine/hooks";
import CardForm from "../Components/CardForm";
import { Deck } from "../Types";

interface Card {
    answer: string;
    creation_date: Date;
    deck: number;
    id: number;
    question: string;
    reviewed_date: Date | null;
    score: number;
}

const CardPage = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [deck, setDeck] = useState<Deck | null>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
    const [notification, setNotification] = useState<{ message: string; color: string } | null>(null);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const cardResponse = await fetch(`http://127.0.0.1:8000/api/decks/${id}/cards/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (cardResponse.status === 401) {
                    navigate('/login')
                }

                const cardsData = await cardResponse.json();
                setCards(cardsData);

                const deckResponse = await fetch(`http://127.0.0.1:8000/decks/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                const deckData = await deckResponse.json();
                setDeck(deckData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setNotification({ message: 'Error fetching data.', color: 'red' });
            }
        }
        fetchData();
    }, [id, navigate])


    const handleDelete = async () => {
        const token = localStorage.getItem('accessToken');
        const cardToDelete = cards[currentCardIndex];
        try {
            const response = await fetch(`http://127.0.0.1:8000/cards/${cardToDelete.id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Could not delete card.');
            }

            setCards((prevCards) => prevCards.filter((card) => card.id !== cardToDelete.id));
            setCurrentCardIndex((prevIndex) => (prevIndex === prevIndex - 1 ? prevIndex - 1 : prevIndex));
            close();
        } catch (error) {
            console.error('Error deleting card:', error);
            setNotification({ message: 'Error deleting card. Please try again.', color: 'red' });
        }
    }

    const nextCard = () => {
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
        setShowAnswer(false);
    }

    if (deck && cards.length > 0) {
        return (
            <Container>
                <Link style={{ textDecoration: 'none' }} to={`/deck/${deck.id}`}><Title order={3}>{deck.name}</Title></Link>
                <Flex my={40}>
                    <Stack >
                        <Text>{cards[currentCardIndex].question}</Text>
                        <Divider my="lg" label={<Button onClick={() => setShowAnswer(true)}>show answer</Button>}
                        />
                        {showAnswer && <Text>{cards[currentCardIndex].answer}</Text>}
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
                    </Stack>
                    <ActionIcon onClick={open} variant="filled" aria-label="Card settings"><IoSettingsSharp /></ActionIcon>
                    <Modal opened={opened} onClose={close} title="Cards settings">
                        <CardForm id={Number(id)} card={cards[currentCardIndex]} closeModal={close} />
                        <Button onClick={handleDelete} color="red">Delete card</Button>
                    </Modal>
                </Flex>
                {notification &&
                    <Notification
                        mt={64}
                        color={notification.color}
                        onClose={() => setNotification(null)}
                        title="Notification"
                    >
                        {notification.message}
                    </Notification>
                }
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