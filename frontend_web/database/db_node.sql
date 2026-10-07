-- ============================================
-- ELIMINAR BASE DE DATOS SI EXISTE
-- ============================================
DROP DATABASE IF EXISTS db_node;

-- ============================================
-- CREAR BASE DE DATOS
-- ============================================
CREATE DATABASE db_node DEFAULT CHARACTER SET utf8mb4;

-- ============================================
-- SELECCIONAR BASE DE DATOS
-- ============================================
USE db_node;

-- ============================================
-- CREAR TABLA DE CATEGORÍAS
-- ============================================
CREATE TABLE categories(
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_year INT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- INSERTAR CATEGORÍAS DE EJEMPLO
-- ============================================
INSERT INTO categories(category_year, description) VALUES
(2015, 'Categoría jugadores nacidos en 2015'),
(2016, 'Categoría jugadores nacidos en 2016'),
(2017, 'Categoría jugadores nacidos en 2017');

INSERT INTO categories (category_year, description, created_at, updated_at)
VALUES
    (2000, 'Categoría jugadores nacidos en 2000', NOW(), NOW()),
    (2001, 'Categoría jugadores nacidos en 2001', NOW(), NOW()),
    (2002, 'Categoría jugadores nacidos en 2002', NOW(), NOW()),
    (2003, 'Categoría jugadores nacidos en 2003', NOW(), NOW()),
    (2004, 'Categoría jugadores nacidos en 2004', NOW(), NOW()),
    (2005, 'Categoría jugadores nacidos en 2005', NOW(), NOW()),
    (2006, 'Categoría jugadores nacidos en 2006', NOW(), NOW()),
    (2007, 'Categoría jugadores nacidos en 2007', NOW(), NOW()),
    (2008, 'Categoría jugadores nacidos en 2008', NOW(), NOW()),
    (2009, 'Categoría jugadores nacidos en 2009', NOW(), NOW()),
    (2010, 'Categoría jugadores nacidos en 2010', NOW(), NOW()),
    (2011, 'Categoría jugadores nacidos en 2011', NOW(), NOW()),
    (2012, 'Categoría jugadores nacidos en 2012', NOW(), NOW()),
    (2013, 'Categoría jugadores nacidos en 2013', NOW(), NOW()),
    (2014, 'Categoría jugadores nacidos en 2014', NOW(), NOW()),
    (2015, 'Categoría jugadores nacidos en 2015', NOW(), NOW()),
    (2016, 'Categoría jugadores nacidos en 2016', NOW(), NOW()),
    (2017, 'Categoría jugadores nacidos en 2017', NOW(), NOW()),
    (2018, 'Categoría jugadores nacidos en 2018', NOW(), NOW()),
    (2019, 'Categoría jugadores nacidos en 2019', NOW(), NOW()),
    (2020, 'Categoría jugadores nacidos en 2020', NOW(), NOW())
ON DUPLICATE KEY UPDATE
    description = VALUES(description),
    updated_at = NOW();

-- ============================================
-- CREAR TABLA DE USUARIOS
-- ============================================
-- users contiene autenticacion y datos base. Los datos propios de un
-- estudiante se almacenan en student_profiles para evitar duplicacion.
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    image VARCHAR(255) NULL,
    role ENUM('admin', 'seller', 'user') NOT NULL DEFAULT 'user',
    user_type ENUM('student', 'parent', 'none') NOT NULL DEFAULT 'none',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE parent_profiles (
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

-- ============================================
-- INSERTAR USUARIO ADMIN
-- ============================================
INSERT INTO users (
    name,
    lastname,
    email,
    password,
    phone,
    image,
    role,
    is_active
) VALUES (
    'Albeiro',
    'Ramos',
    'admi@gmail.com',
    '$2b$10$NR8eRuuAB12JoHe81ZYnG.i2/5k/D5TKrxc7Pk74W4rgzADdABM9G',
    '3103103101',
    NULL,
    'admin',
    1
);

INSERT INTO users (name, lastname, email, password, phone, image, role, user_type, is_active) VALUES
(
    'Mariana', 'Rojas', 'estudiante01@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000001', NULL, 'user', 'student', 1
),
(
    'Samuel', 'Gómez', 'estudiante02@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000002', NULL, 'user', 'student', 1
),
(
    'Isabella', 'Martínez', 'estudiante03@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000003', NULL, 'user', 'student', 1
),
(
    'Mateo', 'Hernández', 'estudiante04@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000004', NULL, 'user', 'student', 1
),
(
    'Santiago', 'López', 'estudiante05@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000005', NULL, 'user', 'student', 1
),
(
    'Luciana', 'Díaz', 'estudiante06@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000006', NULL, 'user', 'student', 1
),
(
    'Nicolás', 'Pérez', 'estudiante07@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000007', NULL, 'user', 'student', 1
),
(
    'Gabriela', 'Torres', 'estudiante08@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000008', NULL, 'user', 'student', 1
),
(
    'David', 'Ramírez', 'estudiante09@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000009', NULL, 'user', 'student', 1
),
(
    'Valentina', 'Castro', 'estudiante10@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000010', NULL, 'user', 'student', 1
),
(
    'Tomás', 'Moreno', 'estudiante11@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000011', NULL, 'user', 'student', 1
),
(
    'Manuela', 'Vargas', 'estudiante12@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000012', NULL, 'user', 'student', 1
),
(
    'Andrés', 'Jiménez', 'estudiante13@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000013', NULL, 'user', 'student', 1
),
(
    'Antonella', 'Ruiz', 'estudiante14@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000014', NULL, 'user', 'student', 1
),
(
    'Felipe', 'Ortiz', 'estudiante15@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000015', NULL, 'user', 'student', 1
),
(
    'Carlos', 'Pérez', 'padre01@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000016', NULL, 'user', 'parent', 1
),
(
    'Mónica', 'Torres', 'padre02@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000017', NULL, 'user', 'parent', 1
),
(
    'Jorge', 'Ramírez', 'padre03@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000018', NULL, 'user', 'parent', 1
),
(
    'Laura', 'Gómez', 'padre04@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000019', NULL, 'user', 'parent', 1
),
(
    'Andrés', 'Morales', 'padre05@sporting.test',
    '$2b$10$5OZTpq.FnSTqc1KO1OMin.co9DbTMyRySg7AQxv4MLUjAcS6jANL.',
    '3110000020', NULL, 'user', 'parent', 1
);

INSERT INTO parent_profiles (user_id, document, address, occupation)
SELECT u.id, p.document, p.address, p.occupation
FROM (
    SELECT 'padre01@sporting.test' AS email, '20000000001' AS document, 'Calle 20 #10-15' AS address, 'Docente' AS occupation
    UNION ALL SELECT 'padre02@sporting.test', '20000000002', 'Carrera 8 #25-40', 'Comerciante'
    UNION ALL SELECT 'padre03@sporting.test', '20000000003', 'Calle 42 #18-22', 'Ingeniero'
    UNION ALL SELECT 'padre04@sporting.test', '20000000004', 'Carrera 15 #60-11', 'Enfermera'
    UNION ALL SELECT 'padre05@sporting.test', '20000000005', 'Calle 9 #31-07', 'Contador'
) p
INNER JOIN users u ON u.email = p.email;

-- ============================================
-- CREAR TABLA DE PRODUCTOS
-- ============================================
CREATE TABLE IF NOT EXISTS productos(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    imagen VARCHAR(255) NULL,
    categoria VARCHAR(100) NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- INSERTAR PRODUCTOS DE EJEMPLO
-- ============================================
INSERT INTO productos(nombre, descripcion, precio, stock, imagen, categoria) VALUES
('Balón Oficial', 'Balón de fútbol profesional', 150000, 20, 'https://placehold.co/300x200/8B0000/FFFFFF?text=Balon', 'Equipamiento'),
('Camiseta Local', 'Camiseta oficial del equipo', 80000, 30, 'https://placehold.co/300x200/8B0000/FFFFFF?text=Camiseta', 'Indumentaria'),
('Espinilleras Pro', 'Espinilleras de alta protección', 45000, 15, 'https://placehold.co/300x200/8B0000/FFFFFF?text=Espinilleras', 'Protección');

-- ============================================
-- CREAR TABLA DE HORARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS schedules(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_category INT NOT NULL,
    day_of_week VARCHAR(30) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    field_name VARCHAR(150) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_schedule_category
        FOREIGN KEY(id_category)
        REFERENCES categories(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- INSERTAR HORARIOS DE EJEMPLO
-- ============================================
INSERT INTO schedules(id_category, day_of_week, start_time, end_time, field_name) VALUES
(1, 'Lunes', '16:00:00', '18:00:00', 'Cancha Principal'),
(1, 'Miércoles', '15:00:00', '17:00:00', 'Cancha Sintética'),
(2, 'Viernes', '14:00:00', '16:00:00', 'Cancha Auxiliar');

-- ============================================
-- CREAR TABLA DE TORNEOS
-- ============================================
CREATE TABLE tournaments(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    id_category INT NOT NULL,
    tournament_date DATE NULL,
    location VARCHAR(150) NULL,
    status VARCHAR(50) DEFAULT 'Pendiente',
    max_teams INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_tournament_category
        FOREIGN KEY(id_category)
        REFERENCES categories(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- INSERTAR TORNEOS DE EJEMPLO
-- ============================================
INSERT INTO tournaments(name, description, id_category, tournament_date, location, status, max_teams) VALUES
('Copa Infantil 2026', 'Torneo de categorías menores', 1, '2026-06-15', 'Cancha Principal', 'Activo', 8),
('Liga Juvenil Bogotá', 'Competencia juvenil distrital', 2, '2026-07-10', 'Estadio Municipal', 'Pendiente', 12);

-- ============================================
-- CREAR PERFIL DE ESTUDIANTE
-- ============================================
-- Un usuario puede tener como maximo un perfil de estudiante. El nombre,
-- apellido, email y telefono se leen desde users.
CREATE TABLE student_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    document VARCHAR(20) NOT NULL UNIQUE,
    category_id INT NULL,
    birth_date DATE NULL,
    address VARCHAR(200) NULL,
    emergency_contact_name VARCHAR(100) NULL,
    emergency_contact_phone VARCHAR(20) NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_profile_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_student_profile_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO student_profiles (
    user_id, document, category_id, birth_date, address,
    emergency_contact_name, emergency_contact_phone, status
)
SELECT u.id, p.document, c.id, p.birth_date, p.address,
       p.emergency_contact_name, p.emergency_contact_phone, 'pending'
FROM (
    SELECT 'estudiante01@sporting.test' AS email, '10000000001' AS document, 2006 AS category_year,
           '2006-03-15' AS birth_date, 'Calle 10 #20-30' AS address, 'Carlos Pérez' AS emergency_contact_name,
           '3120000001' AS emergency_contact_phone
    UNION ALL SELECT 'estudiante02@sporting.test', '10000000002', 2007, '2007-08-21', 'Carrera 12 #14-20', 'Mónica Torres', '3120000002'
    UNION ALL SELECT 'estudiante03@sporting.test', '10000000003', 2008, '2008-04-08', 'Calle 22 #15-18', 'Laura Ramírez', '3120000003'
    UNION ALL SELECT 'estudiante04@sporting.test', '10000000004', 2009, '2009-11-03', 'Carrera 30 #8-16', 'Andrés Herrera', '3120000004'
    UNION ALL SELECT 'estudiante05@sporting.test', '10000000005', 2010, '2010-06-17', 'Calle 45 #12-09', 'Daniela Castro', '3120000005'
    UNION ALL SELECT 'estudiante06@sporting.test', '10000000006', 2011, '2011-02-12', 'Calle 10 #20-30', 'Carlos Pérez', '3120000006'
    UNION ALL SELECT 'estudiante07@sporting.test', '10000000007', 2012, '2012-08-21', 'Carrera 12 #14-20', 'Mónica Torres', '3120000007'
    UNION ALL SELECT 'estudiante08@sporting.test', '10000000008', 2013, '2013-04-08', 'Calle 22 #15-18', 'Laura Ramírez', '3120000008'
    UNION ALL SELECT 'estudiante09@sporting.test', '10000000009', 2014, '2014-11-03', 'Carrera 30 #8-16', 'Andrés Herrera', '3120000009'
    UNION ALL SELECT 'estudiante10@sporting.test', '10000000010', 2015, '2015-06-17', 'Calle 45 #12-09', 'Daniela Castro', '3120000010'
    UNION ALL SELECT 'estudiante11@sporting.test', '10000000011', 2016, '2016-03-15', 'Calle 10 #20-30', 'Carlos Pérez', '3120000011'
    UNION ALL SELECT 'estudiante12@sporting.test', '10000000012', 2017, '2017-08-21', 'Carrera 12 #14-20', 'Mónica Torres', '3120000012'
    UNION ALL SELECT 'estudiante13@sporting.test', '10000000013', 2018, '2018-04-08', 'Calle 22 #15-18', 'Laura Ramírez', '3120000013'
    UNION ALL SELECT 'estudiante14@sporting.test', '10000000014', 2019, '2019-11-03', 'Carrera 30 #8-16', 'Andrés Herrera', '3120000014'
    UNION ALL SELECT 'estudiante15@sporting.test', '10000000015', 2020, '2020-06-17', 'Calle 45 #12-09', 'Daniela Castro', '3120000015'
) p
INNER JOIN users u ON u.email = p.email
INNER JOIN categories c ON c.category_year = p.category_year;

-- Los cinco perfiles parentales quedan enlazados con los usuarios de tipo parent.

CREATE TABLE tournament_students (
    tournament_id INT NOT NULL,
    student_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tournament_id, student_id),
    CONSTRAINT fk_tournament_students_tournament
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    CONSTRAINT fk_tournament_students_student
        FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS teams (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category_id INT NULL,
    coach_id INT NULL,
    logo VARCHAR(255) NULL,
    description TEXT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_teams_category FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_teams_coach FOREIGN KEY (coach_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS team_members (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    student_id INT NOT NULL,
    jersey_number INT NULL,
    position VARCHAR(50) NULL,
    joined_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_team_members_team_student (team_id, student_id),
    CONSTRAINT fk_team_members_team FOREIGN KEY (team_id) REFERENCES teams(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_team_members_student FOREIGN KEY (student_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tournament_teams (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
    UNIQUE KEY uq_tournament_teams_tournament_team (tournament_id, team_id),
    CONSTRAINT fk_tournament_teams_tournament FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tournament_teams_team FOREIGN KEY (team_id) REFERENCES teams(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- VERIFICAR TODAS LAS TABLAS
-- ============================================
SHOW TABLES;

-- ============================================
-- VERIFICAR ESTRUCTURA DE LA TABLA USERS
-- ============================================
DESCRIBE users;

-- ============================================
-- VERIFICAR DATOS INSERTADOS
-- ============================================
SELECT '📊 TABLA' AS 'Tipo', 'CATEGORÍAS' AS 'Nombre', COUNT(*) AS 'Registros' FROM categories
UNION ALL
SELECT '📊 TABLA', 'USUARIOS', COUNT(*) FROM users
UNION ALL
SELECT '📊 TABLA', 'PRODUCTOS', COUNT(*) FROM productos
UNION ALL
SELECT '📊 TABLA', 'HORARIOS', COUNT(*) FROM schedules
UNION ALL
SELECT '📊 TABLA', 'TORNEOS', COUNT(*) FROM tournaments
UNION ALL
SELECT '📊 TABLA', 'PERFILES DE ESTUDIANTES', COUNT(*) FROM student_profiles
UNION ALL
SELECT '📊 TABLA', 'PERFILES DE PADRES', COUNT(*) FROM parent_profiles;

-- ============================================
-- MOSTRAR USUARIO ADMIN
-- ============================================
SELECT 
    '✅ ADMIN' AS 'Usuario',
    id,
    name,
    lastname,
    email,
    role,
    is_active
FROM users 
WHERE role = 'admin';

SELECT '========================================' AS '';
SELECT '🔑 CREDENCIALES DE ACCESO' AS '';
SELECT '========================================' AS '';
SELECT '📧 Email: profealbeiro2020@gmail.com' AS '';
SELECT '🔐 Contraseña: admin123' AS '';
SELECT '👤 Rol: admin' AS '';
SELECT '🔐 Contraseña para las 15 cuentas estudiante y 5 cuentas padre: 12345' AS '';
SELECT '📧 Cuentas estudiante: estudiante01@sporting.test a estudiante15@sporting.test' AS '';
SELECT '📧 Cuentas padre: padre01@sporting.test a padre05@sporting.test' AS '';
SELECT '========================================' AS '';
SELECT '========================================' AS '';
