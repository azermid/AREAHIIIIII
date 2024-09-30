class User {
    constructor({ id, username, email, password, oauth_id, oauth_provider }) {
        this.id = id || null;
        this.username = username;
        this.email = email;
        this.password = password;
        this.oauth_id = oauth_id || 0;
        this.oauth_provider = oauth_provider;
    }
}

module.exports = User;
