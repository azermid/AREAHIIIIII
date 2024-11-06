const User = require('../entities/User');

class RegisterUser {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async execute({ username, email, password, provider }) {
        if (!username || !email || !password || !provider) {
            throw new Error('Username, email, password and provider are required');
        }
        const usernameExist = await this.userRepository.findByUsername(username, provider);
        if (usernameExist) {
            throw new Error('Username already exists');
        }

        const emailExists = await this.userRepository.findByEmail(email, provider);
        if (emailExists) {
            throw new Error('Email already exists');
        }
        const hashedPassword = await this.authService.hashPassword(password);
        const user = new User({ username, email, password: hashedPassword, oauth_id: 0, oauth_provider: provider });
        const response = await this.userRepository.create(user);
        user.id = response[0].insertId;
        return this.authService.generateToken({ id: user.id, username: user.username, provider });
    }
}

module.exports = RegisterUser;
