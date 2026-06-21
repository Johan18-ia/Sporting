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
-- CREAR TABLA DE USUARIOS
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,              -- Identificador único del usuario
    name VARCHAR(100) NOT NULL,                     -- Nombre del usuario
    lastname VARCHAR(100) NOT NULL,                 -- Apellido del usuario
    email VARCHAR(150) NOT NULL UNIQUE,             -- Correo electrónico (único)
    password VARCHAR(255) NOT NULL,                 -- Contraseña hasheada
    phone VARCHAR(20),                              -- Número de teléfono
    image VARCHAR(255),                             -- URL de la imagen de perfil
    role VARCHAR(20),                               -- Rol del usuario (admin, user, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de actualización
) ENGINE=InnoDB;

-- ============================================
-- INSERTAR USUARIO ADMIN
-- ============================================
INSERT INTO users VALUES (
    null,
    "Albeiro",
    "Ramos",
    "profealbeiro2020@gmail.com",
    "$2b$10$NR8eRuuAB12JoHe81ZYnG.i2/5k/D5TKrxc7Pk74W4rgzADdABM9G", -- Contraseña hasheada
    "3103103101",
    "profile",
    "admin",
    null,
    null
);

-- ============================================
-- CREAR TABLA DE PRODUCTOS
-- ============================================
CREATE TABLE product(
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
INSERT INTO product(
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
-- CREAR TABLA DE CATEGORÍAS
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
-- VERSION COPIA Y PEGA
-- ============================================

DROP DATABASE IF EXISTS db_node;
CREATE SCHEMA db_node DEFAULT CHARACTER SET utf8;
USE db_node;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    image VARCHAR(255),
    role VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO users VALUES (
    null,
    "Albeiro",
    "Ramos",
    "profealbeiro2020@gmail.com",
    "$2b$10$NR8eRuuAB12JoHe81ZYnG.i2/5k/D5TKrxc7Pk74W4rgzADdABM9G",
    "3103103101",
    "profile",
    "admin",
    null,
    null
);

CREATE TABLE productos(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    imagen VARCHAR(255),
    categoria VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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

CREATE TABLE categories(
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_year INT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

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

CREATE TABLE schedules(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_category INT NOT NULL,
    day_of_week VARCHAR(30) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    field_name VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedule_category
        FOREIGN KEY(id_category)
        REFERENCES categories(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

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

CREATE TABLE tournaments(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    id_category INT NOT NULL,
    tournament_date DATE,
    location VARCHAR(150),
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