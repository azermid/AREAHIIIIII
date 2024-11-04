class ServiceController {
    constructor(crudService) {
        this.crudService = crudService;
    }

    async get(req, res) {
        try {
            const reactions = await this.crudService.get();
            res.json(reactions);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = ServiceController;