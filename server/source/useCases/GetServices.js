const Service = require('../entities/Service');

class GetServices {
    constructor(serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    async execute() {
        const rows = await this.serviceRepository.getAll();
        return rows.map(row => new Service(row));
    }
}

module.exports = GetServices;