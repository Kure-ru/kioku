import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeckModal from '../Components/DeckModal';
import '@testing-library/jest-dom';
import TestWrapper from './utils';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
    useLocation: jest.fn(() => ({ pathname: '/' })),
}));

const mockClose = jest.fn();
const mockNavigate = jest.fn();

describe('New deck', () => {
    beforeEach(() => {
        render(
            <TestWrapper>
                <DeckModal opened={true} close={mockClose} />
            </TestWrapper >
        );

        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders correctly when opened", () => {
        expect(screen.getByPlaceholderText(/deck name/i)).toBeInTheDocument();
    });

    test('shows error message for empty input', async () => {
        fireEvent.click(screen.getByRole('button', { name: /Submit deck name/i }));
        expect(await screen.findByText(/Deck name is required/i)).toBeInTheDocument();
    });

    test("calls navigate with new deck ID on successful creation", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: 1 }),
            })
        ) as jest.Mock;

        fireEvent.change(screen.getByPlaceholderText(/deck name/i), {
            target: { value: "New Deck" },
        });
        fireEvent.click(screen.getByLabelText(/Submit deck name/i));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/deck/1");
        });
    });

    test("shows error on failed deck creation", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
            })
        ) as jest.Mock;

        fireEvent.change(screen.getByPlaceholderText(/deck name/i), {
            target: { value: "New Deck" },
        });
        fireEvent.click(screen.getByLabelText(/Submit deck name/i));

        await waitFor(() => {
            expect(screen.getByText(/Failed to create deck, please try again/i)).toBeInTheDocument();
        });
    });
});

describe('Existing deck', () => {
    beforeEach(() => {
        render(
            <TestWrapper>
                <DeckModal opened={true} close={mockClose} deck={{ id: 1, name: "Existing Deck" }} />
            </TestWrapper>
        );

        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("calls delete endpoint and navigates on successful deletion", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
            })
        ) as jest.Mock;

        fireEvent.click(screen.getByText(/Delete deck/i));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    test("updates input value when deck name changes", async () => {
        const input = screen.getByDisplayValue(/Existing Deck/i) as HTMLInputElement;

        expect(input.value).toBe("Existing Deck");

        fireEvent.change(input, { target: { value: "Updated Deck Name" } });

        expect(input.value).toBe("Updated Deck Name");
    });
});
