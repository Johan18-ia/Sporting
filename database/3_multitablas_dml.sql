/* ************************************************************************************* */
/* ---------------------------- CONSULTAS MULTITABLA ----------------------------------- */
/* ---------------------------- BASE DE DATOS SPORTYS ---------------------------------- */
/* ************************************************************************************* */

USE Sportys;

-- ===================================================================================== --
-- USUARIO + ROL + TORNEO
-- ===================================================================================== --
SELECT 
    u.NOMBRE,
    u.APELLIDO,
    u.CORREO,
    r.NOM_ROL,
    t.NOMBRE_TORNEO,
    t.FECHA_INICIO,
    t.ESTADO
FROM USUARIO u
JOIN USUARIO_ROL ur 
    ON u.idUSUARIO = ur.idUSUARIO
JOIN ROL r 
    ON ur.idROL = r.idROL
LEFT JOIN TORNEO t 
    ON t.ESTADO = 'ACTIVO';

-- ===================================================================================== --
-- ESCUELA + EQUIPO + ENTRENADOR
-- ===================================================================================== --
SELECT 
    es.NOMBRE_ESCUELA,
    eq.NOMBRE_EQUIPO,
    en.NOMBRE AS nombre_entrenador,
    en.APELLIDO AS apellido_entrenador,
    en.TELEFONO
FROM ESCUELA es
JOIN EQUIPO eq 
    ON es.idESCUELA = eq.idESCUELA
JOIN ENTRENADOR en 
    ON eq.idEQUIPO = en.idEQUIPO;

-- ===================================================================================== --
-- EQUIPO + ESTUDIANTE
-- ===================================================================================== --
SELECT 
    eq.NOMBRE_EQUIPO,
    est.NOMBRE,
    est.APELLIDO,
    est.DOCUMENTO,
    est.FECHA_NACIMIENTO
FROM EQUIPO eq
JOIN EQUIPO_ESTUDIANTE ee 
    ON eq.idEQUIPO = ee.idEQUIPO
JOIN ESTUDIANTE est 
    ON ee.idESTUDIANTE = est.idESTUDIANTE;

-- ===================================================================================== --
-- TORNEO + EQUIPOS PARTICIPANTES
-- ===================================================================================== --
SELECT 
    t.NOMBRE_TORNEO,
    eq.NOMBRE_EQUIPO,
    te.GRUPO_LETRA,
    te.PUNTOS,
    te.PARTIDOS_GANADOS
FROM TORNEO t
JOIN TORNEO_EQUIPO te 
    ON t.idTORNEO = te.idTORNEO
JOIN EQUIPO eq 
    ON te.idEQUIPO = eq.idEQUIPO;

-- ===================================================================================== --
-- HORARIO + EQUIPO
-- ===================================================================================== --
SELECT 
    h.DIA,
    h.HORA,
    h.LUGAR,
    eq.NOMBRE_EQUIPO
FROM HORARIO h
JOIN EQUIPO eq 
    ON h.idEQUIPO = eq.idEQUIPO;

-- ===================================================================================== --
-- NOTIFICACION + TORNEO
-- ===================================================================================== --
SELECT 
    n.MENSAJE,
    n.FECHA,
    n.HORA,
    n.LUGAR,
    t.NOMBRE_TORNEO
FROM NOTIFICACION n
JOIN TORNEO t 
    ON n.idTORNEO = t.idTORNEO;

-- ===================================================================================== --
-- CATALOGO + ESTUDIANTE
-- ===================================================================================== --
SELECT 
    c.NOMBRE_PRODUCTO,
    c.DESCRIPCION,
    c.PRECIO,
    c.ESTADO,
    e.NOMBRE,
    e.APELLIDO
FROM CATALOGO c
JOIN ESTUDIANTE e 
    ON c.idESTUDIANTE = e.idESTUDIANTE;

-- ===================================================================================== --
-- CATALOGO + CATEGORIA_PRODUCTO
-- ===================================================================================== --
SELECT 
    c.NOMBRE_PRODUCTO,
    cp.NOMBRE_CATEGORIA,
    c.PRECIO,
    c.ESTADO
FROM CATALOGO c
JOIN CATEGORIA_PRODUCTO cp 
    ON c.idPRODUCTO = cp.idPRODUCTO;

-- ===================================================================================== --
-- PRODUCTOS DEL CATÁLOGO ORDENADOS POR PRECIO
-- ===================================================================================== --
SELECT 
    NOMBRE_PRODUCTO,
    PRECIO,
    ESTADO
FROM CATALOGO
ORDER BY PRECIO DESC;

-- ===================================================================================== --
-- EQUIPOS CON CANTIDAD DE ESTUDIANTES
-- ===================================================================================== --
SELECT 
    eq.NOMBRE_EQUIPO,
    COUNT(ee.idESTUDIANTE) AS cantidad_estudiantes
FROM EQUIPO eq
JOIN EQUIPO_ESTUDIANTE ee 
    ON eq.idEQUIPO = ee.idEQUIPO
GROUP BY eq.idEQUIPO;

-- ===================================================================================== --
-- TORNEOS ACTIVOS
-- ===================================================================================== --
SELECT 
    NOMBRE_TORNEO,
    FECHA_INICIO,
    FECHA_FIN,
    ESTADO
FROM TORNEO
WHERE ESTADO = 'ACTIVO';

-- ===================================================================================== --
-- CONSULTA COMPLETA TIPO DASHBOARD
-- ===================================================================================== --
SELECT 
    u.NOMBRE AS nombre_usuario,
    u.APELLIDO,
    r.NOM_ROL,
    es.NOMBRE_ESCUELA,
    eq.NOMBRE_EQUIPO,
    t.NOMBRE_TORNEO,
    c.NOMBRE_PRODUCTO,
    c.PRECIO,
    cp.NOMBRE_CATEGORIA
FROM USUARIO u
JOIN USUARIO_ROL ur 
    ON u.idUSUARIO = ur.idUSUARIO
JOIN ROL r 
    ON ur.idROL = r.idROL
LEFT JOIN ESCUELA es 
    ON u.idUSUARIO = es.idUSUARIO
LEFT JOIN EQUIPO eq 
    ON es.idESCUELA = eq.idESCUELA
LEFT JOIN TORNEO_EQUIPO te 
    ON eq.idEQUIPO = te.idEQUIPO
LEFT JOIN TORNEO t 
    ON te.idTORNEO = t.idTORNEO
LEFT JOIN ESTUDIANTE est 
    ON u.idUSUARIO = est.idUSUARIO
LEFT JOIN CATALOGO c 
    ON est.idESTUDIANTE = c.idESTUDIANTE
LEFT JOIN CATEGORIA_PRODUCTO cp 
    ON c.idPRODUCTO = cp.idPRODUCTO;