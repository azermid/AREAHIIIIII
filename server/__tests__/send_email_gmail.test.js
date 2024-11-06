const send_email_gmail = require('../source/reactions/send_email_gmail'); // ajustez le chemin en fonction de votre structure
const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();

describe('send_email_gmail', () => {
  const token = 'dummy-token';
  const refreshToken = 'dummy-refresh-token';
  const data = {
    to: 'test@example.com',
    subject: 'Test Subject',
    text: 'This is a test email.'
  };
  const additionalData = {}; // Si vous avez besoin de ce paramètre, ajoutez-le

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should send email successfully with valid token', async () => {
    // Mock successful email send response
    const mockResponse = { id: 'message-id' };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await send_email_gmail(token, refreshToken, data, additionalData);

    expect(result).toEqual(mockResponse);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }),
        body: expect.stringContaining('raw')
      })
    );
  });

  it('should return an error if email send fails', async () => {
    // Mock failure response
    const mockError = { error: 'Invalid request' };
    fetchMock.mockResponseOnce(JSON.stringify(mockError), { status: 400 });

    const result = await send_email_gmail(token, refreshToken, data, additionalData);

    expect(result).toEqual(mockError);
    expect(fetchMock).toHaveBeenCalled();
  });

  it('should handle unexpected errors', async () => {
    // Mock unexpected error
    fetchMock.mockRejectOnce(new Error('Network Error'));

    const result = await send_email_gmail(token, refreshToken, data, additionalData);

    expect(result).toBeUndefined();
    expect(fetchMock).toHaveBeenCalled();
  });
});
