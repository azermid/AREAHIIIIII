const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const fs = require('fs');

class GitHubAuth {
    constructor(thirdPartyLogin) {
        this.thirdPartyLogin = thirdPartyLogin;
        this.clientId = process.env.GITHUB_CLIENT_ID;
        this.clientSecret = process.env.GITHUB_CLIENT_SECRET;
        this.redirectURI = null;
        this.privateKeyPath = process.env.GITHUB_PRIVATE_KEY_PATH;
        this.appId = process.env.GITHUB_APP_ID;
        this.serviceName = 'Area-F';
        this.serviceType = 'oauth';
    }

    generateJWT() {
        const privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');
        const payload = {
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (10 * 60),
            iss: this.appId,
        };
        return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    }

    getAuthUrl() {
        const scopes = [
            'repo', // Full control of private repositories (or use 'public_repo' for public repos only)
            'admin:repo_hook', // Admin access to repository hooks
        ].join(',');

        const authUrl = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(process.env.GITHUB_REDIRECT_URI)}&scope=${scopes}`;
        return authUrl;
    }
$
    async getGitHubTokens(code) {
        const tokenUrl = 'https://github.com/login/oauth/access_token';
        const params = new URLSearchParams({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code,
            redirect_uri: process.env.GITHUB_REDIRECT_URI,
        });

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: params
        });

        if (!response.ok) {
            throw new Error('Failed to retrieve GitHub tokens');
        }

        const data = await response.json();
        return data;
    }

    async getGitHubUser(accessToken) {
        const userUrl = 'https://api.github.com/user';

        const response = await fetch(userUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to retrieve GitHub user information');
        }

        const userData = await response.json();
        return userData;
    }
}

module.exports = GitHubAuth;
