const SpotifyWebApi = require('spotify-web-api-node');

class SpotifyAuthService {
    constructor(thirdPartyLogin) {
        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.SPOTIFY_REDIRECT_URI,
        });
        this.thirdPartyLogin = thirdPartyLogin;
        this.redirectURI = null;
        this.serviceName = null;
        this.serviceType = null;
    }

    getAuthUrl() {
        return this.spotifyApi.createAuthorizeURL([
            'user-read-private',
            'user-read-email',
            'user-library-read',
            'playlist-read-private',
            'user-top-read',
            'user-read-playback-state',
            'user-modify-playback-state',
            'streaming'
        ], true);
    }

    async getSpotifyUser(code) {
        try {
            const data = await this.spotifyApi.authorizationCodeGrant(code);
            this.spotifyApi.setAccessToken(data.body['access_token']);
            this.spotifyApi.setRefreshToken(data.body['refresh_token']);
            
            const userData = await this.spotifyApi.getMe();
            return userData.body;
        } catch (error) {
            console.error('Error retrieving Spotify user:', error);
            throw new Error('Could not retrieve Spotify user');
        }
    }

    async getSpotifyTokens(code) {
        try {
            const data = await this.spotifyApi.authorizationCodeGrant(code); // On utilise la méthode de spotify-web-api-node
            return {
                accessToken: data.body['access_token'],
                refreshToken: data.body['refresh_token'],
            };
        } catch (error) {
            console.error('Error retrieving Spotify tokens:', error);
            throw new Error('Could not retrieve Spotify tokens');
        }
    }
}

module.exports = SpotifyAuthService;
