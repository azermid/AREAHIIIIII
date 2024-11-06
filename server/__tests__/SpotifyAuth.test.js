const SpotifyAuthService = require('../source/services/SpotifyAuth'); // Remplacez par le bon chemin
const SpotifyWebApi = require('spotify-web-api-node');

// Mock de SpotifyWebApi
jest.mock('spotify-web-api-node');

describe('SpotifyAuthService', () => {
  let spotifyAuthService;
  let mockCreateAuthorizeURL;
  let mockAuthorizationCodeGrant;
  let mockGetMe;

  beforeEach(() => {
    mockCreateAuthorizeURL = jest.fn();
    mockAuthorizationCodeGrant = jest.fn();
    mockGetMe = jest.fn();

    // Instancier le service avec des méthodes mockées
    spotifyAuthService = new SpotifyAuthService();

    // Remplacer les méthodes de l'API Spotify par les mocks
    spotifyAuthService.spotifyApi.createAuthorizeURL = mockCreateAuthorizeURL;
    spotifyAuthService.spotifyApi.authorizationCodeGrant = mockAuthorizationCodeGrant;
    spotifyAuthService.spotifyApi.getMe = mockGetMe;
  });

  describe('getAuthUrl', () => {
    it('should return authorization URL', () => {
      // Mock de la méthode createAuthorizeURL
      const expectedUrl = 'https://accounts.spotify.com/authorize?client_id=mockClientId';
      mockCreateAuthorizeURL.mockReturnValue(expectedUrl);

      const authUrl = spotifyAuthService.getAuthUrl();

      expect(authUrl).toBe(expectedUrl);
      expect(mockCreateAuthorizeURL).toHaveBeenCalledWith([
        'user-read-private',
        'user-read-email',
        'user-library-read',
        'playlist-read-private',
        'user-top-read',
        'user-read-playback-state',
        'user-modify-playback-state',
        'streaming',
        'playlist-modify-public',
        'playlist-modify-private'
      ], true);
    });
  });

  describe('getSpotifyUser', () => {
    it('should return Spotify user data when valid code is provided', async () => {
      const code = 'mockCode';
      const mockUserData = { id: 'mockId', display_name: 'mockName' };
      const mockTokens = { body: { access_token: 'mockAccessToken', refresh_token: 'mockRefreshToken' } };

      // Mock des méthodes de Spotify API
      mockAuthorizationCodeGrant.mockResolvedValue(mockTokens);
      mockGetMe.mockResolvedValue({ body: mockUserData });

      const userData = await spotifyAuthService.getSpotifyUser(code);

      expect(userData).toEqual(mockUserData);
      expect(mockAuthorizationCodeGrant).toHaveBeenCalledWith(code);
      expect(mockGetMe).toHaveBeenCalled();
    });

    it('should throw an error if there is an issue retrieving Spotify user data', async () => {
      const code = 'mockCode';
      const mockError = new Error('Error retrieving tokens');

      // Simuler une erreur dans authorizationCodeGrant
      mockAuthorizationCodeGrant.mockRejectedValue(mockError);

      await expect(spotifyAuthService.getSpotifyUser(code))
        .rejects
        .toThrow('Could not retrieve Spotify user');
    });
  });

  describe('getSpotifyTokens', () => {
    it('should return Spotify tokens when valid code is provided', async () => {
      const code = 'mockCode';
      const mockTokens = { body: { access_token: 'mockAccessToken', refresh_token: 'mockRefreshToken' } };

      // Mock de la méthode authorizationCodeGrant
      mockAuthorizationCodeGrant.mockResolvedValue(mockTokens);

      const tokens = await spotifyAuthService.getSpotifyTokens(code);

      expect(tokens).toEqual({
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken'
      });
      expect(mockAuthorizationCodeGrant).toHaveBeenCalledWith(code);
    });

    it('should throw an error if there is an issue retrieving Spotify tokens', async () => {
      const code = 'mockCode';
      const mockError = new Error('Error retrieving tokens');

      // Simuler une erreur dans authorizationCodeGrant
      mockAuthorizationCodeGrant.mockRejectedValue(mockError);

      await expect(spotifyAuthService.getSpotifyTokens(code))
        .rejects
        .toThrow('Could not retrieve Spotify tokens');
    });
  });
});
