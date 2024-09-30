export type Deck = {
    name: string
    id: number
}

export type Card = {
    answer: string;
    creation_date: Date;
    deck: number;
    id: number;
    question: string;
    reviewed_date: Date | null;
    next_review_date: Date;

}
