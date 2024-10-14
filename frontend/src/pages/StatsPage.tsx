
import { Stack, Title, Tooltip } from "@mantine/core";
import { BarChart } from '@mantine/charts';
import HeatMap from "@uiw/react-heat-map";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassPaper from "../Components/GlassPaper";

interface CardStatsEntry {
    date: string;
    count: number;
}

const StatsPage = () => {
    const navigate = useNavigate();
    const [heatmap, setHeatmap] = useState([]);
    const [cardsStats, setCardsStats] = useState<CardStatsEntry[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('accessToken');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const [heatmapData, cardsStudiedData] = await Promise.all([fetchHeatmap(token), fetchCardsData(token)]);
                setHeatmap(heatmapData);
                setCardsStats(cardsStudiedData);
            } catch (error) {
                console.error('Error when fetching the decks', error)
            }
        }
        fetchData();
    }, [navigate]);

    const fetchHeatmap = async (token: string) => {
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
        return await response.json();
    }

    const fetchCardsData = async (token: string) => {
        const response = await fetch('http://127.0.0.1:8000/stats/cards-stats/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response.status === 401) {
            navigate('/login')
            return;
        }
        return await response.json();
    }

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    return (
        <Stack>
            <GlassPaper style={{ overflow: "scroll" }}>
                <Title order={3} pb={16}>Studied days</Title>
                <HeatMap
                    value={heatmap}
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
            <GlassPaper style={{ overflow: "scroll" }}>
                <Title order={3} pb={16}>Reviews</Title>
                <BarChart
                    h={300}
                    data={cardsStats}
                    dataKey="date"
                    tickLine="none"
                    series={[
                        { name: 'new', color: 'violet.6' },
                        { name: 'young', color: 'blue.6' },
                        { name: 'mature', color: 'teal.6' },
                    ]}
                />
            </GlassPaper>
        </Stack>
    )
}

export default StatsPage