const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    async verifyPassword(inputPassword, storedPassword) {
        return await bcrypt.compare(inputPassword, storedPassword);
    }

    generateToken(user) {
        const payload = { id: user.id, username: user.username, provider: user.provider };
        return jwt.sign(payload, 'secret_key', { expiresIn: '1h' });
    }

    verifyToken(token) {
        const decoded = jwt.verify(token, 'secret_key');
        if (!decoded) {
            return { valid: false };
        }
        return { valid: true };
    }
}

module.exports = AuthService;
