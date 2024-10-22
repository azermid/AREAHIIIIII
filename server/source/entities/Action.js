class Action {
    constructor({ id, title, description }) {
        this.id = id || null;
        this.title = title;
        this.description = description || '';
    }
}

module.exports = Action;