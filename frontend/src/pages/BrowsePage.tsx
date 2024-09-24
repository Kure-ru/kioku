import { Grid, Pagination, Table } from "@mantine/core"
import { useEffect, useState } from "react";
import { Card, Deck } from "../Types";
import { useNavigate } from "react-router-dom";
import CardForm from "../Components/CardForm";

const BrowsePage = () => {
    const rowsPerPage = 10;
    const [cards, setCards] = useState<Card[]>([]);
    const [decks, setDecks] = useState<Deck[]>([]);
    const [selectedCard, setSelectedCard] = useState<Card>();
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                navigate('/login');
                return;
            }

            const [cardsData, decksData] = await Promise.all([fetchCards(token), fetchDecks(token)]);
            setCards(cardsData);
            setDecks(decksData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchCards = async (token: string): Promise<Card[]> => {
        const response = await fetch(`http://127.0.0.1:8000/cards/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        if (response.status === 401) navigate("/login");

        return await response.json();
    }

    const fetchDecks = async (token: string): Promise<Deck[]> => {
        const response = await fetch(`http://127.0.0.1:8000/decks/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        if (response.status === 401) navigate("/login");
        return await response.json();
    }

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: 'numeric',
            minute: 'numeric',
        }).format(date);
    };

    const deckDeckNameById = (deckId: number): string => {
        const deck = decks?.find((deck) => deck.id === deckId);
        return deck ? deck.name : "Unknown deck";
    }

    const handleRowClick = (card: Card) => setSelectedCard(card);

    const handleUpdateCard = (updatedCard: Card) => {
        setCards((prevCards) =>
            prevCards?.map((card) =>
                card.id === updatedCard.id ? updatedCard : card
            )
        );
        setSelectedCard(updatedCard);
    };

    const paginatedCards = cards?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const rows = paginatedCards?.map((card) => (
        <Table.Tr key={card.id} onClick={() => handleRowClick(card)} style={{ cursor: "pointer" }}>
            <Table.Td>{card.question}</Table.Td>
            <Table.Td>{deckDeckNameById(card.deck)}</Table.Td>
            <Table.Td>{formatDate(card.creation_date)}</Table.Td>
        </Table.Tr>
    ));

    const totalPages = Math.ceil((cards?.length || 0) / rowsPerPage);


    return (
        <Grid>
            <Grid.Col span={7}>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Question</Table.Th>
                            <Table.Th>Deck</Table.Th>
                            <Table.Th>Created</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
                <Pagination onChange={setCurrentPage} value={currentPage} total={totalPages} withEdges />
            </Grid.Col>
            <Grid.Col span={5}>
                {selectedCard && <CardForm key={selectedCard.id} id={selectedCard.deck} card={selectedCard} onUpdate={handleUpdateCard} />}
            </Grid.Col>
        </Grid >
    )
}

export default BrowsePage