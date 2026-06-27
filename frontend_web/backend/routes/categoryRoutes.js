// Importar express
const express = require('express');

// Crear router
const router = express.Router();

// Importar controlador
const categoryController = require('../controllers/categoryController');

// Importar middlewares
const {
    verifyToken,
    authorizeRoles
} = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gestión de categorías (años de nacimiento)
 */

// ====================================================
// LISTAR TODAS LAS CATEGORÍAS
// ====================================================

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Obtener todas las categorías
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 */
router.get(
    '/',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    categoryController.getAllCategories
);

// ====================================================
// OBTENER CATEGORÍA POR ID
// ====================================================

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Obtener categoría por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: No encontrada
 *       401:
 *         description: No autorizado
 */
router.get(
    '/:id',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    categoryController.getCategoryById
);

// ====================================================
// CREAR CATEGORÍA
// ====================================================

/**
 * @swagger
 * /api/categories/create:
 *   post:
 *     tags: [Categories]
 *     summary: Crear categoría
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_year
 *             properties:
 *               category_year:
 *                 type: integer
 *                 example: 2015
 *               description:
 *                 type: string
 *                 example: Categoría de jugadores nacidos en 2015
 *     responses:
 *       201:
 *         description: Categoría creada
 *       401:
 *         description: No autorizado
 */
router.post(
    '/create',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    categoryController.create
);

// ====================================================
// ACTUALIZAR CATEGORÍA
// ====================================================

/**
 * @swagger
 * /api/categories:
 *   put:
 *     tags: [Categories]
 *     summary: Actualizar categoría
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               category_year:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       401:
 *         description: No autorizado
 */
router.put(
    '/',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    categoryController.update
);

// ====================================================
// ELIMINAR CATEGORÍA
// ====================================================

/**
 * @swagger
 * /api/categories/delete/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Eliminar categoría
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
 *         description: Categoría eliminada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo admin/seller
 */
router.delete(
    '/delete/:id',
    verifyToken,
    authorizeRoles(['admin']),
    categoryController.delete
);

// Exportar router
module.exports = router;