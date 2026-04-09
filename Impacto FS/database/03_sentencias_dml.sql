-- PROYECTO: Sporting
-- CARPETA: 03_sentencias_dml
-- DESCRIPCIÓN: Inserción de datos iniciales

-- 1. Insertar Roles
INSERT INTO ROL (idROL, nombre_rol) VALUES 
(1, 'Administrador'), 
(2, 'Entrenador'), 
(3, 'Estudiante');

-- 2. Insertar Categorías (Basado en tu prototipo)
INSERT INTO Categoria (idCategoria, edad_minima, edad_maxima) VALUES 
(1, 14, 15), -- Categoría 2009/2010
(2, 16, 17); -- Categoría 2007/2008

-- 3. Insertar Usuarios de prueba
INSERT INTO USUARIO (idUSUARIO, correo, usuario, password, ROL_idROL) VALUES 
(1, 'admin@impactofs.com', 'admin_johan', 'admin123', 1),
(2, 'profe@impactofs.com', 'profe_marcos', 'profe123', 2);

-- 4. Insertar una Escuela Externa de ejemplo
INSERT INTO Escuela_Externa (idEscuelas, nombre, telefono) VALUES 
(1, 'Escuela Rival FC', 30012345);

-- 5. Insertar un Torneo
INSERT INTO Equipo_externo (idEquipo_externo, nombre_equipo, Escuelas_Externa_idEscuelas) VALUES (1, 'Rivalitos', 1);
INSERT INTO Torneo (idTorneo, Nombre, Fecha_inicio, Fecha_fin, Equipo_externo_idEquipo_externo1) VALUES 
(1, 'Copa Infantil 2026', '2026-04-01', '2026-06-30', 1);

-- 6. Insertar Equipo propio
INSERT INTO Equipo (idEquipos, nombre_equipo, Torneo_idTorneo) VALUES 
(1, 'ImpactoFS Sub-15', 1);

-- 7. Insertar Estudiantes de prueba
INSERT INTO Estudiante (idEstudiante, nombre, documento, fecha_nacimeinto, USUARIO_idUSUARIO) VALUES 
(1, 'Andres Lopez', '1010200300', '2009-05-12', 2),
(2, 'Carlos Perez', '1010500600', '2010-08-20', 2);