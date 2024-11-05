const Trigger = require('../entities/Trigger');

class CrudTrigger {
    constructor(triggerRepository) {
        this.triggerRepository = triggerRepository;
    }

    async create({ workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret }) {
        if (!workspace_id || !type || !action_id || !reaction_id || !action_data || !reaction_data || !action_service_token || !reaction_service_token) {
            throw new Error('Workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token are required');
        }
        if (action_service_refresh_token == undefined)
            action_service_refresh_token = "fyghjk";
        if (reaction_service_refresh_token == undefined)
            reaction_service_refresh_token = "esrdftyghuijok";
        const trigger = new Trigger({ workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret });
        const response = await this.triggerRepository.create(trigger);
        trigger.id = response[0].insertId;
        return trigger;
    }

    async get() {
        return await this.triggerRepository.get();
    }

    async update({ id, workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret }) {
        if (!id) {
            throw new Error('Id is required');
        }
        const trigger = new Trigger({ id, workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret });
        return await this.triggerRepository.update(trigger);
    }

    async delete({ id }) {
        if (!id) {
            throw new Error('Id is required');
        }
        return await this.triggerRepository.delete(id);
    }

    async getById({ id }) {
        if (!id) {
            throw new Error('Id is required');
        }
        return await this.triggerRepository.getById(id);
    }

    async getByWorkspaceId({ workspace_id }) {
        if (!workspace_id) {
            throw new Error('Workspace_id is required');
        }
        return await this.triggerRepository.getByWorkspaceId(workspace_id);
    }

    async add({ workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret }) {
        if (!workspace_id || !type || !action_id || !reaction_id || !action_data || !reaction_data || !action_service_token || !reaction_service_token) {
            throw new Error('Workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token are required');
        }
        if (action_service_refresh_token == undefined)
            action_service_refresh_token = "undefined";
        if (reaction_service_refresh_token == undefined)
            reaction_service_refresh_token = "undefined";
        const triggerExists = await this.getByWorkspaceId({workspace_id});
        if (triggerExists.length > 0) {
            const trigger = new Trigger({ id: triggerExists[0].id, workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret });
            await this.update({ id: triggerExists[0].id, workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret });
            return trigger;

        } else {
            const trigger = new Trigger({ workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret });
            const response = await this.triggerRepository.create(trigger);
            trigger.id = response[0].insertId;
            return trigger;
        }
    }
}

module.exports = CrudTrigger;