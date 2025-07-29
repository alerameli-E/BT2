import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DashBoard from '../Components/DashBoard';
import ArtistDashboard from '../Components/ArtistDashboard';
import * as spotifyService from '../Services/spotifyService';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import dotenv from "dotenv"

dotenv.config()

jest.mock('../Services/spotifyService');

const mockedSpotifyService = spotifyService as jest.Mocked<typeof spotifyService>;

describe('Artist navigation from Dashboard using the searchBar', () => {
    beforeEach(() => {
        localStorage.setItem('sessionId', 'mock-session');
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('navigates to artist page and displays artist info', async () => {
        mockedSpotifyService.searchInformation.mockResolvedValue({
            data: {
                artists: {
                    items: [
                        {
                            id: '123',
                            name: 'Mock Artist',
                            images: [{ url: 'mock-url.jpg' }],
                            genres: ['rock', 'pop', 'indie']
                        }
                    ]
                },
                tracks: { items: [] },
                albums: { items: [] }
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: { headers: new axios.AxiosHeaders() }
        });

        mockedSpotifyService.getArtistInformation.mockResolvedValue({
            data: {
                name: 'Mock Artist',
                images: [{ url: 'mock-url.jpg' }],
                followers: { total: 1000 },
                genres: ['rock', 'pop', 'indie']
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
        } as AxiosResponse);


        mockedSpotifyService.getAlbumsFromArtist.mockResolvedValue({
            data: {
                items: [
                    {
                        id: 'album-1',
                        name: 'Mock Album',
                        release_date: '2020-01-01',
                        images: [{ url: 'album-image.jpg' }],
                        tracks: {
                            items: [
                                { id: 'track-1', name: 'Track 1', duration_ms: 180000 }
                            ]
                        }
                    }
                ]
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {}
        } as AxiosResponse);

        mockedSpotifyService.getArtistTopSongs.mockResolvedValue({
            data: {
                tracks: [
                    {
                        id: 'track-1',
                        name: 'Top Song 1',
                        duration_ms: 200000,
                        album: { name: 'Album 1', images: [{ url: 'song-img.jpg' }] },
                        artists: [{ name: 'Mock Artist' }]
                    }
                ]
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {}
        } as AxiosResponse);

        mockedSpotifyService.getAlbumInformation.mockResolvedValue({
            data: {
                id: 'album-1',
                name: 'Mock Album',
                release_date: '2020-01-01',
                images: [{ url: 'album-image.jpg' }],
                tracks: {
                    items: [
                        {
                            id: 'track-1',
                            name: 'Track 1',
                            duration_ms: 180000,
                            artists: [{ name: 'Mock Artist' }]
                        }
                    ]
                }
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {}
        } as AxiosResponse);

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route path="/dashboard" element={<DashBoard />} />
                    <Route path="/artist/:id" element={<ArtistDashboard />} />
                </Routes>
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText(/search track, artist or album/i);
        fireEvent.change(input, { target: { value: 'mock' } });

        const button = screen.getByTestId('search-button');
        fireEvent.click(button);

        const artistName = await screen.findByText('Mock Artist');
        fireEvent.click(artistName); 

        await waitFor(() => {
            expect(screen.getByText('Mock Artist')).toBeInTheDocument(); 
            expect(screen.getByText('1,000 followers')).toBeInTheDocument(); 
            expect(screen.getByText('rock, pop, indie')).toBeInTheDocument(); 
            expect(screen.getByText('Top Song 1')).toBeInTheDocument(); 
            expect(screen.getAllByText('Mock Album')).toHaveLength(2);

        });
    });
});
