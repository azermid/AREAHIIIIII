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
            const services = await this.db.query('SELECT id, title, description FROM services');
            const formattedServices = [];

            for (const service of services) {
                const actions = await this.db.query(
                    'SELECT id, title, description, type, data FROM actions WHERE service_id = ?',
                    [service.id]
                );
                const reactions = await this.db.query(
                    'SELECT id, title, description, data FROM reactions WHERE service_id = ?',
                    [service.id]
                );

                formattedServices.push({
                    id: service.id,
                    title: service.title,
                    description: service.description,
                    actions: actions.length > 0 ? actions.map(action => ({
                        id: action.id,
                        name: action.title,
                        description: action.description,
                        type: action.type,
                        data: action.data,
                    })) : [],
                    reactions: reactions.length > 0 ? reactions.map(reaction => ({
                        id: reaction.id,
                        name: reaction.title,
                        description: reaction.description,
                        data: reaction.data,
                    })) : [],
                });
            }
            return formattedServices;
        } catch (error) {
            throw new Error('Error fetching services from the database: ' + error.message);
        }
    }
}

module.exports = ServiceRepository;
