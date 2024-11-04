class CrudService {
    constructor(serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    async get() {
        return await this.serviceRepository.get();
    }
}

module.exports = CrudService;