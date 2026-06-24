// Importa la configuración de la base de datos
const db = require('../config/config');
// Librería para encriptar contraseñas
const bcrypt = require('bcryptjs');
// Objeto donde se almacenan los métodos del modelo
const User = {};
/**
 * ---------------------------------------------------
 * LISTAR TODOS LOS USUARIOS
 * ---------------------------------------------------
 */
User.findAll = (result) => {
    // Consulta SQL
    const sql = `
        SELECT
            id,
            email,
            name,
            lastname,
            phone,
            image,
            role,
            created_at,
            updated_at
        FROM users
    `;
    // Ejecuta la consulta
    db.query(sql, (err, users) => {
        // Validación de error
        if (err) {
            console.log('Error al listar usuarios: ', err);
            result(err, null);
        } else {
            // Resultado exitoso
            console.log('Usuarios encontrados: ', users.length);
            result(null, users);
        }
    });
};
/**
 * ---------------------------------------------------
 * BUSCAR USUARIO POR ID
 * ---------------------------------------------------
 */
User.findById = (id, result) => {
    // Consulta SQL
    const sql = `
        SELECT
            id,
            email,
            name,
            lastname,
            image,
            phone,
            role,
            password
        FROM users
        WHERE id = ?
    `;
    // Ejecuta la consulta
    db.query(sql, [id], (err, user) => {
        // Validación de error
        if (err) {
            console.log('Error al consultar: ', err);
            result(err, null);
        } else {
            // Usuario encontrado
            console.log('Usuario consultado: ', user[0]);
            result(null, user[0]);
        }
    });
};
/**
 * ---------------------------------------------------
 * BUSCAR USUARIO POR EMAIL
 * ---------------------------------------------------
 */
User.findByEmail = (email, result) => {
    // Consulta SQL
    const sql = `
        SELECT
            id,
            email,
            name,
            lastname,
            image,
            phone,
            role,
            password
        FROM users
        WHERE email = ?
    `;
    // Ejecuta consulta
    db.query(sql, [email], (err, user) => {
        // Validación de error
        if (err) {
            console.log('Error al consultar: ', err);
            result(err, null);
        } else {
            // Usuario encontrado
            console.log('Usuario consultado: ', user[0]);
            result(null, user[0]);
        }
    });
};
/**
 * ---------------------------------------------------
 * CREAR USUARIO
 * ---------------------------------------------------
 */
// backend/models/user.js

User.create = async (user, result) => {
  const hash = await bcrypt.hash(user.password, 10);

  // ✅ FORZAR: Siempre "user" para registros públicos
  const role = 'user';  // ← Ignora cualquier rol enviado

  const sql = `
    INSERT INTO users(
      name, lastname, email, password, phone, image, role, created_at, updated_at
    )
    VALUES (?,?,?,?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [
      user.name,
      user.lastname,
      user.email,
      hash,
      user.phone || '',
      user.image || '',
      role,  // ← Siempre "user"
      new Date(),
      new Date()
    ],
    (err, res) => {
      // ...
    }
  );
};
/**
 * ---------------------------------------------------
 * ACTUALIZAR USUARIO
 * ---------------------------------------------------
 */
User.update = async (user, result) => {
    // Arrays para campos y valores dinámicos
    let fields = [];
    let values = [];
    // Actualizar contraseña
    if (user.password) {
        const hash = await bcrypt.hash(user.password, 10);
        fields.push("password = ?");
        values.push(hash);
    }
    // Actualizar email
    if (user.email) {
        fields.push("email = ?");
        values.push(user.email);
    }
    // Actualizar nombre
    if (user.name) {
        fields.push("name = ?");
        values.push(user.name);
    }
    // Actualizar apellido
    if (user.lastname) {
        fields.push("lastname = ?");
        values.push(user.lastname);
    }
    // Actualizar teléfono
    if (user.phone) {
        fields.push("phone = ?");
        values.push(user.phone);
    }
    // Actualizar imagen
    if (user.image) {
        fields.push("image = ?");
        values.push(user.image);
    }
    // Actualizar rol
    if (user.role) {
        fields.push("role = ?");
        values.push(user.role);
    }
    // Actualizar fecha
    fields.push("updated_at = ?");
    values.push(new Date());
    // Consulta SQL dinámica
    const sql = `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE id = ?
    `;
    // Agrega el id al final
    values.push(user.id);
    // Ejecuta consulta
    db.query(sql, values, (err, res) => {
        // Validación de error
        if (err) {
            console.log('Error al actualizar usuario: ', err);
            result(err, null);
        } else {
            // Usuario actualizado
            console.log('Usuario actualizado: ', {
                id: user.id,
                ...user
            });
            result(null, {
                id: user.id,
                ...user
            });
        }
    });
};
/**
 * ---------------------------------------------------
 * ELIMINAR USUARIO
 * ---------------------------------------------------
 */
User.delete = (id, result) => {
    // Consulta SQL
    const sql = `DELETE FROM users WHERE id = ?`;
    // Ejecuta consulta
    db.query(sql, [id], (err, res) => {
        // Validación de error
        if (err) {
            console.log('Error al eliminar usuario: ', err);
            result(err, null);
        } else {
            // Usuario eliminado
            console.log('Usuario eliminado con id: ', id);
            result(null, res);
        }
    });
};
// Exporta el modelo
module.exports = User;