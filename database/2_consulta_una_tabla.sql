/* ************************************************************************************* */
/* ---------------------------------------- DML ---------------------------------------- */
/* ---------------------------- DATA MANIPULATION LANGUAGE ----------------------------- */
/* ------------------------- LENGUAJE DE MANIPULACIÓN DE DATOS ------------------------- */
/* ------------------------ ADAPTADO PARA BASE DE DATOS SPORTYS ------------------------ */
/* ************************************************************************************* */

USE Sportys;

/* ************************************************************************************* */
/* -------------------------- 1. CONSULTAS DE ACCIÓN [Inicio] -------------------------- */
/* ---------------------------- INSERT INTO, UPDATE, DELETE ---------------------------- */
/* ************************************************************************************* */

-- ===================================================================================== --
-- 1.1. INSERT INTO
-- ===================================================================================== --

-- ------------------------------------------------------------------------------------- --
-- Tabla ROL
-- ------------------------------------------------------------------------------------- --
INSERT INTO ROL (idROL, NOM_ROL) VALUES
(1, 'Administrador'),
(2, 'Entrenador'),
(3, 'Estudiante');

-- ------------------------------------------------------------------------------------- --
-- Tabla USUARIO
-- ------------------------------------------------------------------------------------- --
INSERT INTO USUARIO (
    idUSUARIO,
    NOMBRE,
    APELLIDO,
    CORREO,
    CONTRASENA,
    TELEFONO
) VALUES
(1, 'Juan', 'Pérez', 'juan@gmail.com', SHA1('12345'), '3001112233'),
(2, 'María', 'Gómez', 'maria@gmail.com', SHA1('12345'), '3001112234'),
(3, 'Carlos', 'Ramírez', 'carlos@gmail.com', SHA1('12345'), '3001112235'),
(4, 'Laura', 'Martínez', 'laura@gmail.com', SHA1('12345'), '3001112236');

-- ------------------------------------------------------------------------------------- --
-- Tabla USUARIO_ROL
-- ------------------------------------------------------------------------------------- --
INSERT INTO USUARIO_ROL (
    idUSUARIO_ROL,
    idUSUARIO,
    idROL
) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 3);

-- ------------------------------------------------------------------------------------- --
-- Tabla ESCUELA
-- ------------------------------------------------------------------------------------- --
INSERT INTO ESCUELA (
    idESCUELA,
    NOMBRE_ESCUELA,
    DIRECCION,
    TELEFONO,
    CORREO,
    idUSUARIO
) VALUES
(1, 'Escuela Deportiva Central', 'Calle 10 #20-30', '6012223344', 'escuela@gmail.com', 1);

-- ------------------------------------------------------------------------------------- --
-- Tabla EQUIPO
-- ------------------------------------------------------------------------------------- --
INSERT INTO EQUIPO (
    idEQUIPO,
    NOMBRE_EQUIPO,
    LOGO,
    idESCUELA
) VALUES
(1, 'Tigres FC', 'tigres.png', 1),
(2, 'Leones FC', 'leones.png', 1);

-- ------------------------------------------------------------------------------------- --
-- Tabla CATEGORIA
-- ------------------------------------------------------------------------------------- --
INSERT INTO CATEGORIA (
    idCATEGORIA,
    NOMBRE_CATEGORIA,
    EDAD_MINIMA,
    EDAD_MAXIMA
) VALUES
(1, 'Infantil', 8, 12),
(2, 'Juvenil', 13, 17),
(3, 'Mayores', 18, 30);

-- ------------------------------------------------------------------------------------- --
-- Tabla ENTRENADOR
-- ------------------------------------------------------------------------------------- --
INSERT INTO ENTRENADOR (
    idENTRENADOR,
    NOMBRE,
    APELLIDO,
    DOCUMENTO,
    TELEFONO,
    idUSUARIO,
    idEQUIPO
) VALUES
(1, 'Pedro', 'López', '100200300', '3102223344', 2, 1);

-- ------------------------------------------------------------------------------------- --
-- Tabla ESTUDIANTE
-- ------------------------------------------------------------------------------------- --
INSERT INTO ESTUDIANTE (
    idESTUDIANTE,
    NOMBRE,
    APELLIDO,
    DOCUMENTO,
    FECHA_NACIMIENTO,
    idUSUARIO
) VALUES
(1, 'Andrés', 'Ruiz', '111222333', '2010-05-10', 3),
(2, 'Sofía', 'Torres', '444555666', '2009-03-15', 4);

-- ------------------------------------------------------------------------------------- --
-- Tabla EQUIPO_ESTUDIANTE
-- ------------------------------------------------------------------------------------- --
INSERT INTO EQUIPO_ESTUDIANTE (
    idEQUIPO_ESTUDIANTE,
    idEQUIPO,
    idESTUDIANTE
) VALUES
(1, 1, 1),
(2, 2, 2);

-- ------------------------------------------------------------------------------------- --
-- Tabla TORNEO
-- ------------------------------------------------------------------------------------- --
INSERT INTO TORNEO (
    idTORNEO,
    NOMBRE_TORNEO,
    FECHA_INICIO,
    FECHA_FIN,
    ESTADO
) VALUES
(1, 'Copa Sportys 2026', '2026-06-01', '2026-06-30', 'ACTIVO');

-- ------------------------------------------------------------------------------------- --
-- Tabla TORNEO_EQUIPO
-- ------------------------------------------------------------------------------------- --
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
(2, 1, 2, 'A', 3, 2, 1, 0, 1);

-- ------------------------------------------------------------------------------------- --
-- Tabla HORARIO
-- ------------------------------------------------------------------------------------- --
INSERT INTO HORARIO (
    idHORARIO,
    DIA,
    HORA,
    LUGAR,
    idEQUIPO
) VALUES
(1, 'Lunes', '15:00:00', 'Cancha Principal', 1),
(2, 'Miércoles', '16:00:00', 'Cancha Auxiliar', 2);

-- ------------------------------------------------------------------------------------- --
-- Tabla NOTIFICACION
-- ------------------------------------------------------------------------------------- --
INSERT INTO NOTIFICACION (
    idNOTIFICACION,
    FECHA,
    HORA,
    LUGAR,
    MENSAJE,
    idTORNEO
) VALUES
(1, '2026-06-01', '08:00:00', 'Coliseo Central', 'Inicio oficial del torneo', 1);

-- ------------------------------------------------------------------------------------- --
-- Tabla CATALOGO
-- ------------------------------------------------------------------------------------- --
INSERT INTO CATALOGO (
    idPRODUCTO,
    NOMBRE_PRODUCTO,
    DESCRIPCION,
    PRECIO,
    IMAGEN_URL,
    ESTADO,
    idESTUDIANTE
) VALUES
(1, 'Guayos Nike', 'Guayos profesionales para fútbol', 250000, 'guayos.png', 'DISPONIBLE', 1),
(2, 'Balón Adidas', 'Balón oficial tamaño 5', 120000, 'balon.png', 'DISPONIBLE', 2);

-- ------------------------------------------------------------------------------------- --
-- Tabla CATEGORIA_PRODUCTO
-- ------------------------------------------------------------------------------------- --
INSERT INTO CATEGORIA_PRODUCTO (
    idCATEGORIA_PRODUCTO,
    NOMBRE_CATEGORIA,
    idPRODUCTO
) VALUES
(1, 'Implementos Deportivos', 1),
(2, 'Balones', 2);

/* ************************************************************************************* */
/* ----------------------------------- 2. UPDATE -------------------------------------- */
/* ************************************************************************************* */

-- Actualizar teléfono de usuario
UPDATE USUARIO
SET TELEFONO = '3119998877'
WHERE idUSUARIO = 1;

-- Actualizar estado del torneo
UPDATE TORNEO
SET ESTADO = 'FINALIZADO'
WHERE idTORNEO = 1;

-- Actualizar precio de producto
UPDATE CATALOGO
SET PRECIO = 270000
WHERE idPRODUCTO = 1;

/* ************************************************************************************* */
/* ----------------------------------- 3. DELETE -------------------------------------- */
/* ************************************************************************************* */

-- Eliminar una notificación
DELETE FROM NOTIFICACION
WHERE idNOTIFICACION = 1;

-- Eliminar un horario
DELETE FROM HORARIO
WHERE idHORARIO = 2;

/* ************************************************************************************* */
/* ----------------------------- 4. CONSULTAS SELECT ---------------------------------- */
/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
-- 4.1. Consultas Generales
-- ------------------------------------------------------------------------------------- --
SELECT * FROM ROL;
SELECT * FROM USUARIO;
SELECT * FROM ESCUELA;
SELECT * FROM EQUIPO;
SELECT * FROM CATEGORIA;
SELECT * FROM ENTRENADOR;
SELECT * FROM ESTUDIANTE;
SELECT * FROM TORNEO;
SELECT * FROM HORARIO;
SELECT * FROM NOTIFICACION;
SELECT * FROM CATALOGO;

-- ------------------------------------------------------------------------------------- --
-- 4.2. Consultas Específicas
-- ------------------------------------------------------------------------------------- --
SELECT idUSUARIO, NOMBRE, CORREO
FROM USUARIO;

SELECT idEQUIPO, NOMBRE_EQUIPO
FROM EQUIPO;

-- ------------------------------------------------------------------------------------- --
-- 4.3. Consultas con WHERE
-- ------------------------------------------------------------------------------------- --
SELECT *
FROM TORNEO
WHERE ESTADO = 'ACTIVO';

SELECT *
FROM CATALOGO
WHERE PRECIO > 100000;

-- ------------------------------------------------------------------------------------- --
-- 4.4. Operadores Lógicos
-- ------------------------------------------------------------------------------------- --

-- OR
SELECT *
FROM CATEGORIA
WHERE EDAD_MINIMA = 8 OR EDAD_MINIMA = 13;

-- AND
SELECT *
FROM TORNEO
WHERE ESTADO = 'ACTIVO'
AND FECHA_INICIO = '2026-06-01';

-- NOT
SELECT *
FROM CATALOGO
WHERE ESTADO NOT IN ('AGOTADO');

-- ------------------------------------------------------------------------------------- --
-- 4.5. Operadores de Comparación
-- ------------------------------------------------------------------------------------- --

SELECT *
FROM CATALOGO
WHERE PRECIO <> 250000;

SELECT *
FROM CATALOGO
WHERE PRECIO < 250000;

SELECT *
FROM CATALOGO
WHERE PRECIO > 100000;

SELECT *
FROM CATALOGO
WHERE PRECIO <= 250000;

SELECT *
FROM CATALOGO
WHERE PRECIO >= 120000;

-- ------------------------------------------------------------------------------------- --
-- 4.6. LIKE, BETWEEN, IN
-- ------------------------------------------------------------------------------------- --

SELECT *
FROM EQUIPO
WHERE NOMBRE_EQUIPO LIKE 'T%';

SELECT *
FROM TORNEO
WHERE FECHA_INICIO BETWEEN '2026-01-01' AND '2026-12-31';

SELECT *
FROM CATEGORIA
WHERE idCATEGORIA IN (1, 2);

-- ------------------------------------------------------------------------------------- --
-- 4.7. ORDER BY
-- ------------------------------------------------------------------------------------- --

SELECT *
FROM CATALOGO
ORDER BY PRECIO ASC;

SELECT *
FROM CATALOGO
ORDER BY PRECIO DESC;

-- ------------------------------------------------------------------------------------- --
-- 4.8. Funciones de Agregación
-- ------------------------------------------------------------------------------------- --

SELECT SUM(PRECIO) AS total_catalogo
FROM CATALOGO;

SELECT AVG(PRECIO) AS promedio_precio
FROM CATALOGO;

SELECT MAX(PRECIO) AS precio_maximo
FROM CATALOGO;

SELECT MIN(PRECIO) AS precio_minimo
FROM CATALOGO;

SELECT COUNT(idPRODUCTO) AS cantidad_productos
FROM CATALOGO;

-- ------------------------------------------------------------------------------------- --
-- 4.9. GROUP BY
-- ------------------------------------------------------------------------------------- --

SELECT ESTADO, COUNT(idPRODUCTO) AS cantidad
FROM CATALOGO
GROUP BY ESTADO;

-- ------------------------------------------------------------------------------------- --
-- 4.10. HAVING
-- ------------------------------------------------------------------------------------- --

SELECT ESTADO, COUNT(idPRODUCTO) AS cantidad
FROM CATALOGO
GROUP BY ESTADO
HAVING COUNT(idPRODUCTO) >= 1;

-- ------------------------------------------------------------------------------------- --
-- 4.11. Funciones con Fechas
-- ------------------------------------------------------------------------------------- --

SELECT NOMBRE_TORNEO, NOW() AS fecha_actual
FROM TORNEO;

SELECT
NOMBRE_TORNEO,
DATE_FORMAT(NOW(), '%Y-%m-%d') AS fecha_formateada
FROM TORNEO;

SELECT
NOMBRE_TORNEO,
TIMESTAMPDIFF(DAY, FECHA_INICIO, NOW()) AS dias_transcurridos
FROM TORNEO;

-- ------------------------------------------------------------------------------------- --
-- 4.12. JOINS
-- ------------------------------------------------------------------------------------- --

-- Equipos con nombre de escuela
SELECT
e.NOMBRE_EQUIPO,
es.NOMBRE_ESCUELA
FROM EQUIPO e
JOIN ESCUELA es
ON e.idESCUELA = es.idESCUELA;

-- Estudiantes con equipo
SELECT
est.NOMBRE,
est.APELLIDO,
eq.NOMBRE_EQUIPO
FROM ESTUDIANTE est
JOIN EQUIPO_ESTUDIANTE ee
ON est.idESTUDIANTE = ee.idESTUDIANTE
JOIN EQUIPO eq
ON ee.idEQUIPO = eq.idEQUIPO;

-- Productos del catálogo con estudiante
SELECT
c.NOMBRE_PRODUCTO,
c.PRECIO,
e.NOMBRE
FROM CATALOGO c
JOIN ESTUDIANTE e
ON c.idESTUDIANTE = e.idESTUDIANTE;