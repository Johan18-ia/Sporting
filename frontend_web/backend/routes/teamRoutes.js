const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: Gestión de equipos y miembros
 */

/**
 * @swagger
 * /api/teams:
 *   get:
 *     tags: [Teams]
 *     summary: Obtener todos los equipos
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: 'Equipos listados' }
 *       401: { description: 'No autorizado' }
 *       403: { description: 'Sin permisos' }
 *       500: { description: 'Error del servidor' }
 */
router.get('/', verifyToken, authorizeRoles(['admin', 'seller']), teamController.getAllTeams);

/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     tags: [Teams]
 *     summary: Obtener un equipo por ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: 'Equipo encontrado' }
 *       401: { description: 'No autorizado' }
 *       404: { description: 'Equipo no encontrado' }
 *       500: { description: 'Error del servidor' }
 */
router.get('/:id', verifyToken, authorizeRoles(['admin', 'seller']), teamController.getTeamById);

/**
 * @swagger
 * /api/teams/{id}/members:
 *   get:
 *     tags: [Teams]
 *     summary: Obtener miembros de un equipo
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: 'Listado de miembros' }
 *       401: { description: 'No autorizado' }
 *       500: { description: 'Error del servidor' }
 */
router.get('/:id/members', verifyToken, authorizeRoles(['admin', 'seller']), teamController.getTeamMembers);

/**
 * @swagger
 * /api/teams:
 *   post:
 *     tags: [Teams]
 *     summary: Crear un equipo
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               category_id: { type: integer }
 *               coach_id: { type: integer }
 *               logo: { type: string }
 *               description: { type: string }
 *               is_active: { type: integer, enum: [0,1] }
 *     responses:
 *       201: { description: 'Equipo creado' }
 *       400: { description: 'Datos inválidos' }
 *       401: { description: 'No autorizado' }
 *       403: { description: 'Rol no autorizado' }
 *       500: { description: 'Error del servidor' }
 */
router.post('/', verifyToken, authorizeRoles(['admin', 'seller']), teamController.createTeam);

/**
 * @swagger
 * /api/teams/{id}:
 *   put:
 *     tags: [Teams]
 *     summary: Actualizar un equipo
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category_id: { type: integer }
 *               coach_id: { type: integer }
 *               description: { type: string }
 *               is_active: { type: integer }
 *     responses:
 *       200: { description: 'Equipo actualizado' }
 *       401: { description: 'No autorizado' }
 *       403: { description: 'Sin permisos' }
 *       500: { description: 'Error del servidor' }
 */
router.put('/:id', verifyToken, authorizeRoles(['admin', 'seller']), teamController.updateTeam);

/**
 * @swagger
 * /api/teams/{id}:
 *   delete:
 *     tags: [Teams]
 *     summary: Eliminar un equipo
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: 'Equipo eliminado' }
 *       401: { description: 'No autorizado' }
 *       403: { description: 'Sin permisos' }
 *       500: { description: 'Error del servidor' }
 */
router.delete('/:id', verifyToken, authorizeRoles(['admin']), teamController.deleteTeam);

/**
 * @swagger
 * /api/teams/{id}/members:
 *   post:
 *     tags: [Teams]
 *     summary: Añadir un estudiante a un equipo
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [student_id]
 *             properties:
 *               student_id: { type: integer }
 *               jersey_number: { type: integer }
 *               position: { type: string }
 *     responses:
 *       201: { description: 'Estudiante agregado' }
 *       401: { description: 'No autorizado' }
 *       409: { description: 'Estudiante ya existe en el equipo' }
 *       500: { description: 'Error del servidor' }
 */
router.post('/:id/members', verifyToken, authorizeRoles(['admin', 'seller']), teamController.addMember);

/**
 * @swagger
 * /api/teams/{id}/members/{studentId}:
 *   delete:
 *     tags: [Teams]
 *     summary: Eliminar un estudiante de un equipo
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: 'Estudiante retirado' }
 *       401: { description: 'No autorizado' }
 *       500: { description: 'Error del servidor' }
 */
router.delete('/:id/members/:studentId', verifyToken, authorizeRoles(['admin', 'seller']), teamController.removeMember);

module.exports = router;
