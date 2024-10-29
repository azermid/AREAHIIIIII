const Reaction = require('../entities/Reaction');

class CrudReaction {
    constructor(reactionRepository) {
        this.reactionRepository = reactionRepository;
    }

    async create({ title, description, service_id }) {
        if (!title || !description || !service_id) {
            throw new Error('Title, description and service_id are required');
        }
        const reaction = new Reaction({ title, description, service_id });
        const response = await this.reactionRepository.create(reaction);
        reaction.id = response[0].insertId;
        return reaction;
    }

    async get() {
        return await this.reactionRepository.get();
    }

    async update({ id, title, description, service_id }) {
        if (!id) {
            throw new Error('Id is required');
        }
        const reaction = new Reaction({ id, title, description, service_id });
        return await this.reactionRepository.update(reaction);
    }

    async delete({ id }) {
        if (!id) {
            throw new Error('Id is required');
        }
        return await this.reactionRepository.delete(id);
    }

    async getById({ id }) {
        if (!id) {
            throw new Error('Id is required');
        }
        return await this.reactionRepository.getById(id);
    }

    async getByServiceName({ name }) {
        if (!name) {
            throw new Error('Name is required');
        }
        return await this.reactionRepository.getByServiceName(name);
    }
}

module.exports = CrudReaction;