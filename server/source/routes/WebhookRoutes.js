const express = require('express');
const GmailController = require('../controllers/GmailController');
const GithubController = require('../controllers/GithubController');
const TwitchController = require('../controllers/TwitchController');

module.exports = (dbConnection) => {
    const router = express.Router();

    const gmailController = new GmailController(dbConnection);
    const githubController = new GithubController(dbConnection);
    const twitchController = new TwitchController(dbConnection);

    router.post('/gmail', (req, res) => gmailController.watch(req, res));
    router.post('/github', (req, res) => githubController.watch(req, res));
    router.post('/twitch', (req, res) => twitchController.watch(req, res));

    return router;
}