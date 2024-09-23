import { Stack, Title, Text } from "@mantine/core"
import { useParams } from "react-router-dom";
import CardForm from "../Components/CardForm";

const AddCardPage = () => {
    const { id } = useParams();

    return (
        <Stack>
            <Title>Add a new card</Title>
            {id ? (<CardForm id={Number(id)} />) : (<Text c="red">Deck is missing or invalid.</Text>)}
        </Stack>
    )
}

export default AddCardPage