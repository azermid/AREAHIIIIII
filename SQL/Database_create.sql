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
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
	creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	user_id INT,
    action_title VARCHAR(45),
    reaction_title VARCHAR(45),
    action_service_title VARCHAR(45),
    reaction_service_title VARCHAR(45),
    action_service_token VARCHAR(255),
    reaction_service_token VARCHAR(255),
    action_service_refresh_token VARCHAR(255),
    reaction_service_refresh_token VARCHAR(255),
    trigger_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- DROP TABLE IF EXISTS services;
CREATE TABLE `services` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(45) NOT NULL,
    `description` VARCHAR(455) NULL DEFAULT NULL,
    `service_id` INT
);

-- DROP TABLE IF EXISTS actions;
CREATE TABLE `actions` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(45) NOT NULL,
    `description` VARCHAR(455) NULL DEFAULT NULL,
    `service_id` INT
);

-- DROP TABLE IF EXISTS reactions;
CREATE TABLE `reactions` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(45) NOT NULL,
    `description` VARCHAR(455) NULL DEFAULT NULL
);

CREATE TABLE `triggers` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `services_id` INT UNSIGNED NOT NULL,
    `actions_id` INT UNSIGNED NOT NULL,
    `reactions_id` INT UNSIGNED NOT NULL,
    `args` JSON NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_triggers_services_idx` (`services_id` ASC) VISIBLE,
    INDEX `fk_triggers_actions_idx` (`actions_id` ASC) VISIBLE,
    INDEX `fk_triggers_reactions_idx` (`reactions_id` ASC) VISIBLE,
    CONSTRAINT `fk_triggers_services`
        FOREIGN KEY (`services_id`)
        REFERENCES `Area`.`services` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    CONSTRAINT `fk_triggers_actions`
        FOREIGN KEY (`actions_id`)
        REFERENCES `Area`.`actions` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    CONSTRAINT `fk_triggers_reactions`
        FOREIGN KEY (`reactions_id`)
        REFERENCES `Area`.`reactions` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);
