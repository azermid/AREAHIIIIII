class UserRepository {
    constructor(database) {
        this.database = database;
    }

    async findByUsername(username, provider) {
        const query = 'SELECT * FROM users WHERE username = ? AND oauth_provider = ?';
        const [rows] = await this.database.execute(query, [username, provider]);
        return rows.length ? rows[0] : null;
    }

    async findByEmail(email, provider) {
        const query = 'SELECT * FROM users WHERE email = ? AND oauth_provider = ?';
        const [rows] = await this.database.execute(query, [email, provider]);
        return rows.length ? rows[0] : null;
    }

    async findByOAuthId(oauthId, provider) {
        const query = 'SELECT * FROM users WHERE oauth_id = ? AND oauth_provider = ?';
        const [rows] = await this.database.execute(query, [oauthId, provider]);
        return rows.length ? rows[0] : null
    }

    async create(user) {
        const sql = 'INSERT INTO users (username, email, password, oauth_id, oauth_provider) VALUES (?, ?, ?, ?, ?)';
        const values = [user.username, user.email, user.password, user.oauth_id, user.oauth_provider];
        // console.log('Values: ', values);
        return await this.database.execute(sql, values);
    }
}

module.exports = UserRepository;
