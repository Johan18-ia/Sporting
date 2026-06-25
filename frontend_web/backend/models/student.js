// backend/models/student.js
const db = require('../config/config');

const Student = {};

Student.getAll = (result) => {
    const sql = `
        SELECT s.*, c.category_year 
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

Student.create = (student, result) => {
    const sql = `
        INSERT INTO students (name, lastname, document, category_id, birth_date, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    db.query(sql, [
        student.name,
        student.lastname,
        student.document,
        student.category_id,
        student.birth_date
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