class Action {
    constructor({ id, title, description, service_id, data, type }) {
        this.id = id || null;
        this.title = title;
        this.description = description;
        this.service_id = service_id;
        this.data = data;
        this.type = type;
    }
}

module.exports = Action;