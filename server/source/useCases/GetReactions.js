const Reaction = require('../entities/Reaction');

class GetReactions {
    constructor(reactionRepository) {
        this.reactionRepository = reactionRepository;
    }

    async execute(actionId) {
        if (!actionId) {
            throw new Error('Action ID is required');
        }
        const rows = await this.reactionRepository.getByActionId(actionId);
        return rows.map(row => new Reaction(row));
    }
}

module.exports = GetReactions;
