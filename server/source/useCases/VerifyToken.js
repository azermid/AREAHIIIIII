class VerifyToken {
  constructor(authService) {
    this.authService = authService;
}

  async execute(token) {
    if (!token) {
      throw new Error('Token is required');
    }

    return this.authService.verifyToken(token);
  }
}

module.exports = VerifyToken;