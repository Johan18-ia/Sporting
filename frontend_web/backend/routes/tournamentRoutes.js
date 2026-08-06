// ====================================================
// IMPORTAR EXPRESS
// ====================================================
const express = require('express');
const router = express.Router();

// ====================================================
// IMPORTAR CONTROLADOR
// ====================================================
const tournamentController = require('../controllers/tournamentController');

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
 *   name: Tournaments
 *   description: Gestión de torneos y emparejamientos
 */

// ====================================================
// LISTAR TORNEOS
// ====================================================

/**
 * @swagger
 * /api/tournaments:
 *   get:
 *     tags: [Tournaments]
 *     summary: Obtener todos los torneos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de torneos
 *       401:
 *         description: No autorizado
 */
router.get(
    '/',
    verifyToken,
    authorizeRoles(['admin', 'seller', 'user']),
    tournamentController.getAll
);

// ====================================================
// CREAR TORNEO
// ====================================================

/**
 * @swagger
 * /api/tournaments/create:
 *   post:
 *     tags: [Tournaments]
 *     summary: Crear torneo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Torneo Intercolegial 2026"
 *     responses:
 *       201:
 *         description: Torneo creado
 *       400:
 *         description: Error en los datos
 */
router.post(
    '/create',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    tournamentController.create
);

// ====================================================
// GENERAR EQUIPOS ALEATORIOS
// ====================================================

/**
 * @swagger
 * /api/tournaments/generate-teams:
 *   post:
 *     tags: [Tournaments]
 *     summary: Generar equipos aleatorios
 *     description: Recibe una lista de estudiantes y los divide en equipos de 5 jugadores
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - students
 *             properties:
 *               students:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     age:
 *                       type: integer
 *             example:
 *               students:
 *                 - name: "Juan"
 *                   age: 15
 *                 - name: "Pedro"
 *                   age: 16
 *                 - name: "Luis"
 *                   age: 15
 *                 - name: "Carlos"
 *                   age: 16
 *                 - name: "Andrés"
 *                   age: 15
 *     responses:
 *       200:
 *         description: Equipos generados correctamente
 *       400:
 *         description: No hay suficientes jugadores
 */
router.post(
    '/generate-teams',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    tournamentController.generateRandomTeams
);

// ====================================================
// EXPORTAR ROUTER
// ====================================================
module.exports = router;