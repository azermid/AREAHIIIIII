const MicrosoftAuth = require('../source/services/MicrosoftAuth');  // Remplacez par le bon chemin
const msal = require('@azure/msal-node');

// Mock de msal
jest.mock('@azure/msal-node');

describe('MicrosoftAuth', () => {
  let microsoftAuth;
  let mockGetAuthCodeUrl;
  let mockAcquireTokenByCode;

  beforeEach(() => {
    mockGetAuthCodeUrl = jest.fn();
    mockAcquireTokenByCode = jest.fn();

    // Création d'une instance de MicrosoftAuth avec des méthodes simulées
    microsoftAuth = new MicrosoftAuth();

    // Remplacer les méthodes de l'instance 'cca' par les mocks
    microsoftAuth.cca.getAuthCodeUrl = mockGetAuthCodeUrl;
    microsoftAuth.cca.acquireTokenByCode = mockAcquireTokenByCode;
  });

  describe('getAuthUrl', () => {
    it('should return auth URL', async () => {
      // Mock de la réponse de getAuthCodeUrl
      const expectedUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=mockClientId';
      mockGetAuthCodeUrl.mockResolvedValue(expectedUrl);

      const authUrl = await microsoftAuth.getAuthUrl();

      expect(authUrl).toBe(expectedUrl);
      expect(mockGetAuthCodeUrl).toHaveBeenCalledWith({
        scopes: ['User.Read', 'Mail.Read', 'Mail.Send', 'offline_access'],
        redirectUri: process.env.BACKEND_URI + '/auth/microsoft/callback',
      });
    });

    it('should throw an error if getAuthCodeUrl fails', async () => {
      // Simuler une erreur dans getAuthCodeUrl
      mockGetAuthCodeUrl.mockRejectedValue(new Error('Error getting auth URL'));

      await expect(microsoftAuth.getAuthUrl())
        .rejects
        .toThrow('Error getting auth URL');
    });
  });

  describe('getOutlookTokens', () => {
    it('should return tokens', async () => {
      const code = 'mockCode';
      const mockTokens = { accessToken: 'mockAccessToken', refreshToken: 'mockRefreshToken' };

      // Mock de la réponse de acquireTokenByCode
      mockAcquireTokenByCode.mockResolvedValue(mockTokens);

      const tokens = await microsoftAuth.getOutlookTokens(code);

      expect(tokens).toEqual(mockTokens);
      expect(mockAcquireTokenByCode).toHaveBeenCalledWith({
        code,
        scopes: ['User.Read', 'Mail.Read', 'Mail.Send', 'offline_access'],
        redirectUri: process.env.BACKEND_URI + '/auth/microsoft/callback',
      });
    });

    it('should throw an error if acquireTokenByCode fails', async () => {
      const code = 'mockCode';
      const mockError = new Error('Error acquiring tokens');

      // Simuler une erreur dans acquireTokenByCode
      mockAcquireTokenByCode.mockRejectedValue(mockError);

      await expect(microsoftAuth.getOutlookTokens(code))
        .rejects
        .toThrow('Error acquiring tokens');
    });
  });
});
