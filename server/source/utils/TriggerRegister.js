const gmailController = require('../controllers/GmailController');
const githubController = require('../controllers/GithubController');
const twitchController = require('../controllers/TwitchController');

class TriggerRegister {
    constructor(dbConnection) {
        this.gmailController = new gmailController(dbConnection);
        this.githubController = new githubController(dbConnection);
        this.twitchController = new twitchController(dbConnection);
    }

    async registerNewTrigger(trigger) {
        this.gmailController.createWebhook(trigger);
        this.githubController.createWebhook(trigger);
        this.twitchController.createWebhook(trigger);
    }
}

module.exports = TriggerRegister;