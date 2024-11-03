
async function pollOutlookForNewEmails(db) {
    console.log('Polling Outlook for new emails...');
}

function startOutlookPollingWorker(interval, db) {
    setInterval(async () => {
        console.log('Polling Outlook for new emails...');
        await pollOutlookForNewEmails(db);
    }, interval);
}

module.exports = { startOutlookPollingWorker };