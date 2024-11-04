const express = require('express');
const GmailController = require('../controllers/GmailController');
const GithubController = require('../controllers/GithubController');

module.exports = (dbConnection) => {
    const router = express.Router();

    const gmailController = new GmailController(dbConnection);
    const githubController = new GithubController(dbConnection);

    router.post('/gmail', (req, res) => gmailController.watch(req, res));

    router.post('/github', (req, res) => githubController.watch(req, res));
    return router;
}