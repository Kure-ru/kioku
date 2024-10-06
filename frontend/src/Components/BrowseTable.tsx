import { Center, Grid, Group, Pagination, rem, ScrollArea, Table, Text, TextInput, UnstyledButton } from "@mantine/core"
import { useEffect, useState } from "react";
import { Card, Deck } from "../Types";
import { useNavigate } from "react-router-dom";
import CardForm from "../Components/CardForm";
import { IoChevronDown, IoChevronUp, IoSearch } from "react-icons/io5";
import { TbSelector } from "react-icons/tb";
import GlassPaper from "../Components/GlassPaper";

const filterCards = (data: Card[], search: string): Card[] => {
    const query = search.toLowerCase().trim();
    return data.filter((card) =>
        (["question", "deck", "answer"] as Array<keyof Card>).some((key) => { // Only valid keys of Card type are accessible
            const field = card[key]; // Dynamically access the key field
            return typeof field === 'string' && field.toLocaleLowerCase().includes(query)
        })
    )
}

const sortCards = (data: Card[], payload: { sortBy: keyof Card | null; reversed: boolean; search: string }): Card[] => {
    const { sortBy, reversed, search } = payload;
    const filteredCards = filterCards(data, search);

    if (!sortBy) return filteredCards;

    return filteredCards.sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return reversed ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
        }

        return reversed
            ? (valueB as number) - (valueA as number)
            : (valueA as number) - (valueB as number);
    })
};

const BrowsePage = () => {
    const rowsPerPage = 10;
    const [cards, setCards] = useState<Card[]>([]);
    const [decks, setDecks] = useState<Deck[]>([]);
    const [search, setSearch] = useState<string>('');
    const [filteredCards, setFilteredCards] = useState<Card[]>([]);
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
            setFilteredCards(cardsData);
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
        const yearMonthDay = date.toISOString().slice(0, 10);
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${yearMonthDay} ${hours}:${minutes}`;
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

    const setSorting = (field: keyof Card) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setFilteredCards(sortCards(filteredCards, { sortBy: field, reversed, search }));
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        setSearch(value);
        if (value.trim() === '') {
            setFilteredCards(cards);
        } else {
            setFilteredCards(sortCards(filteredCards, { sortBy, reversed: reverseSortDirection, search: value }))
        }
    };

    const sortedCards = sortCards(filteredCards, { sortBy, reversed: reverseSortDirection, search });
    const paginatedCards = sortedCards?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const rows = paginatedCards?.map((card) => (
        <Table.Tr key={card.id} onClick={() => handleRowClick(card)} style={{ cursor: "pointer" }}>
            <Table.Td>{card.question}</Table.Td>
            <Table.Td>{getDeckNameById(card.deck)}</Table.Td>
            <Table.Td>{formatDate(card.next_review_date)}</Table.Td>
            <Table.Td>{formatDate(card.creation_date)}</Table.Td>
        </Table.Tr>
    ));

    const totalPages = Math.ceil((cards?.length || 0) / rowsPerPage);

    return (
        <GlassPaper>
            <ScrollArea>
                <TextInput
                    placeholder="Search by any field"
                    mb="md"
                    leftSection={<IoSearch style={{ width: rem(16), height: rem(16) }} />}
                    value={search}
                    onChange={handleSearchChange}
                />
                <Table style={{ backgroundColor: '#fff' }} striped highlightOnHover highlightOnHoverColor='var(--mantine-color-indigo-2)' stripedColor='var(--mantine-color-indigo-1)' withRowBorders={false}>
                    <Table.Thead>
                        <Table.Tr>
                            <Th sorted={sortBy === 'question'} reversed={reverseSortDirection} onSort={() => setSorting('question')}>
                                Question
                            </Th>
                            <Th sorted={sortBy === 'deck'} reversed={reverseSortDirection} onSort={() => setSorting('deck')}>
                                Deck
                            </Th>
                            <Th sorted={sortBy === 'next_review_date'} reversed={reverseSortDirection} onSort={() => setSorting('next_review_date')}>
                                Due
                            </Th>
                            <Th sorted={sortBy === 'creation_date'} reversed={reverseSortDirection} onSort={() => setSorting('creation_date')}>
                                Created
                            </Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody style={{ textOverflow: 'ellipsis' }}>{rows}</Table.Tbody>
                </Table>
                <Pagination pt='8' onChange={setCurrentPage} value={currentPage} total={totalPages} withEdges />
            </ScrollArea>
        </GlassPaper>
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