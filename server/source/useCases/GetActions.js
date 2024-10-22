const Action = require('../entities/Action');

class GetActions {
    constructor(actionRepository) {
        this.actionRepository = actionRepository;
    }

    async execute(serviceId) {
        if (!serviceId) {
            throw new Error('Service ID is required');
        }
        const rows = await this.actionRepository.getByServiceId(serviceId);
        return rows.map(row => new Action(row));
    }
}

module.exports = GetActions;