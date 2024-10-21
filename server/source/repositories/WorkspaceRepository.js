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

    async update(workspace) {
        // to update to be able to add action, reactions, trigger and other things
        // can also create specific routes for those if needed
        //TODO: all fields updatable
        const sql = 'UPDATE workspaces SET name = ? WHERE id = ?';
        const values = [workspace.name, workspace.id];
        return await this.dbConnection.execute(sql, values);
    }

    async delete(id) {
        const sql = 'DELETE FROM workspaces WHERE id = ?';
        return await this.dbConnection.execute(sql, [id]);
    }
}

module.exports = WorkspaceRepository;