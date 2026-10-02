const db = require('../config/config');

const Team = {};

Team.findAll = (callback) => {
    const sql = `
        SELECT t.*, c.name AS category_name, u.name AS coach_name, u.lastname AS coach_lastname
        FROM teams t
        LEFT JOIN categories c ON c.id = t.category_id
        LEFT JOIN users u ON u.id = t.coach_id
        ORDER BY t.id DESC
    `;
    db.query(sql, (err, rows) => callback(err, err ? null : rows));
};

Team.findById = (id, callback) => {
    const sql = `
        SELECT t.*, c.name AS category_name, u.name AS coach_name, u.lastname AS coach_lastname
        FROM teams t
        LEFT JOIN categories c ON c.id = t.category_id
        LEFT JOIN users u ON u.id = t.coach_id
        WHERE t.id = ?
    `;
    db.query(sql, [id], (err, rows) => callback(err, err ? null : rows[0]));
};

Team.findMembers = (teamId, callback) => {
    const sql = `
        SELECT tm.id, tm.team_id, tm.student_id, tm.jersey_number, tm.position, tm.is_active,
               tm.joined_at, u.name, u.lastname, u.email, u.phone,
               sp.document, sp.birth_date, sp.category_id, c.name AS category_name
        FROM team_members tm
        INNER JOIN users u ON u.id = tm.student_id
        LEFT JOIN student_profiles sp ON sp.user_id = u.id
        LEFT JOIN categories c ON c.id = sp.category_id
        WHERE tm.team_id = ?
        ORDER BY u.lastname, u.name
    `;
    db.query(sql, [teamId], (err, rows) => callback(err, err ? null : rows));
};

Team.create = (team, callback) => {
    const sql = `
        INSERT INTO teams (name, category_id, coach_id, logo, description, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    db.query(sql, [
        team.name,
        team.category_id || null,
        team.coach_id || null,
        team.logo || null,
        team.description || null,
        team.is_active !== undefined ? team.is_active : 1
    ], (err, res) => {
        if (err) return callback(err, null);
        callback(null, { id: res.insertId, ...team });
    });
};

Team.update = (team, callback) => {
    const sql = `
        UPDATE teams
        SET name = ?, category_id = ?, coach_id = ?, logo = ?, description = ?, is_active = ?, updated_at = NOW()
        WHERE id = ?
    `;

    db.query(sql, [
        team.name,
        team.category_id || null,
        team.coach_id || null,
        team.logo || null,
        team.description || null,
        team.is_active !== undefined ? team.is_active : 1,
        team.id
    ], (err, res) => {
        if (err) return callback(err, null);
        callback(null, { id: team.id, ...team });
    });
};

Team.delete = (id, callback) => {
    db.query('DELETE FROM teams WHERE id = ?', [id], (err, res) => {
        if (err) return callback(err, null);
        callback(null, res);
    });
};

Team.addMember = (teamId, member, callback) => {
    const sql = `
        INSERT INTO team_members (team_id, student_id, jersey_number, position, joined_at, is_active, created_at)
        VALUES (?, ?, ?, ?, NOW(), 1, NOW())
    `;

    db.query(sql, [
        teamId,
        member.student_id,
        member.jersey_number || null,
        member.position || null
    ], (err, res) => {
        if (err) return callback(err, null);
        callback(null, { id: res.insertId, team_id: teamId, ...member });
    });
};

Team.removeMember = (teamId, studentId, callback) => {
    db.query('DELETE FROM team_members WHERE team_id = ? AND student_id = ?', [teamId, studentId], (err, res) => {
        if (err) return callback(err, null);
        callback(null, res);
    });
};

module.exports = Team;
