class Reaction {
    constructor({ id, title, description, service_id }) {
        this.id = id || null;
        this.title = title;
        this.description = description;
        this.service_id = service_id;
    }
}

module.exports = Reaction;