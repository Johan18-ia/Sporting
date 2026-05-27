// models/category.js
const db = require('../../config/config'); // Tu conexión a la DB

const Category = {};

Category.getAll = (result) => {
    const sql = 'SELECT * FROM categories ORDER BY name_year DESC';
    db.query(sql, (err, res) => {
        if (err) result(err, null);
        else result(null, res);
    });
};

Category.create = (category, result) => {
    const sql = 'INSERT INTO categories (name_year, description) VALUES (?, ?)';
    db.query(sql, [category.name_year, category.description], (err, res) => {
        if (err) result(err, null);
        else result(null, { id: res.insertId, ...category });
    });
};

// ... otros métodos (findById, update, delete)
module.exports = Category;