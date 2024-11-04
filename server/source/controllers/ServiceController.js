class ServiceController {
    constructor(crudService) {
        this.crudService = crudService;
    }

    async get(req, res) {
        try {
            const services = await this.crudService.get();
            res.json(services);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = ServiceController;