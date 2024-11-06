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
            'moderator:manage:banned_users',
            'user:read:email'
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
