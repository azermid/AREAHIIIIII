const fetch = require('node-fetch');

class TwitchAuth {
    constructor(thirdPartyLogin) {
        this.thirdPartyLogin = thirdPartyLogin;
        this.clientId = process.env.TWITCH_CLIENT_ID;
        this.clientSecret = process.env.TWITCH_CLIENT_SECRET;
        this.redirectURI = null;
        this.serviceName = 'AreaWebEpitech';
        this.serviceType = 'OAuth';
    }

    getAuthUrl() {
        const scopes = [
            'analytics:read:extensions',
            'analytics:read:games',
            'bits:read',
            'channel:edit:commercial',
            'channel:manage:broadcast',
            'channel:manage:moderators',
            'channel:manage:polls',
            'channel:manage:predictions',
            'channel:manage:redemptions',
            'channel:manage:videos',
            'channel:read:editors',
            'channel:read:goals',
            'channel:read:hype_train',
            'channel:read:polls',
            'channel:read:predictions',
            'channel:read:redemptions',
            'channel:read:stream_key',
            'channel:read:subscriptions',
            'clips:edit',
            'moderation:read',
            'moderator:manage:automod',
            'moderator:manage:banned_users',
            'moderator:manage:blocked_terms',
            'moderator:manage:chat_messages',
            'moderator:manage:chat_settings',
            'moderator:manage:shield_mode',
            'moderator:manage:shoutouts',
            'moderator:read:blocked_terms',
            'moderator:read:chat_settings',
            'moderator:read:shield_mode',
            'moderator:read:shoutouts',
            'user:edit',
            'user:edit:follows',
            'user:manage:blocked_users',
            'user:read:blocked_users',
            'user:read:broadcast',
            'user:read:email',
            'user:read:follows',
            'user:read:subscriptions',
            'channel:moderate',
            'chat:edit',
            'chat:read',
            'whispers:read',
            'whispers:edit'
        ].join(' ');

        const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${this.clientId}` +
                        `&redirect_uri=${encodeURIComponent(process.env.TWITCH_REDIRECT_URI)}` +
                        `&response_type=code&scope=${encodeURIComponent(scopes)}`;
        return authUrl;
    }

    async getTwitchTokens(code) {
        const tokenUrl = `https://id.twitch.tv/oauth2/token`;
        
        const params = new URLSearchParams({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: process.env.TWITCH_REDIRECT_URI
        });

        try {
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            });

            if (!response.ok) {
                throw new Error(`Error fetching tokens: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error getting Twitch tokens:", error);
            throw error;
        }
    }
}

module.exports = TwitchAuth;
