import { ActionIcon, Button, Flex, Title } from "@mantine/core"
import { Deck } from "../Types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import { useDisclosure } from "@mantine/hooks";
import DeckDialog from "../Components/DeckModal";
import GlassPaper from "../Components/GlassPaper";

const DeckPage = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const [deck, setDeck] = useState<Deck>();

    useEffect(() => {
        const fetchDeck = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const response = await fetch(`http://127.0.0.1:8000/decks/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                })
                if (response.status === 401) {
                    navigate('/login')
                    return;
                }
                const data = await response.json();
                setDeck(data);
            } catch (error) {
                console.error('Error when fetching the decks', error)
            }
        }
        fetchDeck();
    }, [id, navigate]);

    if (!deck) return <div>Deck not found</div>

    return (
        <>
            <GlassPaper>
                <Title order={3} >{deck.name}</Title>
                Deck information
                <Flex mih={50}
                    gap="md"
                    justify="center"
                    align="flex-start"
                    direction="row"
                    wrap="wrap">
                    <Button component="a" href={`/deck/${id}/new`}>add new card</Button>
                    <Button component="a" href={`/deck/${id}/cards`}>study</Button>
                    <ActionIcon variant="filled" aria-label="Deck settings" onClick={open}><IoSettingsSharp /></ActionIcon>
                </Flex>
            </GlassPaper>
            <DeckDialog opened={opened} close={close} deck={deck} />
        </>
    )
}

export default DeckPage

