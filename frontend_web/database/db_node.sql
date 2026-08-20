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

-- ============================================
-- CREAR TABLA DE USUARIOS (TODAS LAS COLUMNAS)
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    document VARCHAR(20) NULL UNIQUE,
    birth_date DATE NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    emergency_contact VARCHAR(100) NULL,
    emergency_phone VARCHAR(20) NULL,
    address VARCHAR(200) NULL,
    image VARCHAR(255) NULL,
    role VARCHAR(20) DEFAULT 'user',
    category_id INT NULL,
    student_id INT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_category
        FOREIGN KEY(category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
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
    role,
    is_active
) VALUES (
    'Albeiro',
    'Ramos',
    'profealbeiro2020@gmail.com',
    '$2b$10$NR8eRuuAB12JoHe81ZYnG.i2/5k/D5TKrxc7Pk74W4rgzADdABM9G',
    '3103103101',
    'admin',
    1
);

-- ============================================
-- CREAR TABLA DE PRODUCTOS
-- ============================================
CREATE TABLE productos(
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
-- CREAR TABLA DE ESTUDIANTES
-- ============================================
CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    document VARCHAR(20) NOT NULL UNIQUE,
    category_id INT NULL,
    birth_date DATE NULL,
    phone VARCHAR(20) NULL,
    address VARCHAR(200) NULL,
    emergency_contact VARCHAR(100) NULL,
    emergency_phone VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_students_category
        FOREIGN KEY (category_id) 
        REFERENCES categories(id) 
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- INSERTAR ESTUDIANTES DE EJEMPLO
-- ============================================
INSERT INTO students(name, lastname, document, category_id, birth_date, phone, address, emergency_contact, emergency_phone) VALUES
('Juan', 'Pérez', '1234567890', 1, '2015-03-15', '3101112222', 'Calle 123 #45-67', 'María Pérez', '3109998888'),
('Carlos', 'López', '0987654321', 2, '2016-07-20', '3103334444', 'Carrera 89 #12-34', 'Ana López', '3107776666');

-- ============================================
-- RELACIÓN OPCIONAL 1 A 1 ENTRE USUARIOS Y ESTUDIANTES
-- ============================================
ALTER TABLE users
    ADD CONSTRAINT uq_user_student UNIQUE (student_id),
    ADD CONSTRAINT fk_user_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE;

CREATE TABLE tournament_students (
    tournament_id INT NOT NULL,
    student_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tournament_id, student_id),
    CONSTRAINT fk_tournament_students_tournament
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    CONSTRAINT fk_tournament_students_student
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
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
SELECT '📊 TABLA', 'ESTUDIANTES', COUNT(*) FROM students;

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

-- ============================================
-- CREDENCIALES DE ACCESO
-- ============================================
SELECT '========================================' AS '';
SELECT '🔑 CREDENCIALES DE ACCESO' AS '';
SELECT '========================================' AS '';
SELECT '📧 Email: profealbeiro2020@gmail.com' AS '';
SELECT '🔐 Contraseña: admin123' AS '';
SELECT '👤 Rol: admin' AS '';
SELECT '========================================' AS '';
