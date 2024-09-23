import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CardForm from '../Components/CardForm';
import '@testing-library/jest-dom';
import TestWrapper from './utils';

describe('CardForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
        // Mock localStorage
        jest.spyOn(Storage.prototype, 'setItem');
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('mockToken');
        // Mock fetch
        global.fetch = jest.fn();
    });

    test("renders the form with initial values for a new card", () => {
        render(<TestWrapper><CardForm id={1} /></TestWrapper>);

        expect(screen.getByLabelText(/Question/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Answer/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    test('shows error message for empty input', async () => {
        render(<TestWrapper><CardForm id={1} /></TestWrapper>);

        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        expect(await screen.findByText(/Question field must have at least 2 letters/i)).toBeInTheDocument();
        expect(await screen.findByText(/Please add an answer/i)).toBeInTheDocument();
    });

    test("submits form and shows success notification for new card", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ question: 'What is testing?', answer: 'It is a process.' }),
        });

        render(<TestWrapper><CardForm id={1} /></TestWrapper>);

        fireEvent.change(screen.getByLabelText(/Question/i), { target: { value: 'What is testing?' } });
        fireEvent.change(screen.getByLabelText(/Answer/i), { target: { value: 'Ensuring code quality' } });

        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(screen.getByText(/Card successfully saved/i)).toBeInTheDocument();
            expect(screen.getByText('What is testing?')).toBeInTheDocument();
        });
    });

    test("handles fetch errors gracefully", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Could not save card.' }),
        });

        render(<TestWrapper><CardForm id={1} /></TestWrapper>);

        fireEvent.change(screen.getByLabelText(/Question/i), { target: { value: 'What is testing?' } });
        fireEvent.change(screen.getByLabelText(/Answer/i), { target: { value: 'Ensuring code quality' } });

        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(screen.getByText(/Could not save card/i)).toBeInTheDocument();
        });
    });
})