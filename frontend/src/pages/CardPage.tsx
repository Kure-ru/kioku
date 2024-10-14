import { ActionIcon, Button, Divider, Flex, Modal, Paper, Text, Notification, Title, Stack, useMantineTheme } from "@mantine/core"
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import { useDisclosure } from "@mantine/hooks";
import CardForm from "../Components/CardForm";
import { Card, Deck } from "../Types";
import GlassPaper from "../Components/GlassPaper";

const CardPage = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [deck, setDeck] = useState<Deck | null>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
    const [notification, setNotification] = useState<{ message: string; color: string } | null>(null);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);
    const theme = useMantineTheme();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const [cardsResponse, deckResponse] = await Promise.all([
                    fetch(`http://127.0.0.1:8000/api/decks/${id}/cards/?review=true`, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` },
                    }),
                    fetch(`http://127.0.0.1:8000/decks/${id}`, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` },
                    }),
                ]);

                if (!cardsResponse.ok || !deckResponse.ok) throw new Error('Failed to fetch data.')

                const cardsData = await cardsResponse.json();
                const deckData = await deckResponse.json();

                setCards(cardsData);
                setDeck(deckData);
            } catch (error) {
                console.error('Error fetching data:', error);
                handleError(error as Error);
            }
        }
        fetchData();
    }, [id, navigate])

    const handleError = (error: Error) => {
        console.error(error);
        setNotification({ message: error.message, color: 'red' });
    }

    const handleCardAnswer = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const rating = e.currentTarget.textContent;
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/cards/${cards[currentCardIndex].id}/answer/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ easiness: rating }),
            });

            if (!response.ok) throw new Error('Failed to submit answer.');

            const updatedCard = await response.json();
            console.log(updatedCard);

            setCurrentCardIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;
                if (nextIndex < cards.length) {
                    return nextIndex;
                } else {
                    return cards.length;
                }
            });
            setShowAnswer(false);
        } catch (error) {
            console.error('Error answering the card:', error);
        }
    };

    if (currentCardIndex >= cards.length) {
        return <Text>No more cards available. You've completed this deck!</Text>
    }

    return (
        <>
            <Link style={{ textDecoration: 'none' }} to={`/deck/${deck?.id}`}><Title order={3}>{deck?.name}</Title></Link>
            {cards.length > 0 ? (
                <GlassPaper style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Stack style={{ flexGrow: 1 }}>
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
                            <Button color="red" onClick={handleCardAnswer}>again</Button>
                            <Button color="orange" onClick={handleCardAnswer}>hard</Button>
                            <Button onClick={handleCardAnswer}>good</Button>
                            <Button color="green" onClick={handleCardAnswer}>easy</Button>
                        </Flex>
                    </Stack>
                    <Flex gap={16}>
                        <Text c={theme.colors.indigo[9]} fw={700}>{cards.length} card(s) left</Text>
                        <ActionIcon onClick={open} variant="filled" aria-label="Card settings"><IoSettingsSharp /></ActionIcon>
                    </Flex>
                    <Modal opened={opened} onClose={close} title="Cards settings">
                        <CardForm id={Number(id)} card={cards[currentCardIndex]} closeModal={close} />
                    </Modal>
                </GlassPaper >
            ) : (
                <Paper>
                    <Text>No cards available.</Text>
                    <Button component="a" href={`/deck/${id}/new`}>Add new card</Button>
                </Paper>
            )}
            {
                notification &&
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
}

export default CardPage