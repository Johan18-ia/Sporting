// Encargado: Gestión de Horarios por Categoría
const Schedule = require('../models/schedule');

module.exports = {
    // ============================================
    // LISTAR TODOS LOS HORARIOS
    // ============================================
    getAllSchedules(req, res) {
        Schedule.getAll((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al obtener los horarios de entrenamiento',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Cronograma de entrenamientos por categoría',
                data: data
            });
        });
    },

    // ============================================
    // ASIGNAR HORARIO A UNA CATEGORÍA
    // ============================================
    create(req, res) {
        const schedule = req.body;
        // Ejemplo de body: { "id_category": 1, "day_of_week": "Lunes", "start_time": "16:00", "end_time": "18:00", "field_name": "Cancha Principal" }
        Schedule.create(schedule, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al asignar el horario',
                    error: err
                });
            }
            return res.status(201).json({
                success: true,
                message: 'Horario asignado correctamente',
                data: data
            });
        });
    },

    update(req, res) {
        Schedule.update(req.body, (err, data) => {
            if (err) {
                return res.status(501).json({ success: false, message: 'Error al actualizar el horario', error: err });
            }
            return res.status(200).json({ success: true, message: 'Horario actualizado', data });
        });
    },

    // ============================================
    // OBTENER HORARIOS DE UNA CATEGORÍA ESPECÍFICA
    // ============================================
    getByCategory(req, res) {
        const id_category = req.params.id_category;
        Schedule.findByCategory(id_category, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error consultando horarios de la categoría',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Horarios de la categoría encontrados',
                data: data
            });
        });
    },

    // ============================================
    // ELIMINAR O CANCELAR HORARIO
    // ============================================
    delete(req, res) {
        const id = req.params.id;
        Schedule.delete(id, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al eliminar el horario',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Horario eliminado exitosamente',
                data: data
            });
        });
    }
};