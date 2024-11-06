class TriggerController {
    constructor(crudTrigger, triggerRegister) {
        this.crudTrigger = crudTrigger;
        this.triggerRegister = triggerRegister;
    }

    async create(req, res) {
        try {
            const { workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret } = req.body;
            const trigger = await this.crudTrigger.create({ workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret });
            res.json(trigger);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async get(req, res) {
        try {
            const triggers = await this.crudTrigger.get();
            res.json(triggers);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id, workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret } = req.body;
            const trigger = await this.crudTrigger.update({ id, workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret });
            res.json(trigger);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body;
            await this.crudTrigger.delete({ id });
            res.json({ message: 'Trigger deleted' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const trigger = await this.crudTrigger.getById({ id });
            res.json(trigger);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getByWorkspaceId(req, res) {
        try {
            const { workspace_id } = req.params;
            const triggers = await this.crudTrigger.getByWorkspaceId({ workspace_id });
            res.json(triggers);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async add(req, res) {
        try {
            const { workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret } = req.body;
            const trigger = await this.crudTrigger.add({ workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret });
            this.triggerRegister.registerNewTrigger(trigger);
            res.json(trigger);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = TriggerController;