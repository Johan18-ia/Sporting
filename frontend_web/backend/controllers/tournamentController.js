// Encargado: Gestión de Torneos y Emparejamientos
const Tournament = require('../models/tournament');

module.exports = {
    // ============================================
    // LISTAR TORNEOS
    // ============================================
    getAll(req, res) {
        Tournament.getAll((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al obtener torneos',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Lista de torneos deportivos',
                data: data
            });
        });
    },

    // ============================================
    // CREAR TORNEO
    // ============================================
    create(req, res) {
        const tournament = req.body;
        Tournament.create(tournament, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al crear el torneo',
                    error: err
                });
            }
            return res.status(201).json({
                success: true,
                message: 'Torneo registrado con éxito',
                data: data
            });
        });
    },
    // ============================================
    // GENERAR EQUIPOS AL AZAR
    // ============================================
    // Esta función toma una lista de estudiantes y los divide 
    // respetando el rango de 5 a 8 jugadores por equipo.

    generateRandomTeams(req, res) {
        const { students } = req.body; // Array de objetos de estudiantes
        
        if (!students || students.length < 5) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren al menos 5 jugadores para formar un equipo.'
            });
        }
        // 1. Mezclar lista de estudiantes al azar (Algoritmo Fisher-Yates)
        const shuffled = students.sort(() => 0.5 - Math.random());
        // 2. Definir tamaño de equipos (ejemplo: intentando grupos de 5 o 6)
        const teamSize = 5; 
        const teams = [];
        for (let i = 0; i < shuffled.length; i += teamSize) {
            const team = shuffled.slice(i, i + teamSize);
            // Si el último grupo queda muy pequeño (menos de 5), 
            // podrías redistribuirlos en los otros equipos si no exceden los 8.
            teams.push(team);
        }
        return res.status(200).json({
            success: true,
            message: 'Equipos generados aleatoriamente',
            data: teams
        });
    }
}; 