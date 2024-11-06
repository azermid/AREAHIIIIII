const fetch = require('node-fetch');

async function createSpotifyPlaylist(token, data) {
    const { name, description, isPublic } = data;

    const response = await fetch(
        "https://api.spotify.com/v1/me/playlists",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                public: isPublic !== undefined ? isPublic : true,
            }),
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        return;
    }

    const playlistData = await response.json();
    return playlistData;
}

module.exports = createSpotifyPlaylist;
