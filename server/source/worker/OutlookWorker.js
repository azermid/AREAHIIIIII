const ActionRepository = require('../repositories/ActionRepository')
const ReactionRepository = require('../repositories/ReactionRepository')
const TriggerRepository = require('../repositories/TriggerRepository')

async function pollOutlookForNewEmails(db, interval) {
    // console.log('Polling Outlook for new emails...');
    const actionRepository = new ActionRepository(db);
    const reactionRepository = new ReactionRepository(db);
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
        if (data.error) {
            // console.error('Error:', data.error);
            return;
        }
        const processFrom = new Date(Date.now() - interval);
        // console.log('Process from:', processFrom);

        for (const email of data.value) {
            if (email.receivedDateTime < processFrom.toISOString()) {
                // console.log('Skipping email:', email);
                continue;
            }
            // console.log('Processing email:', email);
            const action_data = trigger.action_data;
            if (email.from.emailAddress.address !== action_data.from) {
                // console.log('Skipping email:', email);
                continue;
            }
            console.log("email matches trigger");
            const reactionName = await reactionRepository.getNameById(trigger.reaction_id);
            console.log("reaction name", reactionName);
            //send_email_outlook
            const reaction = require(`../reactions/${reactionName}.js`);
            await reaction(trigger.action_service_token, trigger.reaction_data);
            //do reaction
        }
    }
}

function startOutlookPollingWorker(interval, db) {
    setInterval(async () => {
        await pollOutlookForNewEmails(db, interval);
    }, interval);
}

module.exports = { startOutlookPollingWorker };