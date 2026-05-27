const db = require('../config/config');

const User = {};

// ============================================
// BUSCAR TODOS LOS USUARIOS
// ============================================
User.getAll = (result) => {
    const sql = 'SELECT id, name, email, phone, role, id_category FROM users';
    db.query(sql, (err, res) => {
        if (err) {
            console.log('Error:', err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// ============================================
// BUSCAR POR ID
// ============================================
User.findById = (id, result) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res[0]); // Retornamos solo el primer resultado
        }
    });
};

// ============================================
// CREAR USUARIO
// ============================================
User.create = (user, result) => {
    const sql = `
        INSERT INTO users (name, email, phone, password, role, id_category, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
        user.name,
        user.email,
        user.phone,
        user.password, // En el SENA suelen pedirlo plano o con bcrypt
        user.role,     // 'admin', 'entrenador', 'estudiante'
        user.id_category || null, // Puede ser nulo si no es estudiante
        new Date()
    ], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, { id: res.insertId, ...user });
        }
    });
};

// ============================================
// ACTUALIZAR USUARIO
// ============================================
User.update = (user, result) => {
    const sql = `
        UPDATE users
        SET name = ?, email = ?, phone = ?, role = ?, id_category = ?
        WHERE id = ?
    `;
    db.query(sql, [
        user.name,
        user.email,
        user.phone,
        user.role,
        user.id_category,
        user.id
    ], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// ============================================
// ELIMINAR USUARIO
// ============================================
User.delete = (id, result) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

module.exports = User;