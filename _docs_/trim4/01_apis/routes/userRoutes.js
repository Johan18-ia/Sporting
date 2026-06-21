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
/**
 * ---------------------------------------------------
 * CREAR USUARIO
 * ---------------------------------------------------
 * Ruta para registrar usuarios nuevos
 */
/**
 * @swagger
 * /api/users/create:
 *   post:
 *     tags: [Users]
 *     summary: Autoregistro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               lastname:
 *                 type: string
 *                 description: Apellido del usuario
 *               role:
 *                 type: string
 *                 enum: [admin, seller, user]
 *                 default: user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *             example:
 *               email: "maria@example.com"
 *               name: "María"
 *               lastname: "García"
 *               password: "password123"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en los datos de entrada
 */
router.post('/create', userController.register);
/**
 * ---------------------------------------------------
 * LOGIN DE USUARIO
 * ---------------------------------------------------
 * Ruta para iniciar sesión
 */
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
/**
 * ---------------------------------------------------
 * LISTAR TODOS LOS USUARIOS
 * ---------------------------------------------------
 * Solo admin y seller pueden acceder
 */

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
/**
 * ---------------------------------------------------
 * OBTENER USUARIO POR ID
 * ---------------------------------------------------
 * Solo admin y seller pueden consultar
 */
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
 *         description: ID del usuario
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
/**
 * ---------------------------------------------------
 * ACTUALIZAR USUARIO
 * ---------------------------------------------------
 * Solo admin y seller pueden actualizar
 */
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               id: "2"
 *               email: "marinita@modificado.com"
 *               name: "Marinita"
 *               lastname: "Rodríguez"
 *               phone: "3163163161"
 *               image: "yyyy"
 *               password: "12345"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */
router.put(
    '/',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    userController.getUserUpdate
);
/**
 * ---------------------------------------------------
 * ELIMINAR USUARIO
 * ---------------------------------------------------
 * Solo admin puede eliminar usuarios
 */
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
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo administradores pueden eliminar
 */
router.delete(
    '/delete/:id',
    verifyToken,
    authorizeRoles(['admin']),
    userController.getUserDelete
);
// Exporta las rutas
module.exports = router;