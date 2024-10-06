import { Stack, Title, Text } from "@mantine/core"
import { useParams } from "react-router-dom";
import CardForm from "../Components/CardForm";
import GlassPaper from "../Components/GlassPaper";

const AddCardPage = () => {
    const { id } = useParams();

    return (
        <GlassPaper>
            <Stack>
                <Title>Add a new card</Title>
                {id ? (<CardForm id={Number(id)} />) : (<Text c="red">Deck is missing or invalid.</Text>)}
            </Stack>
        </GlassPaper>
    )
}

export default AddCardPage