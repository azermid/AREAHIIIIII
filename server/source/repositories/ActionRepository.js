const camelCaseToSnakeCase = require('../utils/CamelToSnake');

class ActionRepository {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }

    async create(action) {
        const sql = 'INSERT INTO actions (title, description, service_id) VALUES (?, ?, ?, ?, ?)';
        const values = [action.title, action.description, action.serviceId, action.data, action.type];
        return await this.dbConnection.execute(sql, values);
    }

    async get() {
        const sql = 'SELECT * FROM actions';
        const [rows] = await this.dbConnection.execute(sql);
        return rows;
    }

    async getById(id) {
        const sql = 'SELECT * FROM actions WHERE id = ?';
        const [rows] = await this.dbConnection.execute(sql, [id]);
        return rows.length ? rows[0] : null;
    }

    async getByServiceName(name) {
        const sql = `
            SELECT actions.*
            FROM actions
            JOIN services ON actions.service_id = services.id
            WHERE services.title = ?
        `;
        const [rows] = await this.dbConnection.execute(sql, [name]);
        return rows;
    }

    async update(action) {
        let sql = 'UPDATE actions SET ';
        const values = [];
        const actionSnakeCase = await camelCaseToSnakeCase(action);
        for (const key in actionSnakeCase) {
            if (actionSnakeCase[key]) {
                sql += `${key} = ?, `;
                values.push(actionSnakeCase[key]);
            }
        }
        sql = sql.slice(0, -2);
        sql += ' WHERE id = ?';
        values.push(action.id);
        return await this.dbConnection.execute(sql, values);
    }

    async delete(id) {
        const sql = 'DELETE FROM actions WHERE id = ?';
        return await this.dbConnection.execute(sql, [id]);
    }

    async getIdByName(name) {
        const sql = 'SELECT id FROM actions WHERE title = ?';
        const [rows] = await this.dbConnection.execute(sql, [name]);
        return rows.length ? rows[0].id : null;
    }

    async getTypeByName(name) {
        const sql = 'SELECT type FROM actions WHERE title = ?';
        const [rows] = await this.dbConnection.execute(sql, [name]);
        return rows.length ? rows[0].type : null;
    }
}

module.exports = ActionRepository;