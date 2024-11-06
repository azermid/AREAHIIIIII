const fetch = require('node-fetch');

async function ban_twitch_user(token, refreshToken, data, additionalData) {
    const { name } = data; // `name` is now the user to ban

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

        // Fetch the user ID of the user to be banned
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
        const userIdToBan = userData.data[0].id;

        // Ban the user
        const banResponse = await fetch(`https://api.twitch.tv/helix/moderation/bans`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                broadcaster_id: broadcasterId,
                moderator_id: broadcasterId, // Using the broadcaster as the moderator
                data: {
                    user_id: userIdToBan,
                    reason: "Banned by Area."
                }
            })
        });

        const banData = await banResponse.json();
        if (!banResponse.ok) {
            throw new Error(`Error banning user: ${banData.message}`);
        }

        console.log(`User ${name} has been banned from channel with broadcaster ID ${broadcasterId}.`);
    } catch (error) {
        console.error("Error banning user on Twitch:", error);
        throw error;
    }
}

module.exports = ban_twitch_user;