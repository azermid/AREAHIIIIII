const express = require('express');
const ReactionController = require('../controllers/ReactionController');
const CrudReaction = require('../useCases/CrudReaction');
const ReactionRepository = require('../repositories/ReactionRepository')
const checkToken = require('../middleware/CheckToken');

module.exports = (dbConnection) => {
    const router = express.Router();

    const reactionRepository = new ReactionRepository(dbConnection);
    const crudReaction = new CrudReaction(reactionRepository);
    const reactionController = new ReactionController(crudReaction);

    router.post('/create', checkToken, (req, res) => reactionController.create(req, res));
    router.get('/get', checkToken, (req, res) => reactionController.get(req, res));
    router.patch('/update', checkToken, (req, res) => reactionController.update(req, res));
    router.delete('/delete', checkToken, (req, res) => reactionController.delete(req, res));
    router.get('/get/:id', checkToken, (req, res) => reactionController.getById(req, res));
    router.get('/get/service/:name', checkToken, (req, res) => reactionController.getByServiceName(req, res));
    router.get('/get/id/:name', checkToken, (req, res) => reactionController.getIdByName(req, res));
    // router.get('/get/service/:id', (req, res) => reactionController.getByServiceId(req, res));

    return router;
}