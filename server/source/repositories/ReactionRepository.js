const camelCaseToSnakeCase = require('../utils/CamelToSnake');

class ReactionRepository {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }

    async create(reaction) {
        const sql = 'INSERT INTO reactions (title, description, service_id) VALUES (?, ?, ?, ?)';
        const values = [reaction.title, reaction.description, reaction.serviceId, reaction.data];
        return await this.dbConnection.execute(sql, values);
    }

    async get() {
        const sql = 'SELECT * FROM reactions';
        const [rows] = await this.dbConnection.execute(sql);
        return rows;
    }

    async getById(id) {
        const sql = 'SELECT * FROM reactions WHERE id = ?';
        const [rows] = await this.dbConnection.execute(sql, [id]);
        return rows.length ? rows[0] : null;
    }

    async getByServiceName(name) {
        const sql = `
            SELECT reactions.*
            FROM reactions
            JOIN services ON reactions.service_id = services.id
            WHERE services.title = ?
        `;
        const [rows] = await this.dbConnection.execute(sql, [name]);
        return rows;
    }

    async update(reaction) {
        let sql = 'UPDATE reactions SET ';
        const values = [];
        const reactionSnakeCase = await camelCaseToSnakeCase(reaction);
        for (const key in reactionSnakeCase) {
            if (reactionSnakeCase[key]) {
                sql += `${key} = ?, `;
                values.push(reactionSnakeCase[key]);
            }
        }
        sql = sql.slice(0, -2);
        sql += ' WHERE id = ?';
        values.push(reaction.id);
        return await this.dbConnection.execute(sql, values);
    }

    async delete(id) {
        const sql = 'DELETE FROM reactions WHERE id = ?';
        return await this.dbConnection.execute(sql, [id]);
    }
}

module.exports = ReactionRepository;