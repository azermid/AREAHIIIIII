class ServiceRepository {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }

    async getAll() {
        const sql = 'SELECT * FROM services';
        const [rows] = await this.dbConnection.execute(sql);
        return rows;
    }
}

module.exports = ServiceRepository;