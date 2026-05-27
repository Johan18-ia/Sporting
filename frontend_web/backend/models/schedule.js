// models/schedule.js
const db = require('../config/config');

const Schedule = {};

Schedule.create = (schedule, result) => {
    const sql = `
        INSERT INTO schedules (id_category, day_of_week, start_time, end_time, field_name)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [
        schedule.id_category,
        schedule.day_of_week,
        schedule.start_time,
        schedule.end_time,
        schedule.field_name
    ], (err, res) => {
        if (err) result(err, null);
        else result(null, { id: res.insertId, ...schedule });
    });
};

// Obtener horarios uniendo con la tabla de categorías para ver el año
Schedule.getAll = (result) => {
    const sql = `
        SELECT S.*, C.name_year AS category_name
        FROM schedules S
        INNER JOIN categories C ON S.id_category = C.id
        ORDER BY S.day_of_week, S.start_time ASC
    `;
    db.query(sql, (err, res) => {
        if (err) result(err, null);
        else result(null, res);
    });
};

module.exports = Schedule;