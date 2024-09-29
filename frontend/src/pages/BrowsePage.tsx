import { Center, Grid, Group, Pagination, Table, Text, UnstyledButton } from "@mantine/core"
import { useEffect, useState } from "react";
import { Card, Deck } from "../Types";
import { useNavigate } from "react-router-dom";
import CardForm from "../Components/CardForm";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { TbSelector } from "react-icons/tb";

const BrowsePage = () => {
    const rowsPerPage = 10;
    const [cards, setCards] = useState<Card[]>([]);
    const [decks, setDecks] = useState<Deck[]>([]);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortBy, setSortBy] = useState<keyof Card | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState<boolean>(false);
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

    const getDeckNameById = (deckId: number): string => {
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

    const sortCards = (data: Card[], sortBy: keyof Card | null, reversed: boolean): Card[] => {
        if (!sortBy) return data;

        const sortedData = [...data].sort((a, b) => {
            const valueA = a[sortBy];
            const valueB = b[sortBy];

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return reversed ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
            }
            return reversed
                ? (valueB as number) - (valueA as number)
                : (valueA as number) - (valueB as number);
        });

        return sortedData;
    };


    const setSorting = (field: keyof Card) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
    }

    const sortedCards = sortCards(cards, sortBy, reverseSortDirection);
    const paginatedCards = sortedCards?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const rows = paginatedCards?.map((card) => (
        <Table.Tr key={card.id} onClick={() => handleRowClick(card)} style={{ cursor: "pointer" }}>
            <Table.Td>{card.question}</Table.Td>
            <Table.Td>{getDeckNameById(card.deck)}</Table.Td>
            <Table.Td>{formatDate(card.creation_date)}</Table.Td>
        </Table.Tr>
    ));

    const totalPages = Math.ceil((cards?.length || 0) / rowsPerPage);

    if (rows.length < 1) {
        return (
            <Text>Nothing found</Text>
        )
    }

    return (
        <Grid>
            <Grid.Col span={7}>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Th sorted={sortBy === 'question'} reversed={reverseSortDirection} onSort={() => setSorting('question')}>
                                Question
                            </Th>
                            <Th sorted={sortBy === 'deck'} reversed={reverseSortDirection} onSort={() => setSorting('deck')}>
                                Deck
                            </Th>
                            <Th sorted={sortBy === 'creation_date'} reversed={reverseSortDirection} onSort={() => setSorting('creation_date')}>
                                Created
                            </Th>
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

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
}


const Th = ({ children, reversed, sorted, onSort }: ThProps) => {
    const Icon = sorted ? (reversed ? IoChevronUp : IoChevronDown) : TbSelector;
    return (
        <Table.Th>
            <UnstyledButton onClick={onSort}>
                <Group justify="space-between" wrap="nowrap">
                    <Text fw={500} fz="sm">
                        {children}
                    </Text>
                    <Center>
                        <Icon style={{ width: 16, height: 16 }} />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    )
}


export default BrowsePage