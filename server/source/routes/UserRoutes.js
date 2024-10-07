const express = require('express');
const UserController = require('../controllers/UserController');
const AuthenticateUser = require('../useCases/AuthenticateUser');
const RegisterUser = require('../useCases/RegisterUser');
const UserRepository = require('../repositories/UserRepository');
const AuthService = require('../services/AuthService');
const ThirdPartyLogin = require('../useCases/ThirdPartyLogin');
const VerifyToken = require('../useCases/VerifyToken');

module.exports = (dbConnection) => {
    const router = express.Router();

    const userRepository = new UserRepository(dbConnection);
    const authService = new AuthService();
    const authenticateUser = new AuthenticateUser(userRepository, authService);
    const registerUser = new RegisterUser(userRepository, authService);
    const thirdPartyLogin = new ThirdPartyLogin(userRepository, authService);
    const verifyToken = new VerifyToken(authService);
    const userController = new UserController(authenticateUser, registerUser, thirdPartyLogin, verifyToken);

    router.post('/login', (req, res) => userController.login(req, res));
    router.post('/register', (req, res) => userController.register(req, res));
    router.post('/third-party-login', (req, res) => userController.thirdPartyLoginOrRegister(req, res));
    router.post('/verify-token', (req, res) => userController.verify(req, res));

    return router;
};
