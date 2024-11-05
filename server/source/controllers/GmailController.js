const fetch = require('node-fetch');
const TriggerRepository = require('../repositories/TriggerRepository');
const ActionRepository = require('../repositories/ActionRepository');
const ReactionRepository = require('../repositories/ReactionRepository');
const {google} = require('googleapis');
const gmail = google.gmail('v1');
require('dotenv').config();

const authClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

class Message {
    constructor(data) {
        const dataBuffer = Buffer.from(data, 'base64');
        this.data = JSON.parse(dataBuffer.toString());
    }
}

class GmailController {
    constructor(dbConnection) {
        // this.pubsub = new PubSub();
        // this.subscriptionName = 'projects/area-436514/subscriptions/new_email';
        this.triggerRepository = new TriggerRepository(dbConnection);
        this.actionRepository = new ActionRepository(dbConnection);
        this.reactionRepository = new ReactionRepository(dbConnection);
        this.lastProcessedEmail = null;
        this.initialize();
    }

    async getSendersOfRecentEmails(auth) {
        try {
            // Step 1: Get the list of recent messages from the inbox
            const listResponse = await gmail.users.messages.list({
                userId: 'me',
                labelIds: ['INBOX'],
                maxResults: 1,  // You can adjust this number
                auth: auth,
            });
    
            // Extract message IDs from the list response
            const messageIds = listResponse.data.messages.map(message => message.id);
    
            // Step 2: Retrieve each message's metadata to find the "From" header
            for (const messageId of messageIds) {
                if (messageId === this.lastProcessedEmail) {
                    console.log('Same email as before. doing nothing...');
                    return 'Unknown sender';
                }
                this.lastProcessedEmail = messageId;
                const messageResponse = await gmail.users.messages.get({
                    userId: 'me',
                    id: messageId,
                    format: 'metadata',
                    metadataHeaders: ['From'],
                    auth: authClient,
                });
    
                // Extract the "From" header to get sender information
                const headers = messageResponse.data.payload.headers;
                const fromHeader = headers.find(header => header.name === 'From');
                const sender = fromHeader ? fromHeader.value : 'Unknown sender';
    
                return sender;
            }
        } catch (error) {
            console.error('Error fetching emails:', error);
        }
    }

    async initialize() {
        const actionId = await this.actionRepository.getIdByName('new_email_gmail');
        const triggers = await this.triggerRepository.getByActionId(actionId);
        for (const trigger of triggers) {
            try {
                const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/watch', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${trigger.action_service_token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        labelIds: ["INBOX"],
                        topicName: "projects/area-436514/topics/new_email"
                    })
                });
                if (!response.ok) {
                    throw new Error(`Failed to register: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Watch response:', data);
            } catch (error) {
                console.log('Invalid credentials. Refreshing token...');
                const refreshToken = trigger.action_service_refresh_token;
                const response = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        client_id: process.env.GOOGLE_CLIENT_ID,
                        client_secret: process.env.GOOGLE_CLIENT_SECRET,
                        refresh_token: refreshToken,
                        grant_type: 'refresh_token'
                    })
                });
                if (!response.ok) {
                    console.error('Failed to refresh token:', response.statusText);
                    continue;
                }
                const data = await response.json();
                console.log('Refresh token response:', data);
                trigger.action_service_token = data.access_token;
                await this.triggerRepository.update(trigger);
                // TODO: need to re-register the subscription then
                console.error('Error registering subscription:', error);
            }
        }
    }

    async watch(req, res) {
        try {
            // console.log('Received request:', req);
            const message = new Message(req.body.message.data);
            const actionId = await this.actionRepository.getIdByName('new_email_gmail');
            // console.log('actionId:', actionId);

            for (const trigger of await this.triggerRepository.getByActionId(actionId)) {
                if (trigger.action_data.user != message.data.emailAddress)
                    continue;
                authClient.setCredentials({
                    access_token: trigger.action_service_token,
                });
                const sender = await this.getSendersOfRecentEmails(authClient);
                const match = sender.match(/<([^>]+)>/);
                const senderEmail = match ? match[1] : sender;
                // console.log(senderEmail)
                if (trigger.action_data.from != senderEmail)
                    continue;
                //TODO get email from message.data to give as additionalData to reaction
                const reactionName = await this.reactionRepository.getNameById(trigger.reaction_id);
                const reaction = require(`../reactions/${reactionName}.js`);
                const newRefreshToken = await reaction(trigger.action_service_token, trigger.action_service_refresh_token, trigger.reaction_data, message.data);
                if (newRefreshToken) {
                    trigger.action_service_token = newRefreshToken;
                    await this.triggerRepository.update(trigger);
                }
            }
            res.status(200).send('OK');
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = GmailController;