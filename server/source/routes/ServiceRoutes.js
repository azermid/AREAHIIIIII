const express = require('express');
const ServiceController = require('../controllers/ServiceController');
const ServiceRepository = require('../repositories/ServiceRepository');
const CrudService = require('../useCases/CrudService');
const checkToken = require('../middleware/CheckToken');

module.exports = (dbConnection) => {
    const router = express.Router();

    const serviceRepository = new ServiceRepository(dbConnection);
    const crudService = new CrudService(serviceRepository);
    const serviceController = new ServiceController(crudService);

    router.get('/get', checkToken, (req, res) => serviceController.get(req, res));

    return router;
}