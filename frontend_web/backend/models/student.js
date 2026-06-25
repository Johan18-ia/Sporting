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
            s.*, 
            c.category_year,
            c.description as category_description
        FROM students s
        LEFT JOIN categories c ON s.category_id = c.id
        ORDER BY s.id DESC
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
            s.*, 
            c.category_year,
            c.description as category_description
        FROM students s
        LEFT JOIN categories c ON s.category_id = c.id
        WHERE s.id = ?
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
    const sql = `
        INSERT INTO students (
            name, 
            lastname, 
            document, 
            category_id, 
            birth_date,
            phone,
            address,
            emergency_contact,
            emergency_phone,
            created_at, 
            updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    db.query(sql, [
        student.name,
        student.lastname,
        student.document,
        student.category_id,
        student.birth_date || null,
        student.phone || '',
        student.address || '',
        student.emergency_contact || '',
        student.emergency_phone || ''
    ], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, {
                id: res.insertId,
                ...student
            });
        }
    });
};

// ============================================
// ACTUALIZAR ESTUDIANTE
// ============================================
Student.update = (student, result) => {
    const sql = `
        UPDATE students 
        SET 
            name = ?,
            lastname = ?,
            document = ?,
            category_id = ?,
            birth_date = ?,
            phone = ?,
            address = ?,
            emergency_contact = ?,
            emergency_phone = ?,
            updated_at = NOW()
        WHERE id = ?
    `;
    db.query(sql, [
        student.name,
        student.lastname,
        student.document,
        student.category_id,
        student.birth_date || null,
        student.phone || '',
        student.address || '',
        student.emergency_contact || '',
        student.emergency_phone || '',
        student.id
    ], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, student);
        }
    });
};

// ============================================
// ELIMINAR ESTUDIANTE
// ============================================
Student.delete = (id, result) => {
    const sql = 'DELETE FROM students WHERE id = ?';
    db.query(sql, [id], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

module.exports = Student;