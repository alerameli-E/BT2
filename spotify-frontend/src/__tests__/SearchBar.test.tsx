import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashBoard from '../Components/DashBoard';
import * as spotifyService from '../Services/spotifyService';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('../Services/spotifyService'); // Esto activa el mock del módulo

const mockedSpotifyService = spotifyService as jest.Mocked<typeof spotifyService>;

describe('Dashboard', () => {
    beforeEach(() => {
        localStorage.setItem('sessionId', 'mock-session');
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('performs a search and displays results', async () => {
        mockedSpotifyService.searchInformation.mockResolvedValue({
            data: {
                artists: {
                    items: [
                        {
                            id: '1',
                            name: 'Mock Artist',
                            images: [],
                            genres: ['rock', 'pop', 'indie']
                        }],
                },
                tracks: {
                    items: [],
                },
                albums: {
                    items: [],
                },
            },
            status: 200,
            statusText: 'OK',
            headers: {}, // OK para esta parte
            config: {
                headers: new axios.AxiosHeaders(),
            },
        });

        render(
            <BrowserRouter>
                <DashBoard />
            </BrowserRouter>
        );

        const input = screen.getByPlaceholderText(/search track, artist or album/i);
        fireEvent.change(input, { target: { value: 'mock' } });

        const button = screen.getByTestId('search-button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('Mock Artist')).toBeInTheDocument();
        });
    });
});
