/* ************************************************************************************* */
/* ------------------------------- SUBCONSULTAS SQL ------------------------------------ */
/* ---------------------------- BASE DE DATOS SPORTYS ---------------------------------- */
/* ************************************************************************************* */

USE Sportys;

-- ===================================================================================== --
-- PRODUCTOS DEL CATÁLOGO CON PRECIO MAYOR AL PROMEDIO
-- ===================================================================================== --
SELECT 
    NOMBRE_PRODUCTO,
    PRECIO
FROM CATALOGO
WHERE PRECIO > (
    SELECT AVG(PRECIO)
    FROM CATALOGO
);

-- ===================================================================================== --
-- USUARIOS QUE SON ENTRENADORES
-- ===================================================================================== --
SELECT 
    NOMBRE,
    APELLIDO,
    CORREO
FROM USUARIO
WHERE idUSUARIO IN (
    SELECT idUSUARIO
    FROM USUARIO_ROL
    WHERE idROL = (
        SELECT idROL
        FROM ROL
        WHERE NOM_ROL = 'Entrenador'
    )
);

-- ===================================================================================== --
-- ESCUELAS QUE TIENEN EQUIPOS REGISTRADOS
-- ===================================================================================== --
SELECT 
    NOMBRE_ESCUELA
FROM ESCUELA es
WHERE EXISTS (
    SELECT 1
    FROM EQUIPO eq
    WHERE eq.idESCUELA = es.idESCUELA
);

-- ===================================================================================== --
-- PRODUCTOS MÁS CAROS QUE TODOS LOS PRODUCTOS DE UN ESTUDIANTE
-- ===================================================================================== --
SELECT 
    NOMBRE_PRODUCTO,
    PRECIO
FROM CATALOGO
WHERE PRECIO > ALL (
    SELECT PRECIO
    FROM CATALOGO
    WHERE idESTUDIANTE = 2
);

-- ===================================================================================== --
-- PRODUCTOS CON EL MISMO PRECIO QUE ALGÚN PRODUCTO MAYOR A 200000
-- ===================================================================================== --
SELECT 
    NOMBRE_PRODUCTO,
    PRECIO
FROM CATALOGO
WHERE PRECIO = ANY (
    SELECT PRECIO
    FROM CATALOGO
    WHERE PRECIO > 200000
);

-- ===================================================================================== --
-- EQUIPOS QUE PARTICIPAN EN TORNEOS ACTIVOS
-- ===================================================================================== --
SELECT 
    NOMBRE_EQUIPO
FROM EQUIPO
WHERE idEQUIPO IN (
    SELECT te.idEQUIPO
    FROM TORNEO_EQUIPO te
    JOIN TORNEO t
        ON te.idTORNEO = t.idTORNEO
    WHERE t.ESTADO = 'ACTIVO'
);

-- ===================================================================================== --
-- ESTUDIANTES QUE PERTENECEN A UN EQUIPO
-- ===================================================================================== --
SELECT 
    NOMBRE,
    APELLIDO
FROM ESTUDIANTE est
WHERE EXISTS (
    SELECT 1
    FROM EQUIPO_ESTUDIANTE ee
    WHERE ee.idESTUDIANTE = est.idESTUDIANTE
);

-- ===================================================================================== --
-- PRODUCTOS CON PRECIO IGUAL AL MÁXIMO DEL CATÁLOGO
-- ===================================================================================== --
SELECT 
    NOMBRE_PRODUCTO,
    PRECIO
FROM CATALOGO
WHERE PRECIO = (
    SELECT MAX(PRECIO)
    FROM CATALOGO
);

-- ===================================================================================== --
-- TORNEOS CON MÁS PUNTOS PROMEDIO QUE EL PROMEDIO GENERAL
-- ===================================================================================== --
SELECT 
    idTORNEO,
    AVG(PUNTOS) AS promedio_puntos
FROM TORNEO_EQUIPO
GROUP BY idTORNEO
HAVING AVG(PUNTOS) > (
    SELECT AVG(PUNTOS)
    FROM TORNEO_EQUIPO
);

-- ===================================================================================== --
-- EQUIPOS CON MÁS ESTUDIANTES QUE EL PROMEDIO
-- ===================================================================================== --
SELECT 
    eq.NOMBRE_EQUIPO,
    COUNT(ee.idESTUDIANTE) AS total_estudiantes
FROM EQUIPO eq
JOIN EQUIPO_ESTUDIANTE ee
    ON eq.idEQUIPO = ee.idEQUIPO
GROUP BY eq.idEQUIPO
HAVING COUNT(ee.idESTUDIANTE) > (
    SELECT AVG(cantidad_estudiantes)
    FROM (
        SELECT COUNT(idESTUDIANTE) AS cantidad_estudiantes
        FROM EQUIPO_ESTUDIANTE
        GROUP BY idEQUIPO
    ) AS promedio_equipos
);