// ====================================================
// MODELO: USER
// ====================================================
// Importa la configuración de la base de datos
const db = require('../config/config');
// Librería para encriptar contraseñas
const bcrypt = require('bcryptjs');

// Objeto donde se almacenan los métodos del modelo
const User = {};

// ====================================================
// LISTAR TODOS LOS USUARIOS
// ====================================================
User.findAll = (result) => {
    // Consulta SQL con todos los campos
    const sql = `
        SELECT
            u.id,
            u.email,
            u.name,
            u.lastname,
            u.document,
            u.birth_date,
            u.phone,
            u.image,
            u.role,
            u.emergency_contact,
            u.emergency_phone,
            u.address,
            u.is_active,
            u.student_id,
            c.category_year,
            u.created_at,
            u.updated_at
        FROM users u
        LEFT JOIN categories c ON u.category_id = c.id
        ORDER BY u.id DESC
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

// ====================================================
// BUSCAR USUARIO POR ID
// ====================================================
User.findById = (id, result) => {
    // Consulta SQL con todos los campos
    const sql = `
        SELECT
            u.id,
            u.email,
            u.name,
            u.lastname,
            u.document,
            u.birth_date,
            u.phone,
            u.image,
            u.role,
            u.emergency_contact,
            u.emergency_phone,
            u.address,
            u.is_active,
            u.student_id,
            u.category_id,
            c.category_year,
            u.created_at,
            u.updated_at
        FROM users u
        LEFT JOIN categories c ON u.category_id = c.id
        WHERE u.id = ?
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

// ====================================================
// BUSCAR USUARIO POR EMAIL
// ====================================================
User.findByEmail = (email, result) => {
    // Consulta SQL
    const sql = `
        SELECT
            u.id,
            u.email,
            u.name,
            u.lastname,
            u.document,
            u.birth_date,
            u.phone,
            u.image,
            u.role,
            u.emergency_contact,
            u.emergency_phone,
            u.address,
            u.is_active,
            u.student_id,
            u.category_id,
            c.category_year,
            u.password
        FROM users u
        LEFT JOIN categories c ON u.category_id = c.id
        WHERE u.email = ?
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

// ====================================================
// CREAR USUARIO (SOLO ADMIN/SELLER)
// ====================================================
User.create = async (user, result) => {
    // Encriptar contraseña
    const hash = await bcrypt.hash(user.password, 10);

    // Consulta SQL con todos los campos
    const sql = `
        INSERT INTO users(
            name,
            lastname,
            document,
            birth_date,
            email,
            password,
            phone,
            emergency_contact,
            emergency_phone,
            address,
            image,
            role,
            category_id,
            student_id,
            is_active,
            created_at,
            updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    // Ejecuta la consulta
    db.query(
        sql,
        [
            user.name,
            user.lastname || '',
            user.document || null,
            user.birth_date || null,
            user.email,
            hash,
            user.phone || '',
            user.emergency_contact || null,
            user.emergency_phone || null,
            user.address || null,
            user.image || '',
            user.role || 'user',        // ← Puede ser admin, seller, user
            user.category_id || null,
            user.student_id || null,
            user.is_active !== undefined ? user.is_active : 1
        ],
        (err, res) => {
            // Validación de error
            if (err) {
                console.log('Error al crear usuario: ', err);
                result(err, null);
            } else {
                // Usuario creado exitosamente
                console.log('Usuario creado con ID: ', res.insertId);
                result(null, {
                    id: res.insertId,
                    ...user
                });
            }
        }
    );
};

// ====================================================
// ACTUALIZAR USUARIO
// ====================================================
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
    if (user.email !== undefined) {
        fields.push("email = ?");
        values.push(user.email);
    }

    // Actualizar nombre
    if (user.name !== undefined) {
        fields.push("name = ?");
        values.push(user.name);
    }

    // Actualizar apellido
    if (user.lastname !== undefined) {
        fields.push("lastname = ?");
        values.push(user.lastname);
    }

    // Actualizar documento
    if (user.document !== undefined) {
        fields.push("document = ?");
        values.push(user.document);
    }

    // Actualizar fecha de nacimiento
    if (user.birth_date !== undefined) {
        fields.push("birth_date = ?");
        values.push(user.birth_date);
    }

    // Actualizar teléfono
    if (user.phone !== undefined) {
        fields.push("phone = ?");
        values.push(user.phone);
    }

    // Actualizar imagen
    if (user.image !== undefined) {
        fields.push("image = ?");
        values.push(user.image);
    }

    // Actualizar rol
    if (user.role !== undefined) {
        fields.push("role = ?");
        values.push(user.role);
    }

    // Actualizar categoría
    if (user.category_id !== undefined) {
        fields.push("category_id = ?");
        values.push(user.category_id);
    }

    // Actualizar contacto de emergencia
    if (user.emergency_contact !== undefined) {
        fields.push("emergency_contact = ?");
        values.push(user.emergency_contact);
    }

    // Actualizar teléfono de emergencia
    if (user.emergency_phone !== undefined) {
        fields.push("emergency_phone = ?");
        values.push(user.emergency_phone);
    }

    // Actualizar dirección
    if (user.address !== undefined) {
        fields.push("address = ?");
        values.push(user.address);
    }

    // Actualizar estado activo
    if (user.is_active !== undefined) {
        fields.push("is_active = ?");
        values.push(user.is_active);
    }

    // Actualizar student_id
    if (user.student_id !== undefined) {
        fields.push("student_id = ?");
        values.push(user.student_id);
    }

    // Actualizar fecha
    fields.push("updated_at = NOW()");

    // Si no hay campos para actualizar
    if (fields.length === 0) {
        return result(null, { message: 'No hay campos para actualizar' });
    }

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

// ====================================================
// ELIMINAR USUARIO
// ====================================================
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

// ====================================================
// BUSCAR USUARIO POR DOCUMENTO
// ====================================================
User.findByDocument = (document, result) => {
    // Consulta SQL
    const sql = `
        SELECT
            u.id,
            u.email,
            u.name,
            u.lastname,
            u.document,
            u.birth_date,
            u.phone,
            u.image,
            u.role,
            u.emergency_contact,
            u.emergency_phone,
            u.address,
            u.is_active,
            u.student_id,
            u.category_id,
            c.category_year
        FROM users u
        LEFT JOIN categories c ON u.category_id = c.id
        WHERE u.document = ?
    `;
    // Ejecuta consulta
    db.query(sql, [document], (err, user) => {
        // Validación de error
        if (err) {
            console.log('Error al consultar por documento: ', err);
            result(err, null);
        } else {
            console.log('Usuario encontrado por documento: ', user[0]);
            result(null, user[0]);
        }
    });
};

// ====================================================
// EXPORTA EL MODELO
// ====================================================
module.exports = User;