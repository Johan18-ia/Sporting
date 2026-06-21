// ====================================================
// IMPORTAR EXPRESS
// ====================================================
const express = require('express');
const router = express.Router();

// ====================================================
// IMPORTAR CONTROLADOR
// ====================================================
const scheduleController = require('../controllers/scheduleController');

// ====================================================
// IMPORTAR MIDDLEWARES
// ====================================================
const {
    verifyToken,
    authorizeRoles
} = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: Gestión de horarios por categoría
 */

// ====================================================
// LISTAR TODOS LOS HORARIOS
// ====================================================

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     tags: [Schedules]
 *     summary: Obtener todos los horarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de horarios
 *       401:
 *         description: No autorizado
 */
router.get(
    '/',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    scheduleController.getAllSchedules
);

// ====================================================
// CREAR HORARIO
// ====================================================

/**
 * @swagger
 * /api/schedules/create:
 *   post:
 *     tags: [Schedules]
 *     summary: Asignar horario a categoría
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_category
 *               - day_of_week
 *               - start_time
 *               - end_time
 *             properties:
 *               id_category:
 *                 type: integer
 *               day_of_week:
 *                 type: string
 *                 example: "Lunes"
 *               start_time:
 *                 type: string
 *                 example: "16:00"
 *               end_time:
 *                 type: string
 *                 example: "18:00"
 *               field_name:
 *                 type: string
 *                 example: "Cancha Principal"
 *     responses:
 *       201:
 *         description: Horario creado
 *       400:
 *         description: Error en los datos
 */
router.post(
    '/create',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    scheduleController.create
);

// ====================================================
// HORARIOS POR CATEGORÍA
// ====================================================

/**
 * @swagger
 * /api/schedules/category/{id_category}:
 *   get:
 *     tags: [Schedules]
 *     summary: Obtener horarios por categoría
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_category
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Horarios encontrados
 *       404:
 *         description: No encontrados
 */
router.get(
    '/category/:id_category',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    scheduleController.getByCategory
);

// ====================================================
// ELIMINAR HORARIO
// ====================================================

/**
 * @swagger
 * /api/schedules/delete/{id}:
 *   delete:
 *     tags: [Schedules]
 *     summary: Eliminar horario
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
 *         description: Horario eliminado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 */
router.delete(
    '/delete/:id',
    verifyToken,
    authorizeRoles(['admin']),
    scheduleController.delete
);

// ====================================================
// EXPORTAR ROUTER
// ====================================================
module.exports = router;