import { useState } from 'react';
import { Button, Group, rem, Text } from '@mantine/core';
import { Card } from '../Types';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IoCloudUpload, IoClose, IoFileTray } from "react-icons/io5";

const CsvUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);

        const newDeckId = await createNewDeck(file.name);

        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                const cards = mapCsvToCards(results.data, newDeckId);
                await sendCardsToBackend(cards);
                setIsUploading(false);
            },
        });
    };
    const createNewDeck = async (fileName: string) => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/decks/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name: fileName.replace('.csv', '') }),
            });

            if (!response.ok) {
                throw new Error('Failed to create deck');
            }

            const deck = await response.json();
            console.log('deck', deck);
            return deck.id;
        } catch (error) {
            console.error('Error creating deck:', error);
            return null;
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapCsvToCards = (data: any[], newDeckId: number): Card[] => {
        return data.map((row) => ({
            question: row['question'],
            answer: row['answer'],
            deck: newDeckId,
            creation_date: new Date(),
            needs_review: false,
            next_review_date: null,
            reviewed_date: null,
        }));
    };

    const sendCardsToBackend = async (cards: Card[]) => {
        try {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`http://127.0.0.1:8000/cards/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(cards),
            });

            if (response.ok) {
                alert('Cards uploaded successfully');
            } else {
                console.error('Failed to upload cards');
            }
        } catch (error) {
            console.error('Error uploading cards:', error);
        }
    };

    return (
        <div>
            <Dropzone
                onDrop={(files) => handleFileChange(files)}
                onReject={(files) => console.log('rejected files', files)}
                maxSize={5 * 1024 ** 2}
                accept={[MIME_TYPES.csv]}
                multiple={false}
            >
                <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                    <Dropzone.Accept>
                        <IoCloudUpload
                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                        />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IoClose
                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                        />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IoFileTray
                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                        />
                    </Dropzone.Idle>

                    <div>
                        <Text size="xl" inline>
                            Drag CSV files here or click to select files
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                            Attach as many files as you like, each file should not exceed 5mb
                        </Text>
                    </div>
                </Group>
            </Dropzone>
            {file && (
                <>
                    <Text mt="sm">Selected file: {file.name}</Text>
                    <Button mt="md" onClick={handleUpload}>
                        {isUploading ? 'Uploading...' : 'Upload CSV'}
                    </Button>
                </>
            )}
        </div >
    );
};

export default CsvUpload;
