const express = require('express');
const WorkspaceController = require('../controllers/WorkspaceController');
const CrudWorkspace = require('../useCases/CrudWorkspace');
const WorkspaceRepository = require('../repositories/WorkspaceRepository')
const AuthService = require('../services/AuthService');
const checkToken = require('../middleware/CheckToken');

module.exports = (dbConnection) => {
    const router = express.Router();

    const workspaceRepository = new WorkspaceRepository(dbConnection);
    const authService = new AuthService();
    const crudWorkspace = new CrudWorkspace(workspaceRepository, authService);
    const workspaceController = new WorkspaceController(crudWorkspace);

    router.post('/create', checkToken, (req, res) => workspaceController.create(req, res));
    router.get('/get', checkToken, (req, res) => workspaceController.get(req, res));
    router.put('/update', checkToken, (req, res) => workspaceController.update(req, res));
    router.delete('/delete', checkToken, (req, res) => workspaceController.delete(req, res));
    router.get('/get/:id', checkToken, (req, res) => workspaceController.getById(req, res));
    router.get('/get/user/:id', checkToken, (req, res) => workspaceController.getByUserId(req, res));

    return router;
};
