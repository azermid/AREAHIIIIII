const { PubSub } = require('@google-cloud/pubsub');
const fetch = require('node-fetch');

class Message {
    constructor(data) {
        const dataBuffer = Buffer.from(data, 'base64');
        this.data = JSON.parse(dataBuffer.toString());
    }
}

class GmailController {
    constructor() {
        this.pubsub = new PubSub();
        this.subscriptionName = 'projects/area-436514/subscriptions/new_email';
    }

    async watch(req, res) {
        try {
            const message = new Message(req.body.message.data);
            console.log(message.data);
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