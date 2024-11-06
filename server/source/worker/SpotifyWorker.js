const ActionRepository = require('../repositories/ActionRepository');
const ReactionRepository = require('../repositories/ReactionRepository');
const TriggerRepository = require('../repositories/TriggerRepository');

async function pollSpotifyForNewPlaylists(db, interval) {
    const actionRepository = new ActionRepository(db);
    const reactionRepository = new ReactionRepository(db);
    const triggerRepository = new TriggerRepository(db);

    const action_id = await actionRepository.getIdByName('new_playlist_spotify');
    const triggers = await triggerRepository.getByActionId(action_id);

    for (const trigger of triggers) {
        const response = await fetch(
            "https://api.spotify.com/v1/me/playlists",
            {
                headers: {
                    Authorization: `Bearer ${trigger.action_service_token}`,
                    "Content-Type": "application/json",
                }
            }
        );
        const data = await response.json();

        if (data.error) {
            console.error('Error:', data.error);
            return;
        }

        const processFrom = new Date(Date.now() - interval);
        for (const playlist of data.items) {
            const createdAt = new Date(playlist.added_at || playlist.created_at);
            if (createdAt < processFrom) {
                continue;
            }

            const reactionName = await reactionRepository.getNameById(trigger.reaction_id);
            const reaction = require(`../reactions/${reactionName}.js`);
            await reaction(trigger.action_service_token, trigger.reaction_data);
        }
    }
}

function startSpotifyPollingWorker(interval, db) {
    setInterval(async () => {
        await pollSpotifyForNewPlaylists(db, interval);
    }, interval);
}

async function pollSpotifyForNewLikedTracks(db, interval) {
    const actionRepository = new ActionRepository(db);
    const reactionRepository = new ReactionRepository(db);
    const triggerRepository = new TriggerRepository(db);

    const action_id = await actionRepository.getIdByName('new_liked_musique_spotify');
    const triggers = await triggerRepository.getByActionId(action_id);
    indice = 0;
    console.log("Polling Spotify for new likes...");
    for (const trigger of triggers) {
        const response = await fetch(
            "https://api.spotify.com/v1/me/tracks",
            {
                headers: {
                    Authorization: `Bearer ${trigger.action_service_token}`,
                    "Content-Type": "application/json",
                }
            }
        );

        const data = await response.json();

        if (data.error) {
            console.error('Error:', data.error);
            return;
        }

        const processFrom = new Date(Date.now() - interval);
        for (const track of data.items ) {
            if (indice > 30)
                break;
            indice++;
            const addedAt = new Date(track.added_at);
            if (addedAt < processFrom) {
                continue;
            }
            const reactionName = await reactionRepository.getNameById(trigger.reaction_id);
            const reaction = require(`../reactions/${reactionName}.js`);
            await reaction(trigger.action_service_token, trigger.reaction_data);
        }
    }
}

function startSpotifyPollingForLikedTracks(interval, db) {
    setInterval(async () => {
        await pollSpotifyForNewLikedTracks(db, interval);
    }, interval);
}


module.exports = { startSpotifyPollingWorker, startSpotifyPollingForLikedTracks };
