const User = require('../entities/User');

class ThirdPartyLogin {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async execute({ username, email, oauth_id, oauth_provider, password }) {
        if (!username || !email || !oauth_id || !oauth_provider || !password) {
            throw new Error('Username, email, oauth_id, oauth_provider, and password are required');
        }

        const userData = await this.userRepository.findByOAuthId(oauth_id, oauth_provider);
        if (userData) {
            return this.authService.generateToken({ id: userData.id, username: userData.username, provider: userData.oauth_provider });
        }

        const user = new User({ username, email, oauth_id, oauth_provider, password });
        const response = await this.userRepository.create(user);
        user.id = response[0].insertId;


        return this.authService.generateToken({ id: user.id, username: user.username, provider: user.oauth_provider });
    }
}

module.exports = ThirdPartyLogin;
