// ====================================================
// MODELO: TOURNAMENT
// ====================================================
// Importa la configuración de la base de datos
const db = require('../config/config');
// Objeto del modelo Tournament
const Tournament = {};
// ====================================================
// CREAR UN NUEVO TORNEO
// ====================================================
Tournament.create = (tournament, result) => {
    // Consulta SQL para insertar un torneo
    const sql = `
        INSERT INTO tournaments (
            name,
            min_players,
            max_players,
            status,
            created_at
        )
        VALUES (?, ?, ?, ?, ?)
    `;
    // Ejecuta la consulta
    db.query(sql, [
        tournament.name,
        // Reglas fijas del sistema
        5, // mínimo de jugadores
        8, // máximo de jugadores
        'programado', // estado inicial
        // Fecha de creación
        new Date()
    ], (err, res) => {
        // Manejo de error
        if (err) {
            result(err, null);
        } else {
            // Respuesta exitosa
            result(null, {
                id: res.insertId,
                ...tournament
            });
        }
    });
};
// ====================================================
// OBTENER TODOS LOS TORNEOS
// ====================================================
Tournament.getAll = (result) => {
    // Consulta SQL
    const sql = 'SELECT * FROM tournaments';
    // Ejecuta consulta
    db.query(sql, (err, res) => {

        // Manejo de error
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};
// Exporta el modelo
module.exports = Tournament;