const User = require('../entities/User');

class AuthenticateUser {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async execute({ username, password, provider }) {
        if (!username || !password || !provider) {
            throw new Error('Username, password and provider are required');
        }

        const userData = await this.userRepository.findByUsername(username, provider);
        if (!userData) {
            throw new Error('User not found');
        }
        const user = new User(userData);

        const isPasswordValid = await this.authService.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        return this.authService.generateToken({ id: user.id, username: user.username, provider });
    }
}

module.exports = AuthenticateUser;
