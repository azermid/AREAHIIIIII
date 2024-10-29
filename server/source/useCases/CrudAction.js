const Action = require('../entities/Action');

class CrudAction {
    constructor(actionRepository) {
        this.actionRepository = actionRepository;
    }

    async create({ title, description, service_id }) {
        if (!title || !description || !service_id) {
            throw new Error('Title, description and service_id are required');
        }
        const action = new Action({ title, description, service_id });
        const response = await this.actionRepository.create(action);
        action.id = response[0].insertId;
        return action;
    }

    async get() {
        return await this.actionRepository.get();
    }

    async update({ id, title, description, service_id }) {
        if (!id) {
            throw new Error('Id is required');
        }
        const action = new Action({ id, title, description, service_id });
        return await this.actionRepository.update(action);
    }

    async delete({ id }) {
        if (!id) {
            throw new Error('Id is required');
        }
        return await this.actionRepository.delete(id);
    }

    async getById({ id }) {
        if (!id) {
            throw new Error('Id is required');
        }
        return await this.actionRepository.getById(id);
    }

    async getByServiceName({ name }) {
        if (!name) {
            throw new Error('Name is required');
        }
        return await this.actionRepository.getByServiceName(name);
    }
}

module.exports = CrudAction;