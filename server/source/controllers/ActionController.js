class ActionController {
    constructor(crudAction) {
        this.crudAction = crudAction;
    }

    async create(req, res) {
        try {
            const { title, description, service_id, data, type } = req.body;
            const action = await this.crudAction.create({ title, description, service_id, data, type });
            res.json(action);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async get(req, res) {
        try {
            const actions = await this.crudAction.get();
            res.json(actions);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id, title, description, service_id, data, type } = req.body;
            const action = await this.crudAction.update({ id, title, description, service_id, data, type });
            res.json(action);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body;
            await this.crudAction.delete({ id });
            res.json({ message: 'Action deleted' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const action = await this.crudAction.getById({ id });
            res.json(action);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getByServiceName(req, res) {
        try {
            const { name } = req.params;
            const actions = await this.crudAction.getByServiceName({ name });
            res.json(actions);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = ActionController;