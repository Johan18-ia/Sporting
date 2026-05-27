// models/tournament.js
const db = require('../config/config');

const Tournament = {};

// Crear un nuevo torneo
Tournament.create = (tournament, result) => {
    const sql = `
        INSERT INTO tournaments (name, min_players, max_players, status, created_at)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [
        tournament.name,
        5, // Mínimo fijo según tu requerimiento
        8, // Máximo fijo según tu requerimiento
        'programado',
        new Date()
    ], (err, res) => {
        if (err) result(err, null);
        else result(null, { id: res.insertId, ...tournament });
    });
};

// Obtener todos los torneos
Tournament.getAll = (result) => {
    const sql = 'SELECT * FROM tournaments';
    db.query(sql, (err, res) => {
        if (err) result(err, null);
        else result(null, res);
    });
};

module.exports = Tournament;