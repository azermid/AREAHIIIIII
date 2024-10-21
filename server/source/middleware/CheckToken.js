const AuthService = require('../services/AuthService');

const checkToken = (req, res, next) => {
    const authService = new AuthService();
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }
    if (!authService.verifyToken(token).valid) {
        return res.status(401).send({ message: 'Unauthorized!' });
    }
    next();
}

module.exports = checkToken;