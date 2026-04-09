-- PROYECTO: Sporting
-- CARPETA: 04_seguridad_base_datos
-- DESCRIPCIÓN: Creación de usuario con permisos limitados para la aplicación web


-- 1. Crear el usuario de conexión para la App
-- Puedes cambiar 'password_web_123' por la que quieras
CREATE USER usuario_impactofs WITH PASSWORD 'password_web_123';

-- 2. Darle permiso para ver y usar el esquema público
GRANT USAGE ON SCHEMA public TO usuario_impactofs;

-- 3. Darle permiso para leer, insertar y actualizar datos en las tablas
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO usuario_impactofs;

-- 4. Darle permiso para usar las secuencias (necesario para los IDs automáticos)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO usuario_impactofs;