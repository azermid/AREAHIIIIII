const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

class GoogleAuthService {
    constructor(thirdPartyLogin) {
        this.oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        this.redirectURI = null;
        this.thirdPartyLogin = thirdPartyLogin;
        this.serviceName = null;
        this.serviceType = null;
        // this.action_token = null;
        // this.action_refresh_token = null;
        // this.reaction_token = null;
        // this.reaction_refresh_token = null;
    }

    getAuthUrl() {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
            prompt: 'consent',
        });
    }

    // scopes: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send', 'openid', 'profile', 'email'],
    getGmailAuthUrl() {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send', 'openid', 'profile', 'email'],
            // scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
            prompt: 'consent',
        });
    }

    async getGoogleUser(code) {
        const { tokens } = await this.oauth2Client.getToken(code);
        this.oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({
            auth: this.oauth2Client,
            version: 'v2'
        });
        const { data } = await oauth2.userinfo.get();
        return data;
    }

    async getGmailTokens(code) {
        const { tokens } = await this.oauth2Client.getToken(code);
        return tokens;
    }

    async googleLoginOrRegister(user) {
        try {
            const response = await this.thirdPartyLogin.execute(user);
            return response;
        } catch (error) {
            console.error('Error logging in or registering user:', error);
            return null;
        }
    }
}

module.exports = GoogleAuthService;
