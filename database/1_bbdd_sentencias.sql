-- =====================================================
-- Basada en la estructura de Nexus
-- =====================================================

DROP DATABASE IF EXISTS Sportys;
CREATE DATABASE Sportys DEFAULT CHARACTER SET utf8;
USE Sportys;

-- =====================================================
-- 1. TABLA ROL
-- =====================================================

CREATE TABLE IF NOT EXISTS ROL (
    idROL INT PRIMARY KEY AUTO_INCREMENT,
    NOM_ROL VARCHAR(50) NOT NULL
) ENGINE = InnoDB;

-- =====================================================
-- 2. TABLA USUARIO
-- =====================================================

CREATE TABLE IF NOT EXISTS USUARIO (
    idUSUARIO INT PRIMARY KEY AUTO_INCREMENT,
    NOMBRE VARCHAR(45) NOT NULL,
    APELLIDO VARCHAR(45) NOT NULL,
    CORREO VARCHAR(70) NOT NULL UNIQUE,
    CONTRASENA VARCHAR(300) NOT NULL,
    TELEFONO VARCHAR(20),
    FECHA_REGISTRO DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE = InnoDB;

-- =====================================================
-- 3. TABLA USUARIO_ROL
-- =====================================================

CREATE TABLE IF NOT EXISTS USUARIO_ROL (
    idUSUARIO_ROL INT PRIMARY KEY AUTO_INCREMENT,
    idUSUARIO INT NOT NULL,
    idROL INT NOT NULL,

    CONSTRAINT fk_usuarioRol_usuario
        FOREIGN KEY (idUSUARIO)
        REFERENCES USUARIO(idUSUARIO)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_usuarioRol_rol
        FOREIGN KEY (idROL)
        REFERENCES ROL(idROL)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- 4. TABLA ESCUELA
-- =====================================================

CREATE TABLE IF NOT EXISTS ESCUELA (
    idESCUELA INT PRIMARY KEY AUTO_INCREMENT,
    NOMBRE_ESCUELA VARCHAR(60) NOT NULL,
    DIRECCION VARCHAR(100),
    TELEFONO VARCHAR(20),
    CORREO VARCHAR(70),

    idUSUARIO INT NOT NULL,

    CONSTRAINT fk_escuela_usuario
        FOREIGN KEY (idUSUARIO)
        REFERENCES USUARIO(idUSUARIO)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- 5. TABLA EQUIPO
-- =====================================================

CREATE TABLE IF NOT EXISTS EQUIPO (
    idEQUIPO INT PRIMARY KEY AUTO_INCREMENT,
    NOMBRE_EQUIPO VARCHAR(60) NOT NULL,
    LOGO VARCHAR(300),

    idESCUELA INT NOT NULL,

    CONSTRAINT fk_equipo_escuela
        FOREIGN KEY (idESCUELA)
        REFERENCES ESCUELA(idESCUELA)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- 6. TABLA CATEGORIA
-- =====================================================

CREATE TABLE IF NOT EXISTS CATEGORIA (
    idCATEGORIA INT PRIMARY KEY AUTO_INCREMENT,
    NOMBRE_CATEGORIA VARCHAR(45) NOT NULL,
    EDAD_MINIMA INT NOT NULL,
    EDAD_MAXIMA INT NOT NULL
) ENGINE = InnoDB;

-- =====================================================
-- 7. TABLA ENTRENADOR
-- =====================================================

CREATE TABLE IF NOT EXISTS ENTRENADOR (
    idENTRENADOR INT PRIMARY KEY AUTO_INCREMENT,
    NOMBRE VARCHAR(45) NOT NULL,
    APELLIDO VARCHAR(45) NOT NULL,
    DOCUMENTO VARCHAR(30) NOT NULL,
    TELEFONO VARCHAR(20),

    idUSUARIO INT NOT NULL,
    idEQUIPO INT NOT NULL,

    CONSTRAINT fk_entrenador_usuario
        FOREIGN KEY (idUSUARIO)
        REFERENCES USUARIO(idUSUARIO)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_entrenador_equipo
        FOREIGN KEY (idEQUIPO)
        REFERENCES EQUIPO(idEQUIPO)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- 8. TABLA ESTUDIANTE
-- =====================================================

CREATE TABLE IF NOT EXISTS ESTUDIANTE (
    idESTUDIANTE INT PRIMARY KEY AUTO_INCREMENT,
    NOMBRE VARCHAR(45) NOT NULL,
    APELLIDO VARCHAR(45) NOT NULL,
    DOCUMENTO VARCHAR(30) NOT NULL,
    FECHA_NACIMIENTO DATE NOT NULL,

    idUSUARIO INT NOT NULL,

    CONSTRAINT fk_estudiante_usuario
        FOREIGN KEY (idUSUARIO)
        REFERENCES USUARIO(idUSUARIO)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- 9. TABLA EQUIPO_ESTUDIANTE
-- =====================================================

CREATE TABLE IF NOT EXISTS EQUIPO_ESTUDIANTE (
    idEQUIPO_ESTUDIANTE INT PRIMARY KEY AUTO_INCREMENT,

    idEQUIPO INT NOT NULL,
    idESTUDIANTE INT NOT NULL,

    CONSTRAINT fk_equipoEstudiante_equipo
        FOREIGN KEY (idEQUIPO)
        REFERENCES EQUIPO(idEQUIPO)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_equipoEstudiante_estudiante
        FOREIGN KEY (idESTUDIANTE)
        REFERENCES ESTUDIANTE(idESTUDIANTE)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- 10. TABLA TORNEO
-- =====================================================

CREATE TABLE IF NOT EXISTS TORNEO (
    idTORNEO INT PRIMARY KEY AUTO_INCREMENT,
    NOMBRE_TORNEO VARCHAR(60) NOT NULL,
    FECHA_INICIO DATE NOT NULL,
    FECHA_FIN DATE NOT NULL,

    ESTADO ENUM('ACTIVO', 'FINALIZADO', 'CANCELADO')
    DEFAULT 'ACTIVO'
) ENGINE = InnoDB;

-- =====================================================
-- 11. TABLA TORNEO_EQUIPO
-- =====================================================

CREATE TABLE IF NOT EXISTS TORNEO_EQUIPO (
    idTORNEO_EQUIPO INT PRIMARY KEY AUTO_INCREMENT,

    idTORNEO INT NOT NULL,
    idEQUIPO INT NOT NULL,

    GRUPO_LETRA VARCHAR(5),
    PUNTOS INT DEFAULT 0,
    PARTIDOS_JUGADOS INT DEFAULT 0,
    PARTIDOS_GANADOS INT DEFAULT 0,
    PARTIDOS_EMPATADOS INT DEFAULT 0,
    PARTIDOS_PERDIDOS INT DEFAULT 0,

    CONSTRAINT fk_torneoEquipo_torneo
        FOREIGN KEY (idTORNEO)
        REFERENCES TORNEO(idTORNEO)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_torneoEquipo_equipo
        FOREIGN KEY (idEQUIPO)
        REFERENCES EQUIPO(idEQUIPO)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- 12. TABLA HORARIO
-- =====================================================

CREATE TABLE IF NOT EXISTS HORARIO (
    idHORARIO INT PRIMARY KEY AUTO_INCREMENT,

    DIA VARCHAR(20) NOT NULL,
    HORA TIME NOT NULL,
    LUGAR VARCHAR(80),

    idEQUIPO INT NOT NULL,

    CONSTRAINT fk_horario_equipo
        FOREIGN KEY (idEQUIPO)
        REFERENCES EQUIPO(idEQUIPO)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- 13. TABLA NOTIFICACION
-- =====================================================

CREATE TABLE IF NOT EXISTS NOTIFICACION (
    idNOTIFICACION INT PRIMARY KEY AUTO_INCREMENT,

    FECHA DATE NOT NULL,
    HORA TIME NOT NULL,
    LUGAR VARCHAR(80),
    MENSAJE TEXT NOT NULL,

    idTORNEO INT NOT NULL,

    CONSTRAINT fk_notificacion_torneo
        FOREIGN KEY (idTORNEO)
        REFERENCES TORNEO(idTORNEO)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- 14. TABLA CATALOGO
-- =====================================================

CREATE TABLE IF NOT EXISTS CATALOGO (
    idPRODUCTO INT PRIMARY KEY AUTO_INCREMENT,

    NOMBRE_PRODUCTO VARCHAR(60) NOT NULL,
    DESCRIPCION TEXT NOT NULL,
    PRECIO INT NOT NULL,
    IMAGEN_URL VARCHAR(300),

    ESTADO ENUM('DISPONIBLE', 'AGOTADO', 'INACTIVO')
    DEFAULT 'DISPONIBLE',

    idESTUDIANTE INT NOT NULL,

    CONSTRAINT fk_catalogo_estudiante
        FOREIGN KEY (idESTUDIANTE)
        REFERENCES ESTUDIANTE(idESTUDIANTE)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;

-- =====================================================
-- 15. TABLA CATEGORIA_PRODUCTO
-- =====================================================

CREATE TABLE IF NOT EXISTS CATEGORIA_PRODUCTO (
    idCATEGORIA_PRODUCTO INT PRIMARY KEY AUTO_INCREMENT,

    NOMBRE_CATEGORIA VARCHAR(45) NOT NULL,

    idPRODUCTO INT NOT NULL,

    CONSTRAINT fk_categoriaProducto_catalogo
        FOREIGN KEY (idPRODUCTO)
        REFERENCES CATALOGO(idPRODUCTO)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;