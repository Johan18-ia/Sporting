// ====================================================
// MODELO: SCHEDULE (HORARIOS)
// ====================================================
// Importa la conexión a la base de datos
const db = require('../config/config');
// Objeto del modelo Schedule
const Schedule = {};
// ====================================================
// CREAR HORARIO
// ====================================================
Schedule.create = (schedule, result) => {
    // Consulta SQL para insertar un horario
    const sql = `
        INSERT INTO schedules (
            id_category,
            day_of_week,
            start_time,
            end_time,
            field_name
        )
        VALUES (?, ?, ?, ?, ?)
    `;
    // Ejecuta la consulta
    db.query(sql, [
        schedule.id_category,
        schedule.day_of_week,
        schedule.start_time,
        schedule.end_time,
        schedule.field_name
    ], (err, res) => {
        // Manejo de error
        if (err) {
            result(err, null);
        } else {
            result(null, {
                id: res.insertId,
                ...schedule
            });
        }
    });
};
// ====================================================
// OBTENER TODOS LOS HORARIOS
// ====================================================
Schedule.getAll = (result) => {
    // Consulta SQL con relación a categorías
    const sql = `
        SELECT
            S.*,
            C.category_year AS category_name
        FROM schedules S
        INNER JOIN categories C ON S.id_category = C.id
        ORDER BY S.day_of_week, S.start_time ASC
    `;
    // Ejecuta la consulta
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
module.exports = Schedule;