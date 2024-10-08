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
        try {
            const decoded = jwt.verify(token, 'secret_key');
            return { valid: true, decoded };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }
}

module.exports = AuthService;
