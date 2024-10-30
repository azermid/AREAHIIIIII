const camelCaseToSnakeCase = require('../utils/CamelToSnake');

class TriggerRepository {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }

    async create(trigger) {
        const sql = 'INSERT INTO triggers (workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [trigger.workspace_id, trigger.type, trigger.action_id, trigger.reaction_id, trigger.action_data, trigger.reaction_data, trigger.action_service_token, trigger.reaction_service_token, trigger.action_service_refresh_token, trigger.reaction_service_refresh_token, trigger.webhook_url, trigger.webhook_secret];
        return await this.dbConnection.execute(sql, values);
    }

    async get() {
        const sql = 'SELECT * FROM triggers';
        const [rows] = await this.dbConnection.execute(sql);
        return rows;
    }

    async getById(id) {
        const sql = 'SELECT * FROM triggers WHERE id = ?';
        const [rows] = await this.dbConnection.execute(sql, [id]);
        return rows.length ? rows[0] : null;
    }

    async getByWorkspaceId(workspaceId) {
        const sql = 'SELECT * FROM triggers WHERE workspace_id = ?';
        const [rows] = await this.dbConnection.execute(sql, [workspaceId]);
        return rows;
    }

    async update(trigger) {
        let sql = 'UPDATE triggers SET ';
        const values = [];
        const triggerSnakeCase = await camelCaseToSnakeCase(trigger);
        for (const key in triggerSnakeCase) {
            if (triggerSnakeCase[key]) {
                sql += `${key} = ?, `;
                values.push(triggerSnakeCase[key]);
            }
        }
        sql = sql.slice(0, -2);
        sql += ' WHERE id = ?';
        values.push(trigger.id);
        return await this.dbConnection.execute(sql, values);
    }

    async delete(id) {
        const sql = 'DELETE FROM triggers WHERE id = ?';
        return await this.dbConnection.execute(sql, [id]);
    }
}

module.exports = TriggerRepository;