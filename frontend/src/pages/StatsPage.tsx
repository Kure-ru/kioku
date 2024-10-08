
import { Title, Tooltip } from "@mantine/core";
import HeatMap from "@uiw/react-heat-map";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassPaper from "../Components/GlassPaper";

const StatsPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState();

    useEffect(() => {
        const fetchDecks = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const response = await fetch('http://127.0.0.1:8000/stats/study-days-heatmap/', {
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
                setData(data);
            } catch (error) {
                console.error('Error when fetching the decks', error)
            }
        }
        fetchDecks();
    }, [navigate]);

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    return (
        <GlassPaper style={{ overflow: "scroll" }}>
            <Title order={3}>Studied days</Title>
            <HeatMap
                value={data}
                startDate={oneYearAgo}
                endDate={today}
                width={750}
                rectRender={(props, data) => {
                    if (!data.count) return <rect {...props} />;
                    return (
                        <Tooltip label={`cards studied: ${data.count} on the ${data.date}`}>
                            <rect {...props} />
                        </Tooltip>
                    );
                }}
            />
        </GlassPaper>
    )
}

export default StatsPage