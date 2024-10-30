class Reaction {
    constructor({ id, title, description, service_id, data }) {
        this.id = id || null;
        this.title = title;
        this.description = description;
        this.service_id = service_id;
        this.data = data;
    }
}

module.exports = Reaction;