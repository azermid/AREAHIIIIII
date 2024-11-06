const GitHubAuth = require('../source/services/GitHubAuth'); // Ajustez le chemin
const fetch = require('node-fetch');

// Mock de la fonction fetch
jest.mock('node-fetch', () => jest.fn());

describe('GitHubAuth', () => {
  let gitHubAuth;

  beforeEach(() => {
    process.env.GITHUB_CLIENT_ID = 'testClientId';
    process.env.GITHUB_CLIENT_SECRET = 'testClientSecret';
    process.env.GITHUB_REDIRECT_URI = 'http://localhost/callback';

    // Instanciation de l'objet GitHubAuth
    gitHubAuth = new GitHubAuth();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthUrl', () => {
    it('should return the correct GitHub authorization URL', () => {
      const authUrl = gitHubAuth.getAuthUrl();

      expect(authUrl).toContain('https://github.com/login/oauth/authorize');
      expect(authUrl).toContain(`client_id=${process.env.GITHUB_CLIENT_ID}`);
      expect(authUrl).toContain(`redirect_uri=${encodeURIComponent(process.env.GITHUB_REDIRECT_URI)}`);
      expect(authUrl).toContain('scope=repo,admin:repo_hook');
    });
  });

  describe('getGitHubTokens', () => {
    it('should return tokens on successful GitHub response', async () => {
      const mockResponse = { access_token: 'mockAccessToken' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await gitHubAuth.getGitHubTokens('mockCode');

      expect(fetch).toHaveBeenCalledWith(
        'https://github.com/login/oauth/access_token',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Accept': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when GitHub returns an error response', async () => {
      const mockErrorResponse = 'Invalid code';
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => mockErrorResponse,
      });

      await expect(gitHubAuth.getGitHubTokens('invalidCode'))
        .rejects
        .toThrowError(`Failed to retrieve GitHub tokens: ${mockErrorResponse}`);
    });
  });

  describe('getGitHubUser', () => {
    it('should return user info on successful GitHub response', async () => {
      const mockUser = { login: 'mockUser' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await gitHubAuth.getGitHubUser('mockAccessToken');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/user',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mockAccessToken',
            'Accept': 'application/vnd.github.v3+json',
          }),
        })
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw an error when GitHub returns an error response', async () => {
      const mockErrorResponse = 'Not Found';
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => mockErrorResponse,
      });

      await expect(gitHubAuth.getGitHubUser('invalidToken'))
        .rejects
        .toThrowError(`Failed to retrieve GitHub user information: ${mockErrorResponse}`);
    });
  });
});
