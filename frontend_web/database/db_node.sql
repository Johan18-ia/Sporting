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
-- CREAR TABLA DE USUARIOS
-- ============================================
-- La tabla users guarda la autenticación y los datos base del usuario.
-- Los usuarios normales y los estudiantes comparten esta tabla.
-- El perfil específico del estudiante está en student_profiles.
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    image VARCHAR(255) NULL,
    role ENUM('admin', 'seller', 'user') NOT NULL DEFAULT 'user',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    'profealbeiro2020@gmail.com',
    '$2b$10$NR8eRuuAB12JoHe81ZYnG.i2/5k/D5TKrxc7Pk74W4rgzADdABM9G',
    '3103103101',
    NULL,
    'admin',
    1
);

-- ============================================
-- INSERTAR USUARIOS NORMALES DE EJEMPLO
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
) VALUES
(
    'Ana',
    'García',
    'ana.garcia@email.com',
    '$2b$10$NR8eRuuAB12JoHe81ZYnG.i2/5k/D5TKrxc7Pk74W4rgzADdABM9G',
    '3201112233',
    NULL,
    'user',
    1
),
(
    'Luis',
    'Martínez',
    'luis.martinez@email.com',
    '$2b$10$NR8eRuuAB12JoHe81ZYnG.i2/5k/D5TKrxc7Pk74W4rgzADdABM9G',
    '3204445566',
    NULL,
    'user',
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
CREATE TABLE schedules(
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
-- CREAR TABLA DE PERFIL DE ESTUDIANTES
-- ============================================
-- El estudiante reutiliza la cuenta de usuario principal.
-- Los datos generales (nombre, apellido, email, contraseña) quedan en users.
-- Aquí se almacenan solo los datos del perfil estudiantil.
-- ============================================
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

    CONSTRAINT fk_student_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_student_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- INSERTAR ESTUDIANTES DE EJEMPLO
-- ============================================
-- Los estudiantes se registran a partir de usuarios ya creados en users.
-- Por eso se reutiliza el correo y los datos base del usuario.
-- ============================================
INSERT INTO student_profiles (
    user_id,
    document,
    category_id,
    birth_date,
    address,
    emergency_contact_name,
    emergency_contact_phone,
    status
) VALUES
(
    2,
    '1234567890',
    1,
    '2015-03-15',
    'Calle 123 #45-67',
    'María García',
    '3109998888',
    'approved'
),
(
    3,
    '0987654321',
    2,
    '2016-07-20',
    'Carrera 89 #12-34',
    'Ana Martínez',
    '3107776666',
    'pending'
);

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
SELECT '📊 TABLA', 'PERFILES_ESTUDIANTES', COUNT(*) FROM student_profiles
UNION ALL
SELECT '📊 TABLA', 'PRODUCTOS', COUNT(*) FROM productos
UNION ALL
SELECT '📊 TABLA', 'HORARIOS', COUNT(*) FROM schedules
UNION ALL
SELECT '📊 TABLA', 'TORNEOS', COUNT(*) FROM tournaments;

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
