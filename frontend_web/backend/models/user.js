// ====================================================
// MODELO: USER
// ====================================================
const db = require('../config/config');
const bcrypt = require('bcryptjs');

const User = {};

// ====================================================
// LISTAR TODOS LOS USUARIOS
// ====================================================
User.findAll = (result) => {
    const sql = `
        SELECT id, email, name, lastname, phone, image, role, is_active, created_at, updated_at
        FROM users ORDER BY id DESC
    `;
    db.query(sql, (err, users) => {
        if (err) {
            result(err, null);
        } else {
            result(null, users);
        }
    });
};

// ====================================================
// BUSCAR USUARIO POR ID
// ====================================================
User.findById = (id, result) => {
    const sql = `
        SELECT id, email, name, lastname, phone, image, role, is_active, password, created_at, updated_at
        FROM users WHERE id = ?
    `;
    db.query(sql, [id], (err, user) => {
        if (err) {
            result(err, null);
        } else {
            result(null, user[0]);
        }
    });
};

// ====================================================
// BUSCAR USUARIO POR EMAIL
// ====================================================
User.findByEmail = (email, result) => {
    const sql = `
        SELECT id, email, name, lastname, phone, image, role, is_active, password
        FROM users WHERE email = ?
    `;
    db.query(sql, [email], (err, user) => {
        if (err) {
            result(err, null);
        } else {
            result(null, user[0]);
        }
    });
};

// ====================================================
// CREAR USUARIO
// ====================================================
User.create = async (user, result) => {
    const hash = await bcrypt.hash(user.password, 10);
    const validRoles = ['admin', 'seller', 'user'];
    const role = validRoles.includes(user.role) ? user.role : 'user';

    const sql = `
        INSERT INTO users(name, lastname, email, password, phone, image, role, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    db.query(sql, [
        user.name,
        user.lastname || '',
        user.email,
        hash,
        user.phone || '',
        user.image || '',
        role,
        user.is_active ?? 1
    ], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, { id: res.insertId, ...user });
        }
    });
};

// ====================================================
// ACTUALIZAR USUARIO
// ====================================================
User.update = async (user, result) => {
    let fields = [];
    let values = [];

    if (user.password) {
        const hash = await bcrypt.hash(user.password, 10);
        fields.push("password = ?");
        values.push(hash);
    }
    if (user.email) {
        fields.push("email = ?");
        values.push(user.email);
    }
    if (user.name) {
        fields.push("name = ?");
        values.push(user.name);
    }
    if (user.lastname) {
        fields.push("lastname = ?");
        values.push(user.lastname);
    }
    if (user.phone) {
        fields.push("phone = ?");
        values.push(user.phone);
    }
    if (user.image) {
        fields.push("image = ?");
        values.push(user.image);
    }
    if (user.role) {
        fields.push("role = ?");
        values.push(user.role);
    }
    if (Object.prototype.hasOwnProperty.call(user, 'is_active')) {
        fields.push("is_active = ?");
        values.push(user.is_active);
    }

    fields.push("updated_at = NOW()");
    values.push(user.id);

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    db.query(sql, values, (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, { id: user.id, ...user });
        }
    });
};

// ====================================================
// ELIMINAR USUARIO
// ====================================================
User.delete = (id, result) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    db.query(sql, [id], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

module.exports = User;