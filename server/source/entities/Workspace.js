class Workspace {
    constructor({ id, name, userId, creationDate, actionTitle, reactionTitle, actionServiceTitle, reactionServiceTitle, actionServiceToken, reactionServiceToken, actionServiceRefreshToken, reactionServiceRefreshToken, triggerId }) {
        this.id = id || null;
        this.name = name;
        this.userId = userId;
        this.creationDate = creationDate || null;
        this.actionTitle = actionTitle || null;
        this.reactionTitle = reactionTitle || null;
        this.actionServiceTitle = actionServiceTitle || null;
        this.reactionServiceTitle = reactionServiceTitle || null;
        this.actionServiceToken = actionServiceToken || null;
        this.reactionServiceToken = reactionServiceToken || null;
        this.actionServiceRefreshToken = actionServiceRefreshToken || null;
        this.reactionServiceRefreshToken = reactionServiceRefreshToken || null;
        this.triggerId = triggerId || null;
    }
}

module.exports = Workspace;
