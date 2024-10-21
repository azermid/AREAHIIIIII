class Workspace {
    constructor({ id, name, userId, creationDate, actionId, reactionId, triggerId }) {
        this.id = id || null;
        this.name = name;
        this.userId = userId;
        this.creationDate = creationDate || null;
        //not sure those should be null, not needed for now so should not be problematic
        this.actionId = actionId || null;
        this.reactionId = reactionId || null;
        this.triggerId = triggerId || null;
    }
}

module.exports = Workspace;
