class Trigger {
    constructor({ id, workspace_id, type, action_id, reaction_id, action_data, reaction_data, action_service_token, reaction_service_token, action_service_refresh_token, reaction_service_refresh_token, webhook_url, webhook_secret }) {
        this.id = id || null;
        this.workspace_id = workspace_id;
        this.type = type;
        this.action_id = action_id;
        this.reaction_id = reaction_id;
        this.action_data = action_data;
        this.reaction_data = reaction_data;
        this.action_service_token = action_service_token;
        this.reaction_service_token = reaction_service_token;
        this.action_service_refresh_token = action_service_refresh_token;
        this.reaction_service_refresh_token = reaction_service_refresh_token;
        this.webhook_url = webhook_url || null;
        this.webhook_secret = webhook_secret || null;
    }
}

module.exports = Trigger;