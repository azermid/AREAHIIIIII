class WorkspaceController {
    constructor(crudWorkspace) {
        this.crudWorkspace = crudWorkspace;
    }

    async create(req, res) {
        try {
            const { name, userId } = req.body;
            const workspace = await this.crudWorkspace.create({ name, userId });
            res.json(workspace);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async get(req, res) {
        try {
            const workspaces = await this.crudWorkspace.get();
            res.json(workspaces);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id, name, userId, actionTitle, reactionTitle, actionData, reactionData, actionServiceTitle, reactionServiceTitle, actionServiceToken, reactionServiceToken, actionServiceRefreshToken, reactionServiceRefreshToken } = req.body;
            const workspace = await this.crudWorkspace.update({ id, name, userId, actionTitle, reactionTitle, actionData, reactionData, actionServiceTitle, reactionServiceTitle, actionServiceToken, reactionServiceToken, actionServiceRefreshToken, reactionServiceRefreshToken });
            res.json(workspace);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body;
            await this.crudWorkspace.delete({ id });
            res.json({ message: 'Workspace deleted' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const workspace = await this.crudWorkspace.getById({ id });
            res.json(workspace);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getByUserId(req, res) {
        try {
            const { id } = req.params;
            const workspaces = await this.crudWorkspace.getByUserId({ id });
            res.json(workspaces);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = WorkspaceController;