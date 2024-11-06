const fetch = require('node-fetch');
const TriggerRepository = require('../repositories/TriggerRepository');
const ActionRepository = require('../repositories/ActionRepository');
const ReactionRepository = require('../repositories/ReactionRepository');
require('dotenv').config();

class GithubController {
    constructor(dbConnection) {
        this.triggerRepository = new TriggerRepository(dbConnection);
        this.actionRepository = new ActionRepository(dbConnection);
        this.reactionRepository = new ReactionRepository(dbConnection);
        this.initialize();
    }

    async initialize() {
        const actionId = await this.actionRepository.getIdByName('new_commit');
        const triggers = await this.triggerRepository.getByActionId(actionId);
        for (const trigger of triggers) {
            this.createWebhook(trigger);
        }
    }

    async watch(req, res) {
        try {
            const actionId = await this.actionRepository.getIdByName('new_commit');

            if (!req.body.commits) {
                res.status(200).send();
                return;
            }

            for (const trigger of await this.triggerRepository.getByActionId(actionId)) {
                const userResponse = await fetch(`https://api.github.com/user`, {
                    headers: {
                        'Authorization': `Bearer ${trigger.action_service_token}`,
                        'Content-Type': 'application/json'
                    }
                });
        
                if (!userResponse.ok) {
                    const userData = await userResponse.json();
                    throw new Error(`Error fetching user info: ${userData.message}`);
                }
        
                const userData = await userResponse.json();
                const username = userData.login; // This is the GitHub username

                if (req.body.repository.owner.login != username) {
                    continue;
                }

                const reactionName = await this.reactionRepository.getNameById(trigger.reaction_id);
                console.log(reactionName);
                const reaction = require(`../reactions/${reactionName}.js`);
                const newRefreshToken = await reaction(trigger.reaction_service_token, trigger.action_service_refresh_token, trigger.reaction_data, req.body);
                
                if (newRefreshToken) {
                    trigger.action_service_token = newRefreshToken;
                    await this.triggerRepository.update(trigger);
                }
            }

            res.status(200).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }


    async createWebhook(trigger) {
        const actionName = await this.actionRepository.getNameById(trigger.action_id);
        switch (actionName) {
            case 'new_commit':
                this.createPushWebhook(trigger);
                break;
            default:
                console.log(`No webhook creation logic for action: ${actionName}`);
            break;
        }
    }

    async createPushWebhook(trigger) {
        try {
            // Step 1: Get the authenticated user (owner) using the GitHub token
            const userResponse = await fetch(`https://api.github.com/user`, {
                headers: {
                    'Authorization': `Bearer ${trigger.action_service_token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!userResponse.ok) {
                const userData = await userResponse.json();
                throw new Error(`Error fetching user info: ${userData.message}`);
            }
    
            const userData = await userResponse.json();
            const username = userData.login; // This is the GitHub username
    
            // Step 2: Set up the webhook on the repository for that user
            const repoName = trigger.action_data.repository; // TODO: Replace with logic to get repo name from trigger, if needed
            const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/hooks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${trigger.action_service_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'web',
                    active: true,
                    events: ['push'],
                    config: {
                        url: process.env.GITHUB_WEBHOOK_URI,
                        content_type: 'json',
                        insecure_ssl: '0',
                        secret: '' // Add a webhook secret here if desired
                    }
                })
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log('Webhook created:', data);
            } else {
                console.error('Error creating webhook:', data);
            }
        } catch (error) {
            console.error('Error registering subscription:', error);
        }
    }
}

module.exports = GithubController;