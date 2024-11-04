const express = require('express');
const GoogleAuthService = require('../services/GoogleAuth');
const MicrosoftAuthService = require('../services/MicrosoftAuth');
const SpotifyAuthService = require('../services/SpotifyAuth');
const UserRepository = require('../repositories/UserRepository');
const GitHubAuthService = require('../services/GitHubAuth');
const TwitchAuthService = require('../services/TwitchAuth');
const AuthService = require('../services/AuthService');
const ThirdPartyLogin = require('../useCases/ThirdPartyLogin');

module.exports = (dbConnection) => {
    const router = express.Router();

    const userRepository = new UserRepository(dbConnection);
    const authService = new AuthService();
    const thirdPartyLogin = new ThirdPartyLogin(userRepository, authService);
    const googleAuthService = new GoogleAuthService(thirdPartyLogin);
    const microsoftAuthService = new MicrosoftAuthService(thirdPartyLogin);
    const spotifyAuthService = new SpotifyAuthService(thirdPartyLogin);
    const githubAuthService = new GitHubAuthService(thirdPartyLogin);
    const twitchAuthService = new TwitchAuthService(thirdPartyLogin);



    router.get('/google', (req, res) => {
        googleAuthService.redirectURI = req.query.redirect_uri; // Save the redirect URI for later
        googleAuthService.serviceName = 'google';
        const url = googleAuthService.getAuthUrl(); // Get the URL of the Google Auth page
        return res.redirect(url); // Redirect the user to the Google Auth page
    });

    router.get('/gmail', (req, res) => {
        googleAuthService.redirectURI = req.query.redirect_uri; // Save the redirect URI for later
        googleAuthService.serviceName = 'gmail';
        googleAuthService.serviceType = req.query.service_type;
        const url = googleAuthService.getGmailAuthUrl(); // Get the URL of the Google Auth page
        return res.redirect(url);
    });

    router.get('/google/callback', async (req, res) => {
        try {
            const code = req.query.code;
            const redirectUri = googleAuthService.redirectURI || 'http://localhost:8081'; // Get the redirect URI from the query or use a default one

            if (googleAuthService.serviceName === 'google') {
                const user = await googleAuthService.getGoogleUser(code);
                const db_user = {
                    username: user.given_name,
                    email: user.email,
                    oauth_id: user.id,
                    oauth_provider: 'google',
                    password: Math.random().toString(36).slice(-12),
                }
                const token = await googleAuthService.googleLoginOrRegister(db_user) || 'Error logging in with third party account';
                return res.redirect(`${redirectUri}?token=${token}`); // Redirect the user back to the app with the token
            } else if (googleAuthService.serviceName === 'gmail') {
                const tokens = await googleAuthService.getGmailTokens(code);
                // console.log(tokens);
                const access_token = tokens.access_token;
                const refresh_token = tokens.refresh_token;
                if (googleAuthService.serviceType == 'action') {
                    googleAuthService.action_token = access_token;
                    googleAuthService.action_refresh_token = refresh_token;
                    // const redirect = `${redirectUri}&action_token=${googleAuthService.action_token}&action_refresh_token=${googleAuthService.action_refresh_token}`;
                } else if (googleAuthService.serviceType == 'reaction') {
                    googleAuthService.reaction_token = access_token;
                    googleAuthService.reaction_refresh_token = refresh_token;
                    // const redirect = `${redirectUri}&reaction_token=${googleAuthService.reaction_token}&reaction_refresh_token=${googleAuthService.reaction_refresh_token}`;
                }
                const redirect = `${redirectUri}&action_token=${googleAuthService.action_token}&action_refresh_token=${googleAuthService.action_refresh_token}&reaction_token=${googleAuthService.reaction_token}&reaction_refresh_token=${googleAuthService.reaction_refresh_token}`;
                return res.redirect(redirect);
            }
        } catch (error) {
            console.error('Error handling Google callback:', error);
            res.status(500).send('Authentication error');
        }
    });

    router.get('/outlook', async (req, res) => {
        microsoftAuthService.redirectURI = req.query.redirect_uri;
        microsoftAuthService.serviceName = 'outlook';
        microsoftAuthService.serviceType = req.query.service_type;
        const url = await microsoftAuthService.getAuthUrl();
        return res.redirect(url);
    });

    router.get('/microsoft/callback', async (req, res) => {
        console.log('Microsoft callback');
        try {
            const code = req.query.code;
            const redirectUri = microsoftAuthService.redirectURI || 'http://localhost:8081';

            if (microsoftAuthService.serviceName === 'outlook') {
                const response = await microsoftAuthService.getOutlookTokens(code);
                // console.log(response);
                const access_token = response.accessToken;
                console.log('Access token:', access_token);
                // no refresh token for outlook, it's in cache and will be used automatically by msal
                if (microsoftAuthService.serviceType == 'action') {
                    microsoftAuthService.action_token = access_token;
                } else if (microsoftAuthService.serviceType == 'reaction') {
                    microsoftAuthService.reaction_token = access_token;
                }
                // const redirect = `${redirectUri}`;
                const redirect = `${redirectUri}&action_token=${microsoftAuthService.action_token}&action_refresh_token=${microsoftAuthService.action_refresh_token}&reaction_token=${microsoftAuthService.reaction_token}&reaction_refresh_token=${microsoftAuthService.reaction_refresh_token}`;
                return res.redirect(redirect);
            }
        } catch (error) {
            console.error('Error handling Microsoft callback:', error);
            res.status(500).send('Authentication error');
        }
    });

    router.get('/spotify', async (req, res) => {
        spotifyAuthService.redirectURI = req.query.redirect_uri;
        spotifyAuthService.serviceName = "spotify";
        spotifyAuthService.serviceType = req.query.service_type;
        const url = spotifyAuthService.getAuthUrl();
        console.log(url)
        return res.redirect(url);
    });
    
    router.get('/spotify/callback', async (req, res) => {
        console.log('Spotify callback');
        try {
            const code = req.query.code;
            const redirectUri = spotifyAuthService.redirectURI || 'http://localhost:8081';
    
            const response = await spotifyAuthService.getSpotifyTokens(code);
            const access_token = response.accessToken;
            console.log('Access token:', access_token);
    
            if (spotifyAuthService.serviceType == 'action') {
                spotifyAuthService.action_token = access_token;
            } else if (spotifyAuthService.serviceType == 'reaction') {
                spotifyAuthService.reaction_token = access_token;
            }
    
            const redirect = `${redirectUri}&action_token=${spotifyAuthService.action_token}&reaction_token=${spotifyAuthService.reaction_token}`;
            return res.redirect(redirect);
        } catch (error) {
            console.error('Error handling Spotify callback:', error);
            res.status(500).send('Authentication error');
        }
    });

    router.get('/github', (req, res) => {
        githubAuthService.redirectURI = req.query.redirect_uri;
        githubAuthService.serviceName = 'github';
        githubAuthService.serviceType = req.query.service_type;
        const url = githubAuthService.getAuthUrl();
        return res.redirect(url);
    });
    
    router.get('/github/callback', async (req, res) => {
        console.log('GitHub callback');
        try {
            const code = req.query.code;
            const redirectUri = githubAuthService.redirectURI || 'http://localhost:8081';
    
            const response = await githubAuthService.getGitHubTokens(code);
            const accessToken = response.access_token;
    
            if (githubAuthService.serviceType === 'action') {
                githubAuthService.action_token = accessToken;
            } else if (githubAuthService.serviceType === 'reaction') {
                githubAuthService.reaction_token = accessToken;
            }
    
            const redirect = `${redirectUri}&action_token=${githubAuthService.action_token}&reaction_token=${githubAuthService.reaction_token}`;
            return res.redirect(redirect);
        } catch (error) {
            console.error('Error handling GitHub callback:', error);
            res.status(500).send('Authentication error');
        }
    });
    
    router.get('/twitch', (req, res) => {
        twitchAuthService.redirectURI = req.query.redirect_uri || 'http://localhost:8081';
        twitchAuthService.serviceName = 'twitch';
        twitchAuthService.serviceType = req.query.service_type;
    
        const url = twitchAuthService.getAuthUrl();
        return res.redirect(url);
    });
    
    router.get('/twitch/callback', async (req, res) => {
        console.log('Twitch callback');
        try {
            const code = req.query.code;
            
            if (!code) {
                return res.status(400).send('Code d\'autorisation manquant');
            }
            const response = await twitchAuthService.getTwitchTokens(code, twitchAuthService.redirectURI);
            const accessToken = response.access_token;
            if (twitchAuthService.serviceType === 'action')
                twitchAuthService.action_token = accessToken;
            else if (twitchAuthService.serviceType === 'reaction')
                twitchAuthService.reaction_token = accessToken;
            const redirect = `${twitchAuthService.redirectURI}?action_token=${twitchAuthService.action_token || ''}&reaction_token=${twitchAuthService.reaction_token || ''}`;
            return res.redirect(redirect);
        } catch (error) {
            console.error('Error handling Twitch callback:', error);
            res.status(500).send('Authentication error');
        }
    });
    
    return router;
};
