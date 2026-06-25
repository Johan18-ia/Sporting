-- ============================================
-- ELIMINAR BASE DE DATOS SI EXISTE
-- ============================================
DROP DATABASE IF EXISTS db_node;

-- ============================================
-- CREAR BASE DE DATOS
-- ============================================
CREATE SCHEMA db_node DEFAULT CHARACTER SET utf8;

-- ============================================
-- SELECCIONAR BASE DE DATOS
-- ============================================
USE db_node;

-- ============================================
-- CREAR TABLA DE CATEGORÍAS (PRIMERO POR FK)
-- ============================================
CREATE TABLE categories(
    id INT PRIMARY KEY AUTO_INCREMENT,              -- Identificador único
    category_year INT NOT NULL UNIQUE,              -- Año de la categoría (ej: 2015, 2016)
    description TEXT,                               -- Descripción de la categoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de actualización
) ENGINE=InnoDB;

-- ============================================
-- INSERTAR CATEGORÍAS DE EJEMPLO
-- ============================================
INSERT INTO categories(
    category_year,
    description
)
VALUES
(
    2015,
    'Categoría jugadores nacidos en 2015'
),
(
    2016,
    'Categoría jugadores nacidos en 2016'
),
(
    2017,
    'Categoría jugadores nacidos en 2017'
);

-- ============================================
-- CREAR TABLA DE USUARIOS (CON TODOS LOS CAMPOS)
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,              -- Identificador único del usuario
    name VARCHAR(100) NOT NULL,                     -- Nombre del usuario
    lastname VARCHAR(100) NOT NULL,                 -- Apellido del usuario
    document VARCHAR(20) NULL UNIQUE,               -- Documento de identidad (único)
    birth_date DATE NULL,                           -- Fecha de nacimiento
    email VARCHAR(150) NOT NULL UNIQUE,             -- Correo electrónico (único)
    password VARCHAR(255) NOT NULL,                 -- Contraseña hasheada
    phone VARCHAR(20),                              -- Número de teléfono
    emergency_contact VARCHAR(100) NULL,            -- Contacto de emergencia
    emergency_phone VARCHAR(20) NULL,               -- Teléfono de emergencia
    address VARCHAR(200) NULL,                      -- Dirección
    image VARCHAR(255),                             -- URL de la imagen de perfil
    role VARCHAR(20) DEFAULT 'user',                -- Rol del usuario (admin, seller, user)
    category_id INT NULL,                           -- Categoría del usuario (FK)
    student_id INT NULL,                            -- ID del estudiante relacionado
    is_active TINYINT(1) DEFAULT 1,                 -- Estado del usuario (1=activo, 0=inactivo)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Fecha de actualización

    -- Llave foránea con categorías
    CONSTRAINT fk_user_category
        FOREIGN KEY(category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- INSERTAR USUARIO ADMIN
-- ============================================
-- Usando especificación de columnas (RECOMENDADO)
INSERT INTO users (
    name,
    lastname,
    document,
    birth_date,
    email,
    password,
    phone,
    emergency_contact,
    emergency_phone,
    address,
    image,
    role,
    category_id,
    student_id,
    is_active
)
VALUES (
    'Albeiro',
    'Ramos',
    NULL,                                           -- Sin documento
    NULL,                                           -- Sin fecha de nacimiento
    'profealbeiro2020@gmail.com',
    '$2b$10$NR8eRuuAB12JoHe81ZYnG.i2/5k/D5TKrxc7Pk74W4rgzADdABM9G', -- Contraseña hasheada
    '3103103101',
    NULL,                                           -- Sin contacto de emergencia
    NULL,                                           -- Sin teléfono de emergencia
    NULL,                                           -- Sin dirección
    'profile',
    'admin',
    NULL,                                           -- Sin categoría asignada
    NULL,                                           -- Sin estudiante relacionado
    1                                               -- Activo
);

-- ============================================
-- CREAR TABLA DE PRODUCTOS
-- ============================================
CREATE TABLE productos(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,           -- ID con BIGINT por muchos productos
    nombre VARCHAR(255) NOT NULL,                   -- Nombre del producto
    descripcion TEXT,                               -- Descripción detallada
    precio DECIMAL(10,2) NOT NULL,                  -- Precio con 2 decimales
    stock INT NOT NULL,                             -- Cantidad en inventario
    imagen VARCHAR(255),                            -- URL de la imagen del producto
    categoria VARCHAR(100),                         -- Categoría del producto
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de actualización
);

-- ============================================
-- INSERTAR PRODUCTO DE EJEMPLO
-- ============================================
INSERT INTO productos(
    nombre,
    descripcion,
    precio,
    stock,
    imagen,
    categoria
)
VALUES(
    'Nike Air Max',
    'Zapatos deportivos',
    450000,
    20,
    'https://imagen.com/nike.jpg',
    'Calzado'
);

-- ============================================
-- CREAR TABLA DE HORARIOS
-- ============================================
CREATE TABLE schedules(
    id INT PRIMARY KEY AUTO_INCREMENT,              -- Identificador único
    id_category INT NOT NULL,                       -- ID de la categoría (FK)
    day_of_week VARCHAR(30) NOT NULL,               -- Día de la semana
    start_time TIME NOT NULL,                       -- Hora de inicio
    end_time TIME NOT NULL,                         -- Hora de fin
    field_name VARCHAR(150),                        -- Nombre de la cancha
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Fecha de actualización

    -- Llave foránea con categorías
    CONSTRAINT fk_schedule_category
        FOREIGN KEY(id_category)
        REFERENCES categories(id)
        ON DELETE CASCADE      -- Si se elimina la categoría, se eliminan sus horarios
        ON UPDATE CASCADE      -- Si se actualiza el ID, se actualiza en los horarios
) ENGINE=InnoDB;

-- ============================================
-- INSERTAR HORARIOS DE EJEMPLO
-- ============================================
INSERT INTO schedules(
    id_category,
    day_of_week,
    start_time,
    end_time,
    field_name
)
VALUES
(
    1,
    'Lunes',
    '16:00:00',
    '18:00:00',
    'Cancha Principal'
),
(
    1,
    'Miércoles',
    '15:00:00',
    '17:00:00',
    'Cancha Sintética'
),
(
    2,
    'Viernes',
    '14:00:00',
    '16:00:00',
    'Cancha Auxiliar'
);

-- ============================================
-- CREAR TABLA DE TORNEOS
-- ============================================
CREATE TABLE tournaments(
    id INT PRIMARY KEY AUTO_INCREMENT,              -- Identificador único
    name VARCHAR(150) NOT NULL,                     -- Nombre del torneo
    description TEXT,                               -- Descripción del torneo
    id_category INT NOT NULL,                       -- ID de la categoría (FK)
    tournament_date DATE,                           -- Fecha del torneo
    location VARCHAR(150),                          -- Ubicación del torneo
    status VARCHAR(50) DEFAULT 'Pendiente',         -- Estado (Pendiente, Activo, Finalizado)
    max_teams INT DEFAULT 0,                        -- Número máximo de equipos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Fecha de actualización

    -- Llave foránea con categorías
    CONSTRAINT fk_tournament_category
        FOREIGN KEY(id_category)
        REFERENCES categories(id)
        ON DELETE CASCADE      -- Si se elimina la categoría, se eliminan sus torneos
        ON UPDATE CASCADE      -- Si se actualiza el ID, se actualiza en los torneos
) ENGINE=InnoDB;

-- ============================================
-- INSERTAR TORNEOS DE EJEMPLO
-- ============================================
INSERT INTO tournaments(
    name,
    description,
    id_category,
    tournament_date,
    location,
    status,
    max_teams
)
VALUES
(
    'Copa Infantil 2026',
    'Torneo de categorías menores',
    1,
    '2026-06-15',
    'Cancha Principal',
    'Activo',
    8
),
(
    'Liga Juvenil Bogotá',
    'Competencia juvenil distrital',
    2,
    '2026-07-10',
    'Estadio Municipal',
    'Pendiente',
    12
);

-- ============================================
-- CREAR TABLA DE ESTUDIANTES (OPCIONAL)
-- ============================================
CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    document VARCHAR(20) NOT NULL UNIQUE,
    category_id INT,
    birth_date DATE,
    phone VARCHAR(20),
    address VARCHAR(200),
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- VERSION COPIA Y PEGA (TODO EN UN SOLO BLOQUE)
-- ============================================