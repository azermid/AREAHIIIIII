const express = require('express');
const ActionController = require('../controllers/ActionController');
const CrudAction = require('../useCases/CrudAction');
const ActionRepository = require('../repositories/ActionRepository')
const checkToken = require('../middleware/CheckToken');

module.exports = (dbConnection) => {
    const router = express.Router();

    const actionRepository = new ActionRepository(dbConnection);
    const crudAction = new CrudAction(actionRepository);
    const actionController = new ActionController(crudAction);

    router.post('/create', checkToken, (req, res) => actionController.create(req, res));
    router.get('/get', checkToken, (req, res) => actionController.get(req, res));
    router.patch('/update', checkToken, (req, res) => actionController.update(req, res));
    router.delete('/delete', checkToken, (req, res) => actionController.delete(req, res));
    router.get('/get/:id', checkToken, (req, res) => actionController.getById(req, res));
    router.get('/get/service/:name', checkToken, (req, res) => actionController.getByServiceName(req, res));
    // router.get('/get/service/:id', (req, res) => actionsController.getByServiceId(req, res));

    return router;
}