const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn().mockImplementation(() => ({
        generateAuthUrl: jest.fn(),
        getToken: jest.fn(),
        setCredentials: jest.fn(),
      })),
    },
    oauth2: jest.fn().mockImplementation(() => ({
      userinfo: {
        get: jest.fn(),
      },
    })),
  },
}));

describe('GoogleAuthService', () => {
  let googleAuthService;
  let oauth2ClientMock;
  let thirdPartyLoginMock;

  beforeEach(() => {
    // Mock des objets nécessaires
    thirdPartyLoginMock = { execute: jest.fn() };
    googleAuthService = new (require('../source/services/GoogleAuth'))(thirdPartyLoginMock);
    oauth2ClientMock = googleAuthService.oauth2Client;
  });

  describe('getAuthUrl', () => {
    it('should return the correct Google auth URL', () => {
      const expectedUrl = 'https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%2Chttps%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&prompt=consent';
      oauth2ClientMock.generateAuthUrl.mockReturnValue(expectedUrl);
      expect(googleAuthService.getAuthUrl()).toBe(expectedUrl);
    });
  });

  describe('getGmailAuthUrl', () => {
    it('should return the correct Gmail auth URL', () => {
      const expectedUrl = 'https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly%2Chttps%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.send%2Copenid%2Cprofile%2Cemail&prompt=consent';
      oauth2ClientMock.generateAuthUrl.mockReturnValue(expectedUrl);
      expect(googleAuthService.getGmailAuthUrl()).toBe(expectedUrl);
    });
  });

  describe('getGoogleUser', () => {
    it('should throw an error if fetching user data fails', async () => {
      const mockCode = 'mockCode';
      const mockError = new Error('Failed to get user info');

      // Simuler l'échec dans getToken
      oauth2ClientMock.getToken.mockRejectedValue(mockError);

      // Test de l'échec avec expect().rejects
      await expect(googleAuthService.getGoogleUser(mockCode))
        .rejects
        .toThrow('Failed to get user info');
    });
  });

  describe('getGmailTokens', () => {
    it('should return Gmail tokens if successful', async () => {
      const mockCode = 'mockCode';
      const mockTokens = { access_token: 'mockAccessToken' };

      oauth2ClientMock.getToken.mockResolvedValue({ tokens: mockTokens });

      const tokens = await googleAuthService.getGmailTokens(mockCode);

      expect(tokens).toEqual(mockTokens);
    });
  });

  describe('googleLoginOrRegister', () => {
    it('should call thirdPartyLogin.execute with the correct user', async () => {
      const mockUser = { email: 'user@example.com' };
      const mockResponse = { success: true };

      thirdPartyLoginMock.execute.mockResolvedValue(mockResponse);

      const response = await googleAuthService.googleLoginOrRegister(mockUser);

      expect(response).toEqual(mockResponse);
      expect(thirdPartyLoginMock.execute).toHaveBeenCalledWith(mockUser);
    });

    it('should return null if there is an error during login or registration', async () => {
      const mockUser = { email: 'mockEmail' };
      const mockError = new Error('Login failed');

      // Simuler l'erreur de login
      thirdPartyLoginMock.execute.mockRejectedValue(mockError);

      const result = await googleAuthService.googleLoginOrRegister(mockUser);

      // Vérifier que la méthode retourne null en cas d'échec
      expect(result).toBeNull();
      expect(thirdPartyLoginMock.execute).toHaveBeenCalledWith(mockUser);
    });
  });
  describe('getGoogleUser', () => {  
    it('should throw an error if fetching user data fails', async () => {
      const mockCode = 'mockCode';
      const mockError = new Error('Failed to get user info');
  
      // Simuler une erreur dans l'appel à getToken (lignes 37-43)
      oauth2ClientMock.getToken.mockRejectedValue(mockError);
  
      // Tester l'échec de getGoogleUser et vérifier qu'une erreur est lancée
      await expect(googleAuthService.getGoogleUser(mockCode))
        .rejects
        .toThrow('Failed to get user info');
    });
  });  
});