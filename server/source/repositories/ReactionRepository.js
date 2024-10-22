class ReactionRepository {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }

    async getByActionId(actionId) {
        const sql = 'SELECT * FROM reactions WHERE action_id = ?';
        const [rows] = await this.dbConnection.execute(sql, [actionId]);
        return rows;
    }
}

module.exports = ReactionRepository;