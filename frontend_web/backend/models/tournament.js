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
    const sql = `
        INSERT INTO tournaments (
            name,
            description,
            id_category,
            tournament_date,
            location,
            max_teams,
            status,
            created_at,
            updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    db.query(sql, [
        tournament.name,
        tournament.description || null,
        tournament.id_category,
        tournament.tournament_date || null,
        tournament.location || null,
        tournament.max_teams || 0,
        tournament.status || 'Pendiente'
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
    const sql = `
        SELECT t.*, c.category_year,
               COALESCE(GROUP_CONCAT(CASE WHEN sp.id IS NOT NULL THEN JSON_OBJECT(
                   'id', sp.id,
                   'user_id', sp.user_id,
                   'name', u.name,
                   'lastname', u.lastname,
                   'document', sp.document
               ) END), '') AS students_json
        FROM tournaments t
        LEFT JOIN categories c ON t.id_category = c.id
        LEFT JOIN tournament_students ts ON ts.tournament_id = t.id
        LEFT JOIN student_profiles sp ON sp.id = ts.student_id
        LEFT JOIN users u ON u.id = sp.user_id
        GROUP BY t.id
        ORDER BY t.tournament_date, t.id DESC
    `;
    db.query(sql, (err, res) => {

        // Manejo de error
        if (err) {
            result(err, null);
        } else {
            result(null, res.map((tournament) => ({
                ...tournament,
                category: tournament.category_year,
                students: tournament.students_json
                    ? JSON.parse(`[${tournament.students_json}]`)
                    : []
            })));
        }
    });
};

Tournament.enroll = (tournamentId, studentId, result) => {
    const sql = 'INSERT INTO tournament_students (tournament_id, student_id) VALUES (?, ?)';
    db.query(sql, [tournamentId, studentId], (err, res) => {
        if (err) result(err, null);
        else result(null, { id: res.insertId, tournament_id: tournamentId, student_id: studentId });
    });
};
// Exporta el modelo
module.exports = Tournament;