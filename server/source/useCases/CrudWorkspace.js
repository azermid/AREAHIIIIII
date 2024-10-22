const Workspace = require('../entities/Workspace');

class CrudWorkspace {
    constructor(workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    async create({ name, userId }) {
        if (!name || !userId) {
            throw new Error('Name and userId are required');
        }
        const workspace = new Workspace({ name, userId });
        const response = await this.workspaceRepository.create(workspace);
        workspace.id = response[0].insertId;
        return workspace;
    }

    async get() {
        return await this.workspaceRepository.get();
    }

    async update({ id, name }) {
        //TODO: all fields updatable, on pair with the repository
        if (!id || !name) {
            throw new Error('Id and name are required');// should not be required, you should be able to update only the fields you want
        }
        const workspace = new Workspace({ id, name });
        return await this.workspaceRepository.update(workspace);
    }

    async delete({ id }) {
        if (!id) {
            throw new Error('Id is required');
        }
        return await this.workspaceRepository.delete(id);
    }

    async getById({ id }) {
        if (!id) {
            throw new Error('Id is required');
        }
        return await this.workspaceRepository.getById(id);
    }

    async getByUserId({ id }) {
        if (!id) {
            throw new Error('Id is required');
        }
        return await this.workspaceRepository.getByUserId(id);
    }
}

module.exports = CrudWorkspace;