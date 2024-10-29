// const Workspace = require('../entities/Workspace'); //should use this

class WorkspaceRepository {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }

    async create(workspace) {
        const sql = 'INSERT INTO workspaces (name, user_id) VALUES (?, ?)';
        const values = [workspace.name, workspace.userId];
        return await this.dbConnection.execute(sql, values);
    }

    async get() {
        const sql = 'SELECT * FROM workspaces';
        const [rows] = await this.dbConnection.execute(sql);
        return rows;
    }

    async getById(id) {
        const sql = 'SELECT * FROM workspaces WHERE id = ?';
        const [rows] = await this.dbConnection.execute(sql, [id]);
        return rows.length ? rows[0] : null;
    }

    async getByUserId(userId) {
        const sql = 'SELECT * FROM workspaces WHERE user_id = ?';
        const [rows] = await this.dbConnection.execute(sql, [userId]);
        return rows;
    }

    async camelCaseToSnakeCase(obj) {
        const newObj = {};
        for (const key in obj) {
            const newKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            newObj[newKey] = obj[key];
        }
        return newObj;
    }

    async update(workspace) {
        let sql = 'UPDATE workspaces SET ';
        const values = [];
        const workspaceSnakeCase = await this.camelCaseToSnakeCase(workspace);
        for (const key in workspaceSnakeCase) {
            if (workspaceSnakeCase[key]) {
                sql += `${key} = ?, `;
                values.push(workspaceSnakeCase[key]);
            }
        }
        sql = sql.slice(0, -2);
        sql += ' WHERE id = ?';
        values.push(workspace.id);
        return await this.dbConnection.execute(sql, values);
    }

    async delete(id) {
        const sql = 'DELETE FROM workspaces WHERE id = ?';
        return await this.dbConnection.execute(sql, [id]);
    }
}

module.exports = WorkspaceRepository;