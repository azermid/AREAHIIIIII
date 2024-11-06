// __tests__/githubController.test.js
const createSpotifyPlaylist = require('../source/reactions/create_spotify_playlist');
const fetch = require('node-fetch');
jest.mock('node-fetch', () => jest.fn());

describe('createSpotifyPlaylist', () => {
    const token = 'fake-token';
    const data = {
        name: 'My Test Playlist',
        description: 'A playlist created for testing',
        isPublic: true
    };

    afterEach(() => {
        fetch.mockClear();
    });

    it('should send the correct request to create a playlist', async () => {
        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({ id: 'testPlaylistId' }),
        };
        fetch.mockResolvedValue(mockResponse);

        const result = await createSpotifyPlaylist(token, data);

        expect(fetch).toHaveBeenCalledWith(
            "https://api.spotify.com/v1/me/playlists",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    description: data.description,
                    public: data.isPublic,
                }),
            }
        );
        expect(result).toEqual({ id: 'testPlaylistId' });
    });

    it('should handle errors correctly', async () => {
        const errorData = { error: { message: 'Invalid token', status: 401 } };
        const mockResponse = {
            ok: false,
            json: jest.fn().mockResolvedValue(errorData),
        };
        fetch.mockResolvedValue(mockResponse);

        const result = await createSpotifyPlaylist(token, data);

        expect(fetch).toHaveBeenCalled();
        expect(result).toBeUndefined();
    });
});
