const ActionRepository = require('../repositories/ActionRepository')
const TriggerRepository = require('../repositories/TriggerRepository')

async function pollOutlookForNewEmails(db, interval) {
    console.log('Polling Outlook for new emails...');
    const actionRepository = new ActionRepository(db);
    const triggerRepository = new TriggerRepository(db);

    const action_id = await actionRepository.getIdByName('new_email_outlook');
    const triggers = await triggerRepository.getByActionId(action_id);

    for (const trigger of triggers) {
        const response = await fetch(
            "https://graph.microsoft.com/v1.0/me/mailFolders/Inbox/messages",
            {
                headers: {
                    Authorization: `Bearer ${trigger.action_service_token}`,
                    "Content-Type": "application/json",
                }
            }
        );
        const data = await response.json();
        console.log('Data:', data);
        // server-1         |       receivedDateTime: '2024-10-29T19:17:01Z',
        // make sure to filter out emails that have already been processed by checking the receivedDateTime
        //process from now - interval
        const processFrom = new Date(Date.now() - interval);
        console.log('Process from:', processFrom);

        for (const email of data.value) {
            // check if email has already been processed (check date)
            // if not, process email
        }
    }
}

function startOutlookPollingWorker(interval, db) {
    setInterval(async () => {
        console.log('Polling Outlook for new emails...');
        await pollOutlookForNewEmails(db, interval);
    }, interval);
}

module.exports = { startOutlookPollingWorker };