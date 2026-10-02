-- ============================================
-- SPORTING CLUB - MIGRACIÓN SEGURA V2
-- ============================================
-- Objetivo: ampliar la base actual sin borrar datos ni recrear la BD.
-- Requiere MySQL 8.x+ para usar IF NOT EXISTS en ALTER TABLE / CREATE INDEX.
-- ============================================

CREATE DATABASE IF NOT EXISTS db_node CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_node;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- 1) MODIFICAR TABLA users
-- ============================================
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS user_type ENUM('student', 'parent', 'none') NOT NULL DEFAULT 'none' AFTER role,
    ADD COLUMN IF NOT EXISTS is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER role;

ALTER TABLE users
    MODIFY COLUMN user_type ENUM('student', 'parent', 'none') NOT NULL DEFAULT 'none',
    MODIFY COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- ============================================
-- 2) MODIFICAR TABLA categories para soportar la nueva estructura
-- ============================================
ALTER TABLE categories
    ADD COLUMN IF NOT EXISTS name VARCHAR(100) NULL AFTER id,
    ADD COLUMN IF NOT EXISTS description TEXT NULL AFTER name,
    ADD COLUMN IF NOT EXISTS min_age INT NULL AFTER description,
    ADD COLUMN IF NOT EXISTS max_age INT NULL AFTER min_age,
    ADD COLUMN IF NOT EXISTS is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER max_age,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER is_active;

UPDATE categories
SET name = COALESCE(name, CONCAT('Categoria-', id)),
    description = COALESCE(description, 'Categoría deportiva'),
    min_age = COALESCE(min_age, 0),
    max_age = COALESCE(max_age, 99),
    is_active = COALESCE(is_active, 1)
WHERE name IS NULL OR is_active IS NULL;

ALTER TABLE categories
    MODIFY COLUMN name VARCHAR(100) NOT NULL,
    MODIFY COLUMN description TEXT NULL,
    MODIFY COLUMN min_age INT NULL,
    MODIFY COLUMN max_age INT NULL,
    MODIFY COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1,
    MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS uq_categories_name ON categories(name);

-- ============================================
-- 3) CREAR TABLAS NUEVAS
-- ============================================
CREATE TABLE IF NOT EXISTS student_profiles (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    document VARCHAR(20) NULL,
    birth_date DATE NULL,
    address VARCHAR(255) NULL,
    category_id INT NULL,
    emergency_contact_name VARCHAR(100) NULL,
    emergency_contact_phone VARCHAR(20) NULL,
    parent_id INT NULL,
    status ENUM('active', 'inactive', 'retired') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_student_profiles_user_id (user_id),
    UNIQUE KEY uq_student_profiles_document (document),
    KEY idx_student_profiles_category (category_id),
    KEY idx_student_profiles_parent (parent_id),
    KEY idx_student_profiles_status (status),
    CONSTRAINT fk_student_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_student_profiles_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_student_profiles_parent
        FOREIGN KEY (parent_id) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS parent_profiles (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    document VARCHAR(20) NULL,
    address VARCHAR(255) NULL,
    occupation VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_parent_profiles_user_id (user_id),
    UNIQUE KEY uq_parent_profiles_document (document),
    CONSTRAINT fk_parent_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS teams (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category_id INT NULL,
    coach_id INT NULL,
    logo VARCHAR(255) NULL,
    description TEXT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_teams_name (name),
    KEY idx_teams_category (category_id),
    KEY idx_teams_coach (coach_id),
    KEY idx_teams_active (is_active),
    CONSTRAINT fk_teams_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_teams_coach
        FOREIGN KEY (coach_id) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS team_members (
    id INT NOT NULL AUTO_INCREMENT,
    team_id INT NOT NULL,
    student_id INT NOT NULL,
    jersey_number INT NULL,
    position VARCHAR(50) NULL,
    joined_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_team_members_team_student (team_id, student_id),
    KEY idx_team_members_team (team_id),
    KEY idx_team_members_student (student_id),
    KEY idx_team_members_active (is_active),
    CONSTRAINT fk_team_members_team
        FOREIGN KEY (team_id) REFERENCES teams(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_team_members_student
        FOREIGN KEY (student_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tournaments (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    location VARCHAR(150) NULL,
    category_id INT NULL,
    status ENUM('draft', 'open', 'in_progress', 'finished', 'cancelled') NOT NULL DEFAULT 'draft',
    max_teams INT NULL DEFAULT 0,
    created_by INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_tournaments_category (category_id),
    KEY idx_tournaments_status (status),
    KEY idx_tournaments_created_by (created_by),
    CONSTRAINT fk_tournaments_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_tournaments_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tournament_teams (
    id INT NOT NULL AUTO_INCREMENT,
    tournament_id INT NOT NULL,
    team_id INT NOT NULL,
    group_name VARCHAR(100) NULL,
    points INT NOT NULL DEFAULT 0,
    matches_played INT NOT NULL DEFAULT 0,
    matches_won INT NOT NULL DEFAULT 0,
    matches_drawn INT NOT NULL DEFAULT 0,
    matches_lost INT NOT NULL DEFAULT 0,
    goals_for INT NOT NULL DEFAULT 0,
    goals_against INT NOT NULL DEFAULT 0,
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_tournament_teams_tournament_team (tournament_id, team_id),
    KEY idx_tournament_teams_tournament (tournament_id),
    KEY idx_tournament_teams_team (team_id),
    CONSTRAINT fk_tournament_teams_tournament
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_tournament_teams_team
        FOREIGN KEY (team_id) REFERENCES teams(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS schedules (
    id INT NOT NULL AUTO_INCREMENT,
    category_id INT NULL,
    team_id INT NULL,
    day_of_week ENUM('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    field VARCHAR(100) NULL,
    coach_id INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_schedules_category (category_id),
    KEY idx_schedules_team (team_id),
    KEY idx_schedules_coach (coach_id),
    CONSTRAINT fk_schedules_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_schedules_team
        FOREIGN KEY (team_id) REFERENCES teams(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_schedules_coach
        FOREIGN KEY (coach_id) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 4) SEEDS - CATEGORÍAS
-- ============================================
INSERT INTO categories (name, description, min_age, max_age, is_active)
VALUES
    ('Sub-8', 'Categoría para jugadores menores de 8 años', 6, 8, 1),
    ('Sub-10', 'Categoría para jugadores menores de 10 años', 8, 10, 1),
    ('Sub-12', 'Categoría para jugadores menores de 12 años', 10, 12, 1),
    ('Sub-15', 'Categoría para jugadores menores de 15 años', 13, 15, 1),
    ('Juvenil', 'Categoría para jugadores juveniles', 16, 18, 1)
ON DUPLICATE KEY UPDATE
    description = VALUES(description),
    min_age = VALUES(min_age),
    max_age = VALUES(max_age),
    is_active = VALUES(is_active);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================
