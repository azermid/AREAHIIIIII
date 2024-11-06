const fetch = require('node-fetch');
const TriggerRepository = require('../repositories/TriggerRepository');
const ActionRepository = require('../repositories/ActionRepository');
const ReactionRepository = require('../repositories/ReactionRepository');
require('dotenv').config();

class TwitchController {
    constructor(dbConnection) {
        this.triggerRepository = new TriggerRepository(dbConnection);
        this.actionRepository = new ActionRepository(dbConnection);
        this.reactionRepository = new ReactionRepository(dbConnection);
        this.initialize();
    }

    async initialize() {
        const actionId = await this.actionRepository.getIdByName('twitch_broadcaster_online');
        const triggers = await this.triggerRepository.getByActionId(actionId);
        for (const trigger of triggers) {
            this.createWebhook(trigger);
        }
    }

    async watch(req, res) {
        // Handling Twitch's EventSub verification challenge
        if (req.headers['twitch-eventsub-message-type'] === 'webhook_callback_verification') {
            return res.status(200).send(req.body.challenge);
        }

        // Handling the actual event
        if (req.body && req.body.subscription && req.body.event) {
            const actionId = await this.actionRepository.getIdByName('twitch_broadcaster_online');

            for (const trigger of await this.triggerRepository.getByActionId(actionId)) {
                if (req.body.event.broadcaster_user_name != trigger.action_data.name)
                    continue;
                console.log('Received Twitch event:', req.body);
                const reactionName = await this.reactionRepository.getNameById(trigger.reaction_id);
                const reaction = require(`../reactions/${reactionName}.js`);
                const newRefreshToken = await reaction(trigger.reaction_service_token, trigger.action_service_refresh_token, trigger.reaction_data, null);
                if (newRefreshToken) {
                    trigger.action_service_token = newRefreshToken;
                    await this.triggerRepository.update(trigger);
                }
            }
            res.status(200).send();
        } else {
            res.status(400).json({ error: 'Invalid request' });
        }
    }

    async createWebhook(trigger) {
        const actionName = await this.actionRepository.getNameById(trigger.action_id);
        if (actionName === 'twitch_broadcaster_online') {
            await this.createStreamOnlineWebhook(trigger);
        } else {
            console.log(`No webhook creation logic for action: ${actionName}`);
        }
    }

    async createStreamOnlineWebhook(trigger) {
        try {
            const appAccessToken = await this.getAppAccessToken();
            if (!appAccessToken) throw new Error('Failed to obtain App Access Token');
    
            const broadcasterId = await this.getBroadcasterId(trigger.action_data.name, appAccessToken);
            if (!broadcasterId) throw new Error('Broadcaster ID not found.');
    
            const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${appAccessToken}`,
                    'Client-Id': process.env.TWITCH_CLIENT_ID,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'stream.online',
                    version: '1',
                    condition: {
                        broadcaster_user_id: broadcasterId
                    },
                    transport: {
                        method: 'webhook',
                        callback: process.env.TWITCH_WEBHOOK_URI,
                        secret: process.env.TWITCH_CLIENT_SECRET
                    }
                })
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log('Webhook created:', data);
            } else {
                console.error('Error creating Twitch webhook:', data);
            }
        } catch (error) {
            console.error('Error registering Twitch subscription:', error);
        }
    }    

    async getBroadcasterId(broadcasterName, token) {
        try {
            const response = await fetch(`https://api.twitch.tv/helix/users?login=${broadcasterName}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Client-Id': process.env.TWITCH_CLIENT_ID
                }
            });

            const data = await response.json();
            if (response.ok && data.data.length > 0) {
                return data.data[0].id;
            } else {
                console.error('Error fetching broadcaster ID:', data);
                return null;
            }
        } catch (error) {
            console.error('Error in getBroadcasterId:', error);
            return null;
        }
    }

    async getAppAccessToken() {
        const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`, {
            method: 'POST'
        });
        const data = await response.json();
        if (response.ok) {
            return data.access_token;
        } else {
            console.error('Error fetching App Access Token:', data);
            return null;
        }
    }
}

module.exports = TwitchController;
