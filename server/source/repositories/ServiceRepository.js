class ServiceRepository {
    constructor(dbConnection) {
        this.db = dbConnection;
    }

    async get() {
        try {
            const data = await this.db.query('SELECT id, title, description FROM services');
            return data[0];
        } catch (error) {
            throw new Error('Error fetching services from the database: ' + error.message);
        }
    }

    async getServicesWithActionsAndReactions() {
        try {
            const services = await this.db.query('SELECT id, title FROM services');
            console.log(services);
            const formattedServices = [];

            for (const service of services[0]) {
                const actions = await this.db.query(
                    'SELECT title, description FROM actions WHERE service_id = ?',
                    [service.id]
                );
                const reactions = await this.db.query(
                    'SELECT title, description FROM reactions WHERE service_id = ?',
                    [service.id]
                );
                const actionsFormatted = actions[0].map(action => ({
                    name: action.title,
                    description: action.description,
                }));
                const reactionsFormatted = reactions[0].map(reaction => ({
                    name: reaction.title,
                    description: reaction.description,
                }));
                formattedServices.push({
                    name: service.title,
                    actions: actionsFormatted,
                    reactions: reactionsFormatted,
                });
            }

            return formattedServices;
        } catch (error) {
            throw new Error('Error fetching services from the database: ' + error.message);
        }
    }
}

module.exports = ServiceRepository;
