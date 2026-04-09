DROP TABLE IF EXISTS categoria_Producto CASCADE;
DROP TABLE IF EXISTS Horario CASCADE;
DROP TABLE IF EXISTS Equipo_Estudiante CASCADE;
DROP TABLE IF EXISTS Estudiante CASCADE;
DROP TABLE IF EXISTS Equipo CASCADE;
DROP TABLE IF EXISTS Torneo CASCADE;
DROP TABLE IF EXISTS Equipo_externo CASCADE;
DROP TABLE IF EXISTS USUARIO CASCADE;
DROP TABLE IF EXISTS Catalogo CASCADE;
DROP TABLE IF EXISTS Categoria CASCADE;
DROP TABLE IF EXISTS Escuela_Externa CASCADE;
DROP TABLE IF EXISTS ROL CASCADE;

-- 1. TABLA ROL
CREATE TABLE ROL (
    idROL INTEGER PRIMARY KEY,
    nombre_rol VARCHAR(45) NOT NULL
);

-- 2. TABLA ESCUELA EXTERNA
CREATE TABLE Escuela_Externa (
    idEscuelas INTEGER PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    telefono INTEGER
);

-- 3. TABLA CATEGORIA
CREATE TABLE Categoria (
    idCategoria INTEGER PRIMARY KEY,
    edad_minima INTEGER,
    edad_maxima INTEGER,
    Equipo_idEquipos INTEGER
);

-- 4. TABLA CATALOGO
CREATE TABLE Catalogo (
    idItem INTEGER PRIMARY KEY,
    nombre VARCHAR(45),
    descripcion VARCHAR(100),
    precio INTEGER,
    imagen_url VARCHAR(100)
);

-- 5. TABLA USUARIO
CREATE TABLE USUARIO (
    idUSUARIO INTEGER PRIMARY KEY,
    correo VARCHAR(50),
    usuario VARCHAR(45),
    password VARCHAR(100),
    ROL_idROL INTEGER REFERENCES ROL(idROL) ON DELETE CASCADE
);

-- 6. TABLA EQUIPO EXTERNO
CREATE TABLE Equipo_externo (
    idEquipo_externo INTEGER PRIMARY KEY,
    nombre_equipo VARCHAR(45),
    Escuelas_Externa_idEscuelas INTEGER REFERENCES Escuela_Externa(idEscuelas) ON DELETE CASCADE
);

-- 7. TABLA TORNEO
CREATE TABLE Torneo (
    idTorneo INTEGER PRIMARY KEY,
    Nombre VARCHAR(45),
    Fecha_inicio DATE,
    Fecha_fin DATE,
    Equipo_externo_idEquipo_externo1 INTEGER REFERENCES Equipo_externo(idEquipo_externo) ON DELETE CASCADE
);

-- 8. TABLA EQUIPO
CREATE TABLE Equipo (
    idEquipos INTEGER PRIMARY KEY,
    nombre_equipo VARCHAR(45),
    Torneo_idTorneo INTEGER REFERENCES Torneo(idTorneo) ON DELETE CASCADE
);

-- 9. TABLA ESTUDIANTE
CREATE TABLE Estudiante (
    idEstudiante INTEGER PRIMARY KEY,
    nombre VARCHAR(45),
    documento VARCHAR(45),
    fecha_nacimeinto DATE,
    USUARIO_idUSUARIO INTEGER REFERENCES USUARIO(idUSUARIO) ON DELETE CASCADE
);

-- 10. TABLA EQUIPO ESTUDIANTE
CREATE TABLE Equipo_Estudiante (
    idEquipo_Estudiante INTEGER PRIMARY KEY,
    Estudiante_id_idEstudiante INTEGER REFERENCES Estudiante(idEstudiante) ON DELETE CASCADE,
    Equipo_idEquipos INTEGER REFERENCES Equipo(idEquipos) ON DELETE CASCADE
);

-- 11. TABLA HORARIO
CREATE TABLE Horario (
    idHorario INTEGER PRIMARY KEY,
    dia VARCHAR(45),
    hora VARCHAR(45),
    Equipo_idEquipos INTEGER REFERENCES Equipo(idEquipos) ON DELETE CASCADE
);

-- 12. TABLA CATEGORIA PRODUCTO
CREATE TABLE categoria_Producto (
    idcategoria_producto INTEGER PRIMARY KEY,
    nombre_categoria VARCHAR(45),
    Catalogo_idItem INTEGER REFERENCES Catalogo(idItem) ON DELETE CASCADE
);