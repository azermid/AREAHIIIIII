class ServiceController {
    constructor(getServices, getActions, getReactions) {
        this.getServices = getServices;
        this.getActions = getActions;
        this.getReactions = getReactions;
    }

    async getAllServices(req, res) {
        try {
            const services = await this.getServices.execute();
            res.json(services);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getActionsByServiceId(req, res) {
        try {
            const { serviceId } = req.params;
            const actions = await this.getActions.execute(serviceId);
            return res.json(actions);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getReactionsByActionId(req, res) {
        try {
            const { actionId } = req.params;
            const reactions = await this.getReactions.execute(actionId);
            return res.json(reactions);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = ServiceController;
