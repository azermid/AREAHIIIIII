const express = require('express');
const GmailController = require('../controllers/GmailController');

module.exports = (dbConnection) => {
    const router = express.Router();

    const gmailController = new GmailController(dbConnection);

    router.post('/gmail/register', (req, res) => gmailController.register(req, res));
    router.post('/gmail', (req, res) => gmailController.watch(req, res));

    return router;
}