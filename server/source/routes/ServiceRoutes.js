const express = require('express');
const GetServices = require('../useCases/GetServices');
const GetActions = require('../useCases/GetActions');
const GetReactions = require('../useCases/GetReactions');
const ServiceController = require('../controllers/ServiceController');
const ServiceRepository = require('../repositories/ServiceRepository');
const ActionRepository = require('../repositories/ActionRepository');
const ReactionRepository = require('../repositories/ReactionRepository');

module.exports = (dbConnection) => {
    const router = express.Router();

    const serviceRepository = new ServiceRepository(dbConnection);
    const actionRepository = new ActionRepository(dbConnection);
    const reactionRepository = new ReactionRepository(dbConnection);

    const getServices = new GetServices(serviceRepository);
    const getActions = new GetActions(actionRepository);
    const getReactions = new GetReactions(reactionRepository);

    const serviceController = new ServiceController(getServices, getActions, getReactions);

    router.get('/services', (req, res) => serviceController.getAllServices(req, res));
    router.get('/services/:serviceId/actions', (req, res) => serviceController.getActionsByServiceId(req, res));
    router.get('/actions/:actionId/reactions', (req, res) => serviceController.getReactionsByActionId(req, res));

    return router;
};
