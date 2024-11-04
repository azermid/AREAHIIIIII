const fetch = require('node-fetch');
const TriggerRepository = require('../repositories/TriggerRepository');
const ActionRepository = require('../repositories/ActionRepository');
const {google} = require('googleapis');
const gmail = google.gmail('v1');
require('dotenv').config();

const authClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

async function getSendersOfRecentEmails(auth) {
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
        this.initialize();
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
                // TODO:
                // REFRESH TOKEN
                console.error('Error registering subscription:', error);
            }
        }
    }

    async watch(req, res) {
        try {
            // console.log('Received request:', req);
            const message = new Message(req.body.message.data);
            const actionId = await this.actionRepository.getIdByName('new_email_gmail');

            for (const trigger of await this.triggerRepository.getByActionId(actionId)) {
                if (trigger.action_data.user != message.data.emailAddress)
                    continue;
                authClient.setCredentials({
                    access_token: trigger.action_service_token,
                });
                const sender = await getSendersOfRecentEmails(authClient);
                const match = sender.match(/<([^>]+)>/);
                const senderEmail = match ? match[1] : sender;
                console.log(senderEmail)
                if (trigger.action_data.from != senderEmail)
                    continue;
                //TODO call reaction
                console.log("email matches trigger");
            }
            res.json({ message: 'Successfully acknowledged messages.' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
    async register(req, res) {
        const token = 'ya29.a0AeDClZBw62nNVJPPFtoJ_juChvSt8UTN97mVkxWOVMoQGMBu6dMi8-7BCDY4tcW8cxticd9HsxIMrKmlSjhlZbDaMGdXETL8ScM1W5x4onQ1GHy-b3fFdRDbE6oe13-iraE5qiKJFUgPSzGxnoy-IPR4eN2iXv5CIdHTyISgaCgYKATYSARISFQHGX2MiVi3LGV7PM1sSIhbWMmaGoQ0175';

        const watchUrl = 'https://gmail.googleapis.com/gmail/v1/users/me/watch';

        const requestBody = {
            labelIds: ["INBOX"],
            topicName: "projects/area-436514/topics/new_email"
        };

        try {
            const response = await fetch(watchUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Failed to register: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Watch response:', data);
            
            res.json({ message: 'Successfully registered subscription.', data });
        } catch (error) {
            console.error('Error registering subscription:', error);
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = GmailController;