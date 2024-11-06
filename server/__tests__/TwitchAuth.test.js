const TwitchAuth = require('../source/services/TwitchAuth'); // Remplacez par le bon chemin
const fetch = require('node-fetch');

// Mock de la méthode fetch
jest.mock('node-fetch', () => jest.fn());

describe('TwitchAuth', () => {
  let twitchAuth;
  let mockFetch;

  beforeEach(() => {
    // Initialiser l'instance de TwitchAuth
    twitchAuth = new TwitchAuth();
    mockFetch = fetch;
  });
    describe('getTwitchTokens', () => {
    it('should return Twitch tokens when the code is valid', async () => {
      const mockResponse = {
        access_token: 'mockAccessToken',
        refresh_token: 'mockRefreshToken',
        expires_in: 3600
      };

      // Simuler une réponse réussie de fetch
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const code = 'mockCode';
      const tokens = await twitchAuth.getTwitchTokens(code);

      expect(tokens).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith('https://id.twitch.tv/oauth2/token', expect.objectContaining({
        method: 'POST',
        body: expect.any(URLSearchParams),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }));
    });

    it('should throw an error if the response is not ok', async () => {
      // Simuler une réponse avec une erreur
      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Bad Request',
      });

      const code = 'mockCode';
      
      await expect(twitchAuth.getTwitchTokens(code)).rejects.toThrow('Error fetching tokens: Bad Request');
    });

    it('should throw an error if there is an issue with the fetch call', async () => {
      const mockError = new Error('Network Error');
      mockFetch.mockRejectedValue(mockError);

      const code = 'mockCode';

      await expect(twitchAuth.getTwitchTokens(code)).rejects.toThrow('Network Error');
    });
  });
});
