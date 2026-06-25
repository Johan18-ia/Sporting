// backend/controllers/studentController.js
const Student = require('../models/student');

module.exports = {
    // LISTAR TODOS LOS ESTUDIANTES
    getAllStudents(req, res) {
        Student.getAll((err, data) => {
            if (err) {
                return res.status(501).json({
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

    // CREAR ESTUDIANTE
    createStudent(req, res) {
        const student = req.body;
        Student.create(student, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error creando estudiante',
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

    // ELIMINAR ESTUDIANTE
    deleteStudent(req, res) {
        const id = req.params.id;
        Student.delete(id, (err, data) => {
            if (err) {
                return res.status(501).json({
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