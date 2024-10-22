const express = require('express');
const GoogleAuthService = require('../services/GoogleAuth');
const UserRepository = require('../repositories/UserRepository');
const AuthService = require('../services/AuthService');
const ThirdPartyLogin = require('../useCases/ThirdPartyLogin');

module.exports = (dbConnection) => {
    const router = express.Router();

    const userRepository = new UserRepository(dbConnection);
    const authService = new AuthService();
    const thirdPartyLogin = new ThirdPartyLogin(userRepository, authService);
    const googleAuthService = new GoogleAuthService(thirdPartyLogin);

    router.get('/google', (req, res) => {
        googleAuthService.redirectURI = req.query.redirect_uri; // Save the redirect URI for later
        const url = googleAuthService.getAuthUrl(); // Get the URL of the Google Auth page
        return res.redirect(url); // Redirect the user to the Google Auth page
    });

    // This route is called by Google after the user logs in
    router.get('/google/callback', async (req, res) => {
        try {
            //req.query conatin the code that google sends back and the scope
            const code = req.query.code;
            const user = await googleAuthService.getGoogleUser(code);
            const db_user = {
                username: user.given_name,
                email: user.email,
                oauth_id: user.id,
                oauth_provider: 'google',
                password: Math.random().toString(36).slice(-12),
            }
            const redirectUri = googleAuthService.redirectURI || 'http://localhost:8081'; // Get the redirect URI from the query or use a default one
            const token = await googleAuthService.googleLoginOrRegister(db_user) || 'Error logging in with third party account';
            return res.redirect(`${redirectUri}?token=${token}`); // Redirect the user back to the app with the token
        } catch (error) {
            console.error('Error handling Google callback:', error);
            res.status(500).send('Authentication error');
        }
    });

    return router;
};
