import { ActionIcon, Button, Container, Divider, Flex, Modal, Paper, Text, Notification } from "@mantine/core"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import { useDisclosure } from "@mantine/hooks";
import CardForm from "../Components/CardForm";

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
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
    const navigate = useNavigate();
    const { id } = useParams();
    const [opened, { open, close }] = useDisclosure(false);
    const [notification, setNotification] = useState<{ message: string; color: string } | null>(null);

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
            setNotification({ message: 'Error fetching cards.', color: 'red' });
        }
    }

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const cardToDelete = cards[currentCardIndex];

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

    useEffect(() => {
        fetchCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    if (cards.length > 0) {
        return (
            <>
                <Flex>
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
            </>
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