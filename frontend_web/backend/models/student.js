// backend/models/student.js
// ====================================================
// MODELO: ESTUDIANTE
// ====================================================
const db = require('../config/config');

const Student = {};

// ============================================
// OBTENER TODOS LOS ESTUDIANTES
// ============================================
Student.getAll = (result) => {
    const sql = `
        SELECT 
            sp.id,
            sp.user_id,
            u.name,
            u.lastname,
            u.email,
            u.phone,
            u.role,
            sp.document,
            sp.category_id,
            sp.birth_date,
            sp.address,
            sp.emergency_contact_name,
            sp.emergency_contact_phone,
            sp.status,
            sp.created_at,
            sp.updated_at,
            c.category_year,
            c.description as category_description
        FROM student_profiles sp
        INNER JOIN users u ON u.id = sp.user_id
        LEFT JOIN categories c ON sp.category_id = c.id
        ORDER BY sp.id DESC
    `;
    db.query(sql, (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// ============================================
// OBTENER ESTUDIANTE POR ID
// ============================================
Student.findById = (id, result) => {
    const sql = `
        SELECT 
            sp.id,
            sp.user_id,
            u.name,
            u.lastname,
            u.email,
            u.phone,
            u.role,
            sp.document,
            sp.category_id,
            sp.birth_date,
            sp.address,
            sp.emergency_contact_name,
            sp.emergency_contact_phone,
            sp.status,
            sp.created_at,
            sp.updated_at,
            c.category_year,
            c.description as category_description
        FROM student_profiles sp
        INNER JOIN users u ON u.id = sp.user_id
        LEFT JOIN categories c ON sp.category_id = c.id
        WHERE sp.id = ?
    `;
    db.query(sql, [id], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res[0]);
        }
    });
};

// ============================================
// CREAR ESTUDIANTE
// ============================================
Student.create = (student, result) => {
    const { user_id, document, category_id, birth_date, address, emergency_contact_name, emergency_contact_phone, status } = student;

    if (!user_id) {
        return result(new Error('El user_id es obligatorio para crear un estudiante'), null);
    }

    const validateUserSql = 'SELECT id, role, is_active FROM users WHERE id = ?';
    db.query(validateUserSql, [user_id], (err, users) => {
        if (err) {
            return result(err, null);
        }

        const user = users[0];
        if (!user) {
            return result(new Error('El usuario no existe'), null);
        }

        if (user.role !== 'user') {
            return result(new Error('Solo los usuarios con rol user pueden ser estudiantes'), null);
        }

        if (user.is_active !== 1 && user.is_active !== true) {
            return result(new Error('No se puede crear un estudiante con un usuario inactivo'), null);
        }

        const duplicateSql = 'SELECT id FROM student_profiles WHERE user_id = ?';
        db.query(duplicateSql, [user_id], (dupErr, existing) => {
            if (dupErr) {
                return result(dupErr, null);
            }

            if (existing.length > 0) {
                return result(new Error('Este usuario ya tiene un perfil de estudiante asociado'), null);
            }

            const sql = `
                INSERT INTO student_profiles (
                    user_id,
                    document,
                    category_id,
                    birth_date,
                    address,
                    emergency_contact_name,
                    emergency_contact_phone,
                    status,
                    created_at,
                    updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `;
            db.query(sql, [
                user_id,
                document || null,
                category_id || null,
                birth_date || null,
                address || '',
                emergency_contact_name || '',
                emergency_contact_phone || '',
                status || 'pending'
            ], (insertErr, res) => {
                if (insertErr) {
                    return result(insertErr, null);
                }

                return result(null, {
                    id: res.insertId,
                    user_id,
                    document,
                    category_id,
                    birth_date,
                    address,
                    emergency_contact_name,
                    emergency_contact_phone,
                    status: status || 'pending'
                });
            });
        });
    });
};

// ============================================
// ACTUALIZAR ESTUDIANTE
// ============================================
Student.update = (student, result) => {
    const { id, user_id, document, category_id, birth_date, address, emergency_contact_name, emergency_contact_phone, status } = student;

    const sql = `
        UPDATE student_profiles 
        SET 
            user_id = ?,
            document = ?,
            category_id = ?,
            birth_date = ?,
            address = ?,
            emergency_contact_name = ?,
            emergency_contact_phone = ?,
            status = ?,
            updated_at = NOW()
        WHERE id = ?
    `;
    db.query(sql, [
        user_id || null,
        document || null,
        category_id || null,
        birth_date || null,
        address || '',
        emergency_contact_name || '',
        emergency_contact_phone || '',
        status || 'pending',
        id
    ], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, { id, ...student });
        }
    });
};

// ============================================
// ELIMINAR ESTUDIANTE
// ============================================
Student.delete = (id, result) => {
    const sql = 'DELETE FROM student_profiles WHERE id = ?';
    db.query(sql, [id], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

module.exports = Student;