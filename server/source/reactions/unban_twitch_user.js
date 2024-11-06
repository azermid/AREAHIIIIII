const fetch = require('node-fetch');

async function unban_twitch_user(token, refreshToken, data, additionalData) {
    const { name } = data; // `name` is the user to unban

    try {
        // Fetch the broadcaster (moderator) ID using the token's authenticated user
        const broadcasterResponse = await fetch(`https://api.twitch.tv/helix/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID
            }
        });

        if (!broadcasterResponse.ok) {
            const errorData = await broadcasterResponse.json();
            throw new Error(`Error fetching broadcaster ID: ${errorData.message}`);
        }

        const broadcasterData = await broadcasterResponse.json();
        if (!broadcasterData.data || broadcasterData.data.length === 0) {
            throw new Error('Broadcaster not found using provided token');
        }
        const broadcasterId = broadcasterData.data[0].id;

        // Fetch the user ID of the user to be unbanned
        const userResponse = await fetch(`https://api.twitch.tv/helix/users?login=${name}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID
            }
        });

        if (!userResponse.ok) {
            const errorData = await userResponse.json();
            throw new Error(`Error fetching user ID: ${errorData.message}`);
        }

        const userData = await userResponse.json();
        if (!userData.data || userData.data.length === 0) {
            throw new Error(`User not found: ${name}`);
        }
        const userIdToUnban = userData.data[0].id;

        // Unban the user
        const unbanResponse = await fetch(`https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${broadcasterId}&moderator_id=${broadcasterId}&user_id=${userIdToUnban}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID,
                'Content-Type': 'application/json'
            }
        });

        if (!unbanResponse.ok) {
            const unbanErrorData = await unbanResponse.text(); // Get the response text for error debugging
            throw new Error(`Error unbanning user: ${unbanErrorData}`);
        }

        console.log(`User ${name} has been unbanned from channel with broadcaster ID ${broadcasterId}.`);
    } catch (error) {
        console.error("Error unbanning user on Twitch:", error);
        throw error;
    }
}

module.exports = unban_twitch_user;
