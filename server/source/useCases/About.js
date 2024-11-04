const ServiceRepository = require('../repositories/ServiceRepository');

class AboutUseCase {
    constructor(dbConnection) {
        this.serviceRepository = new ServiceRepository(dbConnection);
    }

    async execute(clientIp) {
        const currentTime = Math.floor(Date.now() / 1000);
        const services = await this.serviceRepository.getServicesWithActionsAndReactions();

        return {
            client: {
                host: clientIp,
            },
            server: {
                current_time: currentTime,
                services: services,
            },
        };
    }
}

module.exports = AboutUseCase;
