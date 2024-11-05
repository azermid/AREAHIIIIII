const ActionRepository = require('../repositories/ActionRepository')
const ReactionRepository = require('../repositories/ReactionRepository')
const TriggerRepository = require('../repositories/TriggerRepository')

async function pollOutlookForNewEmails(db, interval) {
    console.log('Polling Outlook for new emails...');
    const actionRepository = new ActionRepository(db);
    const reactionRepository = new ReactionRepository(db);
    const triggerRepository = new TriggerRepository(db);

    const action_id = await actionRepository.getIdByName('new_email_outlook');
    const triggers = await triggerRepository.getByActionId(action_id);

    for (const trigger of triggers) {
        // console.log('Processing trigger');
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
            console.error('Error:', data.error);
            // Should refresh token here
            return;
        }
        const processFrom = new Date(Date.now() - interval);
        console.log('Process from:', processFrom);

        for (const email of data.value) {
            // console.log('Processing an email');
            if (email.receivedDateTime < processFrom.toISOString()) {
                console.log('Skipping email cause of time');
                continue;
            }
            // console.log('Processing email:', email);
            const action_data = trigger.action_data;
            if (email.from.emailAddress.address !== action_data.from) {
                console.log('Skipping email cause of from');
                continue;
            }
            console.log("email matches trigger");
            const reactionName = await reactionRepository.getNameById(trigger.reaction_id);
            // console.log("reaction name", reactionName);
            // reaction
            const reaction = require(`../reactions/${reactionName}.js`);
            const newRefreshToken = await reaction(trigger.reaction_service_token, trigger.reaction_service_refresh_token, trigger.reaction_data, email);
            if (newRefreshToken) {
                trigger.reaction_service_token = newRefreshToken;
                await triggerRepository.update(trigger);
            }
        }
        console.log('Finished processing trigger');
    }
}

function startOutlookPollingWorker(interval, db) {
    setInterval(async () => {
        await pollOutlookForNewEmails(db, interval);
    }, interval);
}

module.exports = { startOutlookPollingWorker };