-- BIGINT porque pueden existir muchos productos

-- ============================================
-- CREAR BASE DE DATOS
-- ============================================
DROP DATABASE IF EXISTS db_node;
CREATE SCHEMA db_node DEFAULT CHARACTER SET utf8 ;

USE db_node;

-- ============================================
-- CREAR TABLA SER USUARIOS
-- ============================================
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

-- ============================================
-- INSERTAR USUARIO
-- ============================================
USE db_node;

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

-- ============================================
-- CREAR TABLA DE PRODUCTOS
-- ============================================
USE db_node;

CREATE TABLE product(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DOUBLE NOT NULL,
    stock INT NOT NULL,
    imagen VARCHAR(255),
    categoria VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
-- ============================================
-- INSERTAR PRODUCTO
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
-- CREAR TABLA DE CATEGORÍAS
-- ============================================
USE db_node;

CREATE TABLE categories(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_year INT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
-- ============================================
-- INSERTAR CATEGORÍAS
-- ============================================
INSERT INTO categories(
    name_year,
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
USE db_node;

CREATE TABLE schedules(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_category INT NOT NULL,
    day_of_week VARCHAR(30) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    field_name VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    -- Llave foránea
    CONSTRAINT fk_schedule_category
        FOREIGN KEY(id_category)
        REFERENCES categories(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

) ENGINE=InnoDB;
-- ============================================
-- INSERTAR HORARIOS
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
USE db_node;

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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    -- Llave foránea con categorías
    CONSTRAINT fk_tournament_category
        FOREIGN KEY(id_category)
        REFERENCES categories(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

) ENGINE=InnoDB;
-- ============================================
-- INSERTAR TORNEOS
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