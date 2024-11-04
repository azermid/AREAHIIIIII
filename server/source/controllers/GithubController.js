const fetch = require('node-fetch');
const TriggerRepository = require('../repositories/TriggerRepository');
const ActionRepository = require('../repositories/ActionRepository');
require('dotenv').config();

async function createWebhook(repoName, owner, accessToken) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/hooks`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'web',
            active: true,
            events: ['push'],
            config: {
                url: 'https://yourapp.com/github-webhook',
                content_type: 'json',
                secret: 'YOUR_WEBHOOK_SECRET'  // Optional: to verify GitHub webhook payloads
            }
        })
    });

    const data = await response.json();
    if (response.ok) {
        console.log('Webhook created:', data);
    } else {
        console.error('Error creating webhook:', data);
    }
}

class GithubController {
    constructor(dbConnection) {
        // this.pubsub = new PubSub();
        // this.subscriptionName = 'projects/area-436514/subscriptions/new_email';
        this.triggerRepository = new TriggerRepository(dbConnection);
        this.actionRepository = new ActionRepository(dbConnection);
        this.initialize();
    }

    async initialize() {
        const actionId = await this.actionRepository.getIdByName('new_commit');
        const triggers = await this.triggerRepository.getByActionId(actionId);
        for (const trigger of triggers) {
            try {
                const response = await fetch(`https://api.github.com/repos/AreaMaster-F/TestArea/hooks`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `token ${trigger.action_service_token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'test',
                        active: true,
                        events: ['push'],
                        config: {
                            url: process.env.GITHUB_WEBHOOK_URI,
                            content_type: 'json',
                            insecure_ssl: '1',
                        }
                    })
                });
            
                const data = await response.json();
                if (response.ok) {
                    console.log('Webhook created:', data);
                } else {
                    console.error('Error creating webhook:', data);
                }
            //     const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/watch', {
            //         method: 'POST',
            //         headers: {
            //             'Authorization': `Bearer ${trigger.action_service_token}`,
            //             'Content-Type': 'application/json'
            //         },
            //         body: JSON.stringify({
            //             labelIds: ["INBOX"],
            //             topicName: "projects/area-436514/topics/new_email"
            //         })
            //     });
            //     if (!response.ok) {
            //         throw new Error(`Failed to register: ${response.statusText}`);
            //     }
            //     const data = await response.json();
            //     console.log('Watch response:', data);
            } catch (error) {
                // TODO:
                // REFRESH TOKEN
                console.error('Error registering subscription:', error);
            }
        }
    }

    async watch(req, res) {
        try {
            console.log('Received request:', req.body);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = GithubController;