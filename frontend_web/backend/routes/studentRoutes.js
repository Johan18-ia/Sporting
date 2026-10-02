// backend/routes/studentRoutes.js
// ====================================================
// RUTAS: ESTUDIANTES
// ====================================================
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Gestión de perfiles de estudiantes
 */

// ============================================
// LISTAR ESTUDIANTES
// ============================================
/**
 * @swagger
 * /api/students:
 *   get:
 *     tags: [Students]
 *     summary: Obtener todos los estudiantes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estudiantes
 *       401:
 *         description: Token ausente o inválido
 *       403:
 *         description: Rol no autorizado
 */
router.get(
    '/',
    verifyToken,
    authorizeRoles(['admin', 'seller', 'user']),
    studentController.getAllStudents
);

// ============================================
// OBTENER ESTUDIANTE POR ID
// ============================================
/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     tags: [Students]
 *     summary: Obtener un estudiante por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estudiante encontrado
 *       404:
 *         description: Estudiante no encontrado
 *       401:
 *         description: Token ausente o inválido
 *       403:
 *         description: Rol no autorizado
 */
router.get(
    '/:id',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    studentController.getStudentById
);

// ============================================
// CREAR ESTUDIANTE
// ============================================
/**
 * @swagger
 * /api/students/create:
 *   post:
 *     tags: [Students]
 *     summary: Crear un perfil de estudiante
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Estudiante creado
 *       400:
 *         description: Datos obligatorios inválidos
 *       401:
 *         description: Token ausente o inválido
 *       403:
 *         description: El usuario no puede crear este perfil
 *       409:
 *         description: El usuario o documento ya tiene un perfil
 */
router.post(
    '/create',
    verifyToken,
    authorizeRoles(['admin', 'seller', 'user']),
    studentController.createStudent
);

// ============================================
// ACTUALIZAR ESTUDIANTE
// ============================================
/**
 * @swagger
 * /api/students:
 *   put:
 *     tags: [Students]
 *     summary: Actualizar un perfil de estudiante
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Student'
 *               - required: [id]
 *     responses:
 *       200:
 *         description: Estudiante actualizado
 *       400:
 *         description: El ID del estudiante es obligatorio
 *       401:
 *         description: Token ausente o inválido
 *       403:
 *         description: Rol no autorizado
 *       409:
 *         description: Documento duplicado
 */
router.put(
    '/',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    studentController.updateStudent
);

// ============================================
// ELIMINAR ESTUDIANTE
// ============================================
/**
 * @swagger
 * /api/students/delete/{id}:
 *   delete:
 *     tags: [Students]
 *     summary: Eliminar un perfil de estudiante
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estudiante eliminado
 *       401:
 *         description: Token ausente o inválido
 *       403:
 *         description: Solo administradores
 *       404:
 *         description: Estudiante no encontrado
 */
router.delete(
    '/delete/:id',
    verifyToken,
    authorizeRoles(['admin']),
    studentController.deleteStudent
);

module.exports = router;