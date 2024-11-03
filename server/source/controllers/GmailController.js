const { PubSub } = require('@google-cloud/pubsub');
const fetch = require('node-fetch');
const TriggerRepository = require('../repositories/TriggerRepository');

class Message {
    constructor(data) {
        const dataBuffer = Buffer.from(data, 'base64');
        this.data = JSON.parse(dataBuffer.toString());
    }
}

async function getRecentHistory(accessToken, userId, historyId) {
    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${userId}/history?startHistoryId=${historyId}&historyTypes=messageAdded`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to retrieve history: ${errorData.error.message}`);
    }

    const data = await response.json();
    return data.history || []; // Returns an array of history records
}

class GmailController {
    constructor(dbConnection) {
        // this.pubsub = new PubSub();
        // this.subscriptionName = 'projects/area-436514/subscriptions/new_email';
        this.triggerRepository = new TriggerRepository(dbConnection);
        this.initialize();
    }

    async initialize() {
        const triggers = await this.triggerRepository.getByActionId(1);
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
                console.error('Error registering subscription:', error);
            }
        }
    }

    async watch(req, res) {
        try {
            
            const message = new Message(req.body.message.data);

            for (const trigger of await this.triggerRepository.getByActionId(1)) {
                if (trigger.action_data.user != message.data.emailAddress) {
                    continue;
                }
                console.log('Trigger detected:', trigger.id);
            }
            console.log('Watch event: ', message.data);
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