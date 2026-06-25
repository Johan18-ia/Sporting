// ====================================================
// RUTAS: USER
// ====================================================
// Importa express
const express = require('express');
// Crea el router de express
const router = express.Router();
// Importa el controlador de usuarios
const userController = require('../controllers/userController');
// Importa los middlewares de autenticación y roles
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

// ====================================================
// LOGIN DE USUARIO (PÚBLICO)
// ====================================================
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [Users]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', userController.login);

// ====================================================
// CREAR USUARIO (SOLO ADMIN/SELLER)
// ====================================================
/**
 * @swagger
 * /api/users/create:
 *   post:
 *     tags: [Users]
 *     summary: Crear usuario (solo admin/seller)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *               lastname:
 *                 type: string
 *               document:
 *                 type: string
 *               birth_date:
 *                 type: string
 *                 format: date
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, seller, user]
 *               category_id:
 *                 type: integer
 *               emergency_contact:
 *                 type: string
 *               emergency_phone:
 *                 type: string
 *               address:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en los datos de entrada
 *       403:
 *         description: No autorizado
 *       409:
 *         description: Email ya registrado
 */
router.post(
    '/create',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    userController.register
);

// ====================================================
// LISTAR TODOS LOS USUARIOS
// ====================================================
/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Obtener todos los usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Sin permisos suficientes
 */
router.get(
    '/',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    userController.getAllUsers
);

// ====================================================
// OBTENER USUARIO POR ID
// ====================================================
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener usuario por ID
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
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */
router.get(
    '/:id',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    userController.getUserById
);

// ====================================================
// ACTUALIZAR USUARIO
// ====================================================
/**
 * @swagger
 * /api/users:
 *   put:
 *     tags: [Users]
 *     summary: Actualizar usuario
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
 *               name:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               document:
 *                 type: string
 *               birth_date:
 *                 type: string
 *                 format: date
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, seller, user]
 *               category_id:
 *                 type: integer
 *               emergency_contact:
 *                 type: string
 *               emergency_phone:
 *                 type: string
 *               address:
 *                 type: string
 *               image:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Error en los datos
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.put(
    '/',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    userController.getUserUpdate
);

// ====================================================
// ELIMINAR USUARIO
// ====================================================
/**
 * @swagger
 * /api/users/delete/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar usuario
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
 *         description: Usuario eliminado exitosamente
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.delete(
    '/delete/:id',
    verifyToken,
    authorizeRoles(['admin']),
    userController.getUserDelete
);

// ====================================================
// CAMBIAR ESTADO DE USUARIO (ACTIVAR/DESACTIVAR)
// ====================================================
/**
 * @swagger
 * /api/users/toggle-status/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Activar o desactivar usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_active:
 *                 type: integer
 *                 enum: [0, 1]
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       403:
 *         description: No autorizado
 */
router.patch(
    '/toggle-status/:id',
    verifyToken,
    authorizeRoles(['admin']),
    userController.toggleUserStatus
);

// ====================================================
// EXPORTA LAS RUTAS
// ====================================================
module.exports = router;