class ActionRepository {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }

    async getByServiceId(serviceId) {
        const sql = 'SELECT * FROM actions WHERE service_id = ?';
        const [rows] = await this.dbConnection.execute(sql, [serviceId]);
        return rows;
    }
}

module.exports = ActionRepository;