class UserController {
    constructor(authenticateUser, registerUser, thirdPartyLogin, verifyToken) {
        this.authenticateUser = authenticateUser;
        this.registerUser = registerUser;
        this.thirdPartyLogin = thirdPartyLogin;
        this.verifyToken = verifyToken;
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const token = await this.authenticateUser.execute({ username, password, provider: 'area' });
            res.json({ token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            const token = await this.registerUser.execute({ username, email, password, provider: 'area' });
            res.json({ token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async thirdPartyLoginOrRegister(req, res) {
        try {
            const { username, email, oauth_id, oauth_provider, password } = req.body;
            const token = await this.thirdPartyLogin.execute({ username, email, oauth_id, oauth_provider, password });
            res.json({ token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async verify(req, res) {
        try {
            const { token } = req.body;
            const response = await this.verifyToken.execute(token);
            res.json(response);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getId(req, res) {
        try {
            const { token } = req.body;
            const response = await this.verifyToken.execute(token);
            res.json(response.decoded.id);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = UserController;