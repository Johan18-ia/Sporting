// backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// LISTAR ESTUDIANTES
router.get(
    '/',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    studentController.getAllStudents
);

// CREAR ESTUDIANTE
router.post(
    '/create',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    studentController.createStudent
);

// ELIMINAR ESTUDIANTE
router.delete(
    '/delete/:id',
    verifyToken,
    authorizeRoles(['admin']),
    studentController.deleteStudent
);

module.exports = router;