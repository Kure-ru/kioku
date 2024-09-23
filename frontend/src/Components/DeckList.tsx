import { List, Anchor, ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { Deck } from "../Types";
import DeckModal from "./DeckModal";

interface DeckListProps {
    decks: Deck[];
}

const DeckList: React.FC<DeckListProps> = ({ decks }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [hoveredDeck, setHoveredDeck] = useState<Deck | undefined>();

    return (
        <List withPadding spacing="md">
            {decks.map(deck => (
                <List.Item
                    onMouseEnter={() => setHoveredDeck(deck)}
                    py={8}
                    key={deck.id} >
                    <Anchor href={`/deck/${deck.id}`}>{deck.name}</Anchor>
                    {hoveredDeck?.id === deck.id && (<>
                        <ActionIcon
                            onClick={open}
                            variant="filled"
                            aria-label="Deck settings"
                        >
                            <IoSettingsSharp />
                        </ActionIcon>
                        <DeckModal opened={opened} close={close} deck={hoveredDeck} /></>
                    )}
                </List.Item>
            ))}
        </List>
    )
}

export default DeckList;