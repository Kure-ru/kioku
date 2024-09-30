import { SimpleGrid, UnstyledButton } from "@mantine/core";
import { Deck } from "../Types";
import { useNavigate } from "react-router-dom";
import classes from './DeckList.module.css';

interface DeckListProps {
    decks: Deck[];
}

const DeckList: React.FC<DeckListProps> = ({ decks }) => {
    const navigate = useNavigate();

    return (
        <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 5 }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}>
            {decks.map(deck => (
                <UnstyledButton
                    className={classes.item}
                    key={deck.id}
                    onClick={() => navigate(`/deck/${deck.id}`)}>
                    {deck.name}
                </UnstyledButton>
            ))}
        </SimpleGrid>
    )
}

export default DeckList;