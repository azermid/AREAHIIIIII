class Workspace {
    constructor({ id, name, userId, creationDate, actionTitle, reactionTitle, actionData, reactionData, actionServiceTitle, reactionServiceTitle, actionServiceToken, reactionServiceToken, actionServiceRefreshToken, reactionServiceRefreshToken }) {
        this.id = id || null;
        this.name = name;
        this.userId = userId;
        this.creationDate = creationDate || null;
        this.actionTitle = actionTitle || null;
        this.reactionTitle = reactionTitle || null;
        this.actionData = actionData || null;
        this.reactionData = reactionData || null;
        this.actionServiceTitle = actionServiceTitle || null;
        this.reactionServiceTitle = reactionServiceTitle || null;
        this.actionServiceToken = actionServiceToken || null;
        this.reactionServiceToken = reactionServiceToken || null;
        this.actionServiceRefreshToken = actionServiceRefreshToken || null;
        this.reactionServiceRefreshToken = reactionServiceRefreshToken || null;
    }
}

module.exports = Workspace;
