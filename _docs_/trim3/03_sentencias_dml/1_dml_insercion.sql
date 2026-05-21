/* ************************************************************************************* */
/* ---------------------------------------- DML ---------------------------------------- */
/* ---------------------------- DATA MANIPULATION LANGUAGE ----------------------------- */
/* ------------------------- LENGUAJE DE MANIPULACIÓN DE DATOS ------------------------- */
/* ------------------------------------ BASE SPORTYS ---------------------------------- */
/* ************************************************************************************* */
/* ---------------------- INSERCIÓN DE DATOS EN LAS TABLAS ----------------------------- */
/* ************************************************************************************* */

USE Sportys;

-- ===================================================================================== --
-- TABLA ROL
-- ===================================================================================== --

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE ROL;

INSERT INTO ROL (idROL, NOM_ROL) VALUES
(1, 'Administrador'),
(2, 'Entrenador'),
(3, 'Estudiante');

-- ===================================================================================== --
-- TABLA USUARIO
-- ===================================================================================== --

TRUNCATE TABLE USUARIO;

INSERT INTO USUARIO (
    idUSUARIO,
    NOMBRE,
    APELLIDO,
    CORREO,
    CONTRASENA,
    TELEFONO
) VALUES
(1, 'Juan', 'Pérez', 'juan@gmail.com', SHA1('password'), '3001111111'),
(2, 'María', 'Gómez', 'maria@gmail.com', SHA1('password'), '3002222222'),
(3, 'Carlos', 'Rodríguez', 'carlos@gmail.com', SHA1('password'), '3003333333'),
(4, 'Laura', 'Martínez', 'laura@gmail.com', SHA1('password'), '3004444444'),
(5, 'Andrés', 'López', 'andres@gmail.com', SHA1('password'), '3005555555'),
(6, 'Sofía', 'Ramírez', 'sofia@gmail.com', SHA1('password'), '3006666666');

-- ===================================================================================== --
-- TABLA USUARIO_ROL
-- ===================================================================================== --

TRUNCATE TABLE USUARIO_ROL;

INSERT INTO USUARIO_ROL (
    idUSUARIO_ROL,
    idUSUARIO,
    idROL
) VALUES
(1, 1, 1), -- Juan -> Administrador
(2, 2, 2), -- María -> Entrenador
(3, 3, 3), -- Carlos -> Estudiante
(4, 4, 2), -- Laura -> Entrenador
(5, 5, 3), -- Andrés -> Estudiante
(6, 6, 3); -- Sofía -> Estudiante

-- ===================================================================================== --
-- TABLA ESCUELA
-- ===================================================================================== --

TRUNCATE TABLE ESCUELA;

INSERT INTO ESCUELA (
    idESCUELA,
    NOMBRE_ESCUELA,
    DIRECCION,
    TELEFONO,
    CORREO,
    idUSUARIO
) VALUES
(1, 'Escuela Deportiva Central', 'Calle 10 #20-30', '6011111111', 'central@sportys.com', 1),
(2, 'Academia Elite Soccer', 'Carrera 50 #40-20', '6012222222', 'elite@sportys.com', 1);

-- ===================================================================================== --
-- TABLA EQUIPO
-- ===================================================================================== --

TRUNCATE TABLE EQUIPO;

INSERT INTO EQUIPO (
    idEQUIPO,
    NOMBRE_EQUIPO,
    LOGO,
    idESCUELA
) VALUES
(1, 'Tigres FC', 'tigres.png', 1),
(2, 'Leones FC', 'leones.png', 1),
(3, 'Águilas FC', 'aguilas.png', 2);

-- ===================================================================================== --
-- TABLA CATEGORIA
-- ===================================================================================== --

TRUNCATE TABLE CATEGORIA;

INSERT INTO CATEGORIA (
    idCATEGORIA,
    NOMBRE_CATEGORIA,
    EDAD_MINIMA,
    EDAD_MAXIMA
) VALUES
(1, 'Sub 10', 8, 10),
(2, 'Sub 15', 11, 15),
(3, 'Sub 18', 16, 18);

-- ===================================================================================== --
-- TABLA ENTRENADOR
-- ===================================================================================== --

TRUNCATE TABLE ENTRENADOR;

INSERT INTO ENTRENADOR (
    idENTRENADOR,
    NOMBRE,
    APELLIDO,
    DOCUMENTO,
    TELEFONO,
    idUSUARIO,
    idEQUIPO
) VALUES
(1, 'María', 'Gómez', '100100100', '3101111111', 2, 1),
(2, 'Laura', 'Martínez', '200200200', '3102222222', 4, 2);

-- ===================================================================================== --
-- TABLA ESTUDIANTE
-- ===================================================================================== --

TRUNCATE TABLE ESTUDIANTE;

INSERT INTO ESTUDIANTE (
    idESTUDIANTE,
    NOMBRE,
    APELLIDO,
    DOCUMENTO,
    FECHA_NACIMIENTO,
    idUSUARIO
) VALUES
(1, 'Carlos', 'Rodríguez', '300300300', '2012-05-10', 3),
(2, 'Andrés', 'López', '400400400', '2010-08-15', 5),
(3, 'Sofía', 'Ramírez', '500500500', '2011-02-20', 6);

-- ===================================================================================== --
-- TABLA EQUIPO_ESTUDIANTE
-- ===================================================================================== --

TRUNCATE TABLE EQUIPO_ESTUDIANTE;

INSERT INTO EQUIPO_ESTUDIANTE (
    idEQUIPO_ESTUDIANTE,
    idEQUIPO,
    idESTUDIANTE
) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3);

-- ===================================================================================== --
-- TABLA TORNEO
-- ===================================================================================== --

TRUNCATE TABLE TORNEO;

INSERT INTO TORNEO (
    idTORNEO,
    NOMBRE_TORNEO,
    FECHA_INICIO,
    FECHA_FIN,
    ESTADO
) VALUES
(1, 'Copa Sportys 2026', '2026-06-01', '2026-06-30', 'ACTIVO'),
(2, 'Liga Juvenil 2026', '2026-07-10', '2026-08-20', 'ACTIVO');

-- ===================================================================================== --
-- TABLA TORNEO_EQUIPO
-- ===================================================================================== --

TRUNCATE TABLE TORNEO_EQUIPO;

INSERT INTO TORNEO_EQUIPO (
    idTORNEO_EQUIPO,
    idTORNEO,
    idEQUIPO,
    GRUPO_LETRA,
    PUNTOS,
    PARTIDOS_JUGADOS,
    PARTIDOS_GANADOS,
    PARTIDOS_EMPATADOS,
    PARTIDOS_PERDIDOS
) VALUES
(1, 1, 1, 'A', 6, 2, 2, 0, 0),
(2, 1, 2, 'A', 3, 2, 1, 0, 1),
(3, 1, 3, 'B', 1, 2, 0, 1, 1);

-- ===================================================================================== --
-- TABLA HORARIO
-- ===================================================================================== --

TRUNCATE TABLE HORARIO;

INSERT INTO HORARIO (
    idHORARIO,
    DIA,
    HORA,
    LUGAR,
    idEQUIPO
) VALUES
(1, 'Lunes', '15:00:00', 'Cancha Central', 1),
(2, 'Miércoles', '16:00:00', 'Cancha Norte', 2),
(3, 'Viernes', '14:00:00', 'Cancha Sur', 3);

-- ===================================================================================== --
-- TABLA NOTIFICACION
-- ===================================================================================== --

TRUNCATE TABLE NOTIFICACION;

INSERT INTO NOTIFICACION (
    idNOTIFICACION,
    FECHA,
    HORA,
    LUGAR,
    MENSAJE,
    idTORNEO
) VALUES
(1, '2026-06-01', '08:00:00', 'Estadio Principal', 'Inicio oficial del torneo', 1),
(2, '2026-06-10', '10:00:00', 'Cancha Central', 'Partido semifinal programado', 1);

-- ===================================================================================== --
-- TABLA CATALOGO
-- ===================================================================================== --

TRUNCATE TABLE CATALOGO;

INSERT INTO CATALOGO (
    idPRODUCTO,
    NOMBRE_PRODUCTO,
    DESCRIPCION,
    PRECIO,
    IMAGEN_URL,
    ESTADO,
    idESTUDIANTE
) VALUES
(1, 'Balón Profesional', 'Balón oficial de entrenamiento', 120000, 'balon.png', 'DISPONIBLE', 1),
(2, 'Guayos Nike', 'Guayos para césped natural', 250000, 'guayos.png', 'DISPONIBLE', 2),
(3, 'Uniforme Deportivo', 'Uniforme completo Sportys', 180000, 'uniforme.png', 'AGOTADO', 3);

-- ===================================================================================== --
-- TABLA CATEGORIA_PRODUCTO
-- ===================================================================================== --

TRUNCATE TABLE CATEGORIA_PRODUCTO;

INSERT INTO CATEGORIA_PRODUCTO (
    idCATEGORIA_PRODUCTO,
    NOMBRE_CATEGORIA,
    idPRODUCTO
) VALUES
(1, 'Implementos Deportivos', 1),
(2, 'Calzado Deportivo', 2),
(3, 'Ropa Deportiva', 3);

SET FOREIGN_KEY_CHECKS = 1;

-- ===================================================================================== --
-- FIN DE LAS INSERCIONES
-- ===================================================================================== --