// backend/models/student.js
// ====================================================
// MODELO: PERFIL DE ESTUDIANTE
// ====================================================
const db = require('../config/config');

const Student = {};

const selectFields = `
    sp.id,
    sp.user_id,
    u.name,
    u.lastname,
    u.email,
    u.phone,
    u.role,
    u.is_active,
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
    c.description AS category_description
`;

Student.getAll = (result) => {
    const sql = `
        SELECT ${selectFields}
        FROM student_profiles sp
        INNER JOIN users u ON u.id = sp.user_id
        LEFT JOIN categories c ON c.id = sp.category_id
        ORDER BY sp.id DESC
    `;
    db.query(sql, (err, rows) => result(err, err ? null : rows));
};

Student.findById = (id, result) => {
    const sql = `
        SELECT ${selectFields}
        FROM student_profiles sp
        INNER JOIN users u ON u.id = sp.user_id
        LEFT JOIN categories c ON c.id = sp.category_id
        WHERE sp.id = ?
    `;
    db.query(sql, [id], (err, rows) => result(err, err ? null : rows[0]));
};

Student.create = (student, result) => {
    const {
        user_id,
        document,
        category_id,
        birth_date,
        address,
        emergency_contact_name,
        emergency_contact_phone,
        status
    } = student;

    if (!user_id) return result(new Error('El user_id es obligatorio para crear un estudiante'), null);
    if (!document) return result(new Error('El documento es obligatorio'), null);

    db.query('SELECT id, role, is_active FROM users WHERE id = ?', [user_id], (userError, users) => {
        if (userError) return result(userError, null);

        const user = users[0];
        if (!user) return result(new Error('El usuario no existe'), null);
        if (user.role !== 'user') {
            return result(new Error('Solo los usuarios con rol user pueden ser estudiantes'), null);
        }
        if (Number(user.is_active) !== 1) {
            return result(new Error('No se puede crear un estudiante con un usuario inactivo'), null);
        }

        db.query(
            'SELECT id FROM student_profiles WHERE user_id = ? OR document = ?',
            [user_id, document],
            (duplicateError, existing) => {
                if (duplicateError) return result(duplicateError, null);
                if (existing.length > 0) {
                    return result(new Error('El usuario o documento ya tiene un perfil de estudiante'), null);
                }

                const sql = `
                    INSERT INTO student_profiles (
                        user_id, document, category_id, birth_date, address,
                        emergency_contact_name, emergency_contact_phone, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;
                db.query(sql, [
                    user_id,
                    document,
                    category_id || null,
                    birth_date || null,
                    address || null,
                    emergency_contact_name || null,
                    emergency_contact_phone || null,
                    status || 'pending'
                ], (insertError, response) => {
                    if (insertError) return result(insertError, null);
                    result(null, { id: response.insertId, ...student });
                });
            }
        );
    });
};

Student.update = (student, result) => {
    const {
        id,
        user_id,
        document,
        category_id,
        birth_date,
        address,
        emergency_contact_name,
        emergency_contact_phone,
        status
    } = student;

    const sql = `
        UPDATE student_profiles
        SET user_id = ?, document = ?, category_id = ?, birth_date = ?,
            address = ?, emergency_contact_name = ?, emergency_contact_phone = ?,
            status = ?, updated_at = NOW()
        WHERE id = ?
    `;
    db.query(sql, [
        user_id,
        document,
        category_id || null,
        birth_date || null,
        address || null,
        emergency_contact_name || null,
        emergency_contact_phone || null,
        status || 'pending',
        id
    ], (err, response) => {
        result(err, err ? null : { id, ...student, affectedRows: response.affectedRows });
    });
};

Student.delete = (id, result) => {
    db.query('DELETE FROM student_profiles WHERE id = ?', [id], (err, response) => {
        result(err, err ? null : response);
    });
};

module.exports = Student;
