// backend/controllers/studentController.js
// ====================================================
// CONTROLADOR: ESTUDIANTES
// ====================================================
const Student = require('../models/student');

module.exports = {
    // ============================================
    // LISTAR TODOS LOS ESTUDIANTES
    // ============================================
    getAllStudents(req, res) {
        Student.getAll((err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error listando estudiantes',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Lista de estudiantes',
                data: data
            });
        });
    },

    // ============================================
    // OBTENER ESTUDIANTE POR ID
    // ============================================
    getStudentById(req, res) {
        const id = req.params.id;
        Student.findById(id, (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error consultando estudiante',
                    error: err
                });
            }
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'Estudiante no encontrado'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Estudiante encontrado',
                data: data
            });
        });
    },

    // ============================================
    // CREAR ESTUDIANTE
    // ============================================
    createStudent(req, res) {
        const student = req.body;

        if (req.user?.role === 'user' && Number(student.user_id) !== Number(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Solo puedes registrarte como estudiante con tu propio usuario'
            });
        }

        if (!student.user_id || !student.document) {
            return res.status(400).json({
                success: false,
                message: 'user_id y document son obligatorios'
            });
        }

        Student.create(student, (err, data) => {
            if (err) {
                const duplicate = err.code === 'ER_DUP_ENTRY';
                return res.status(duplicate ? 409 : 400).json({
                    success: false,
                    message: err.message || 'Error creando estudiante',
                    error: err
                });
            }
            return res.status(201).json({
                success: true,
                message: 'Estudiante creado',
                data: data
            });
        });
    },

    // ============================================
    // ACTUALIZAR ESTUDIANTE
    // ============================================
    updateStudent(req, res) {
        const student = req.body;
        if (!student.id) {
            return res.status(400).json({
                success: false,
                message: 'El ID del estudiante es requerido'
            });
        }
        Student.update(student, (err, data) => {
            if (err) {
                return res.status(err.code === 'ER_DUP_ENTRY' ? 409 : 500).json({
                    success: false,
                    message: 'Error actualizando estudiante',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Estudiante actualizado',
                data: data
            });
        });
    },

    // ============================================
    // ELIMINAR ESTUDIANTE
    // ============================================
    deleteStudent(req, res) {
        const id = req.params.id;
        Student.delete(id, (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error eliminando estudiante',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Estudiante eliminado',
                data: data
            });
        });
    }
};