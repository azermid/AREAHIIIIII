const express = require('express');
const TriggerController = require('../controllers/TriggerController');
const CrudTrigger = require('../useCases/CrudTrigger');
const TriggerRepository = require('../repositories/TriggerRepository')
const checkToken = require('../middleware/CheckToken');

module.exports = (dbConnection) => {
    const router = express.Router();

    const triggerRepository = new TriggerRepository(dbConnection);
    const crudTrigger = new CrudTrigger(triggerRepository);
    const triggerController = new TriggerController(crudTrigger);

    router.post('/create', checkToken, (req, res) => triggerController.create(req, res));
    router.get('/get', checkToken, (req, res) => triggerController.get(req, res));
    router.patch('/update', checkToken, (req, res) => triggerController.update(req, res));
    router.delete('/delete', checkToken, (req, res) => triggerController.delete(req, res));
    router.get('/get/:id', checkToken, (req, res) => triggerController.getById(req, res));
    router.get('/get/workspace/:workspace_id', checkToken, (req, res) => triggerController.getByWorkspaceId(req, res));
    router.post('/add', checkToken, (req, res) => triggerController.add(req, res));

    return router;
}