CREATE DATABASE IF NOT EXISTS Area;
USE Area;

-- DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    oauth_provider VARCHAR(255), -- e.g., 'google', 'facebook', etc.
    oauth_id VARCHAR(255), -- stores the ID from the OAuth provider
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (username, email, oauth_provider)
);

-- Insert a test user
INSERT INTO users (username, email, password, oauth_provider, oauth_id)
-- password is 'password'
VALUES ('testuser', 'testuser@example.com', '$2b$10$YF/ICGpxB7dFDRYkVoQjnusEXrm6heovwKDOqDtOaKF0uEwHKiJ0K', 'area', '0');
-- need to hash pass

-- SELECT * FROM users;

-- DROP TABLE IF EXISTS workspaces;
CREATE TABLE workspaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
	creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	user_id INT,
    action_id INT,
    reaction_id INT, -- might have many reaction for an action
    trigger_id INT,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
