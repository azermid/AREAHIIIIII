const fetch = require('node-fetch');

class GitHubAuth {
    constructor(thirdPartyLogin) {
        this.thirdPartyLogin = thirdPartyLogin;
        this.clientId = process.env.GITHUB_CLIENT_ID;
        this.clientSecret = process.env.GITHUB_CLIENT_SECRET;
        this.redirectURI = null; // Fixed undefined variable
    }

    getAuthUrl() {
        const scopes = [
            'repo', // Full control of private repositories (or use 'public_repo' for public repos only)
            'admin:repo_hook', // Admin access to repository hooks
        ].join(',');

        return `https://github.com/login/oauth/authorize?client_id=${this.clientId}` +
            `&redirect_uri=${encodeURIComponent(process.env.GITHUB_REDIRECT_URI)}` +
            `&scope=${scopes}`;
    }

    async getGitHubTokens(code) {
        const tokenUrl = 'https://github.com/login/oauth/access_token';
        const params = new URLSearchParams({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code,
            redirect_uri: process.env.GITHUB_REDIRECT_URI, // Use redirectURI from constructor
        });

        try {
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: params
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to retrieve GitHub tokens: ${errorData}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching GitHub tokens:', error);
            throw error;
        }
    }

    async getGitHubUser(accessToken) {
        const userUrl = 'https://api.github.com/user';

        try {
            const response = await fetch(userUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json' // Ensure compatibility with GitHub's API version
                }
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to retrieve GitHub user information: ${errorData}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching GitHub user information:', error);
            throw error;
        }
    }
}

module.exports = GitHubAuth;
