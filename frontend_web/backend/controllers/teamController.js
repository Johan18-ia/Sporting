const Team = require('../models/team');

module.exports = {
    getAllTeams(req, res) {
        Team.findAll((err, data) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error listando equipos', error: err });
            }
            return res.status(200).json({ success: true, message: 'Lista de equipos', data });
        });
    },

    getTeamById(req, res) {
        const id = req.params.id;
        Team.findById(id, (err, data) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error consultando equipo', error: err });
            }
            if (!data) {
                return res.status(404).json({ success: false, message: 'Equipo no encontrado' });
            }
            return res.status(200).json({ success: true, message: 'Equipo encontrado', data });
        });
    },

    getTeamMembers(req, res) {
        const id = req.params.id;
        Team.findMembers(id, (err, data) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error consultando miembros del equipo', error: err });
            }
            return res.status(200).json({ success: true, message: 'Miembros del equipo', data });
        });
    },

    createTeam(req, res) {
        const team = req.body;
        if (!team.name) {
            return res.status(400).json({ success: false, message: 'El nombre del equipo es obligatorio' });
        }

        Team.create(team, (err, data) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ success: false, message: 'Ya existe un equipo con ese nombre' });
                }
                return res.status(500).json({ success: false, message: 'Error creando equipo', error: err });
            }
            return res.status(201).json({ success: true, message: 'Equipo creado', data });
        });
    },

    updateTeam(req, res) {
        const team = req.body;
        if (!team.id) {
            return res.status(400).json({ success: false, message: 'El ID del equipo es obligatorio' });
        }

        Team.update(team, (err, data) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error actualizando equipo', error: err });
            }
            return res.status(200).json({ success: true, message: 'Equipo actualizado', data });
        });
    },

    deleteTeam(req, res) {
        const id = req.params.id;
        Team.delete(id, (err, data) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error eliminando equipo', error: err });
            }
            return res.status(200).json({ success: true, message: 'Equipo eliminado', data });
        });
    },

    addMember(req, res) {
        const teamId = req.params.id;
        const member = req.body;

        if (!member.student_id) {
            return res.status(400).json({ success: false, message: 'student_id es obligatorio' });
        }

        Team.addMember(teamId, member, (err, data) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ success: false, message: 'El estudiante ya está en este equipo' });
                }
                return res.status(500).json({ success: false, message: 'Error agregando estudiante al equipo', error: err });
            }
            return res.status(201).json({ success: true, message: 'Estudiante agregado al equipo', data });
        });
    },

    removeMember(req, res) {
        const teamId = req.params.id;
        const studentId = req.params.studentId;

        Team.removeMember(teamId, studentId, (err, data) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error eliminando estudiante del equipo', error: err });
            }
            return res.status(200).json({ success: true, message: 'Estudiante retirado del equipo', data });
        });
    }
};
