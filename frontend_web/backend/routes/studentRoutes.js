// backend/routes/studentRoutes.js
// ====================================================
// RUTAS: ESTUDIANTES
// ====================================================
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// ============================================
// LISTAR ESTUDIANTES
// ============================================
router.get(
    '/',
    verifyToken,
    authorizeRoles(['admin', 'seller', 'user']),
    studentController.getAllStudents
);

// ============================================
// OBTENER ESTUDIANTE POR ID
// ============================================
router.get(
    '/:id',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    studentController.getStudentById
);

// ============================================
// CREAR ESTUDIANTE
// ============================================
router.post(
    '/create',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    studentController.createStudent
);

// ============================================
// ACTUALIZAR ESTUDIANTE
// ============================================
router.put(
    '/',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    studentController.updateStudent
);

// ============================================
// ELIMINAR ESTUDIANTE
// ============================================
router.delete(
    '/delete/:id',
    verifyToken,
    authorizeRoles(['admin']),
    studentController.deleteStudent
);

module.exports = router;