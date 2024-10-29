class ReactionController {
    constructor(crudReaction) {
        this.crudReaction = crudReaction;
    }

    async create(req, res) {
        try {
            const { title, description, service_id } = req.body;
            const reaction = await this.crudReaction.create({ title, description, service_id });
            res.json(reaction);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async get(req, res) {
        try {
            const reactions = await this.crudReaction.get();
            res.json(reactions);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id, title, description, service_id } = req.body;
            const reaction = await this.crudReaction.update({ id, title, description, service_id });
            res.json(reaction);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body;
            await this.crudReaction.delete({ id });
            res.json({ message: 'Reaction deleted' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const reaction = await this.crudReaction.getById({ id });
            res.json(reaction);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getByServiceName(req, res) {
        try {
            const { name } = req.params;
            const reactions = await this.crudReaction.getByServiceName({ name });
            res.json(reactions);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = ReactionController;