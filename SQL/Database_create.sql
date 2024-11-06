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
-- INSERT INTO users (username, email, password, oauth_provider, oauth_id)
-- password is 'password'
-- VALUES ('testuser', 'testuser@example.com', '$2b$10$YF/ICGpxB7dFDRYkVoQjnusEXrm6heovwKDOqDtOaKF0uEwHKiJ0K', 'area', '0');
-- need to hash pass

-- SELECT * FROM users;

-- DROP TABLE IF EXISTS workspaces;
CREATE TABLE workspaces (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
	creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	user_id INT,
    action_title VARCHAR(45),
    reaction_title VARCHAR(45),
    action_data JSON,
    reaction_data JSON,
    action_service_title VARCHAR(45),
    reaction_service_title VARCHAR(45),
    action_service_token TEXT,
    reaction_service_token TEXT,
    action_service_refresh_token VARCHAR(255),
    reaction_service_refresh_token VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- ALTER TABLE workspaces MODIFY COLUMN action_service_token TEXT;
-- ALTER TABLE workspaces MODIFY COLUMN reaction_service_token TEXT;

-- Drop the table if it exists
DROP TABLE IF EXISTS `services`;

-- Create the table
CREATE TABLE `services` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(45) NOT NULL,
    `description` VARCHAR(455) NULL DEFAULT NULL
);

-- Insert data into the table
INSERT INTO `services` (`title`, `description`) VALUES
('gmail', 'Gmail'),
('outlook', 'Outlook'),
('github', 'Github'),
('spotify', 'Spotify'),
('twitch', 'Twitch');

-- Drop the table if it exists
DROP TABLE IF EXISTS `actions`;

-- Create the table
CREATE TABLE `actions` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(45) NOT NULL,
    `description` VARCHAR(455) NULL DEFAULT NULL,
    `service_id` INT,
    `type` ENUM('polling', 'webhook') NOT NULL,
    `data` JSON NOT NULL
);

-- Insert data into the table
INSERT INTO `actions` (`title`, `description`, `service_id`, `type`, `data`) VALUES
('new_email_gmail', 'Mail received', 1, 'webhook', '{"from": "string", "user": "string"}'),
('new_email_outlook', 'Mail received', 2, 'polling', '{"from": "string", "subject": "string"}'),
('new_commit', 'New commit', 3, 'webhook', '{}'),
('new_playlist_spotify', 'Playlist created', 4, 'polling', '{}'),
('new_liked_music', 'Song liked', 4, 'polling', '{}'),
('twitch_broadcast', 'Live stream started', 5, 'webhook', '{"name": "string"}');


-- Drop the table if it exists
DROP TABLE IF EXISTS `reactions`;

-- Create the table
CREATE TABLE `reactions` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(45) NOT NULL,
    `description` VARCHAR(455) NULL DEFAULT NULL,
    `service_id` INT,
    `data` JSON NOT NULL
);

-- Insert data into the table
INSERT INTO `reactions` (`title`, `description`, `service_id`, `data`) VALUES
('send_email_gmail', 'Send an email', 1, '{"to": "string", "string": "string", "subject": "string"}'),
('send_email_outlook', 'Send an email', 2, '{"to": "string", "string": "string", "subject": "string"}'),
('create_github_repository', 'Create a repository', 3, '{"name": "string", "description": "string"}'),
('delete_github_repository', 'Delete a repository', 3, '{"name": "string"}'),
('create_spotify_playlist', 'Create a gist', 4, '{"name": "string", "description": "string", "public": "boolean"}');


-- DROP TABLE triggers;
CREATE TABLE `triggers` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `workspace_id` INT UNSIGNED NOT NULL,
    `type` enum('polling', 'webhook') NOT NULL,
    `action_id` INT UNSIGNED NOT NULL,
    `reaction_id` INT UNSIGNED NOT NULL,
    `action_data` JSON NOT NULL,
    `reaction_data` JSON NOT NULL,
    `action_service_token` TEXT NOT NULL,
    `reaction_service_token` TEXT NOT NULL,
    `action_service_refresh_token` VARCHAR(255),
    `reaction_service_refresh_token` VARCHAR(255),
	`webhook_url` VARCHAR(255),
    `webhook_secret` VARCHAR(255),
    FOREIGN KEY (`workspace_id`) REFERENCES `workspaces` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`action_id`) REFERENCES `actions` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`reaction_id`) REFERENCES `reactions` (`id`) ON DELETE CASCADE
);
-- ALTER TABLE `triggers` MODIFY COLUMN `action_service_token` TEXT;
-- ALTER TABLE `triggers` MODIFY COLUMN `reaction_service_token` TEXT;
-- ALTER TABLE `triggers` MODIFY COLUMN `action_service_refresh_token` VARCHAR(255);
-- ALTER TABLE `triggers` MODIFY COLUMN `reaction_service_refresh_token` VARCHAR(255);