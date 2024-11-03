const msal = require('@azure/msal-node');

class MicrosoftAuth {
    constructor(thirdPartyLogin) {
        this.thirdPartyLogin = thirdPartyLogin; // in case we do login with microsoft
        this.clientConfig = {
            auth: {
                clientId: process.env.OUTLOOK_CLIENT_ID,
                authority: `https://login.microsoftonline.com/common`,
                clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
            }
        };
        this.cca = new msal.ConfidentialClientApplication(this.clientConfig);
        this.redirectURI = null;
        this.serviceName = null;
        this.serviceType = null;
    }

    async getAuthUrl() {
        const authUrlParams = {
            scopes: ['User.Read', 'Mail.Read', 'Mail.Send', 'offline_access'],
            redirectUri: process.env.BACKEND_URI + '/auth/microsoft/callback',
        };
        const response = await this.cca.getAuthCodeUrl(authUrlParams);
        return response;
    }

    async getOutlookTokens(code) {
        const tokenRequest = {
            code,
            scopes: ['User.Read', 'Mail.Read', 'offline_access'],
            redirectUri: process.env.BACKEND_URI + '/auth/microsoft/callback',
        };

        const response = await this.cca.acquireTokenByCode(tokenRequest);
        // console.log(response);
        return response;
    }
}
module.exports = MicrosoftAuth;
