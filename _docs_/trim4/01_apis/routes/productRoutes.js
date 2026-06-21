// Encargado JJ
// Importar express
const express = require('express');
// Crear router
const router = express.Router();
// Importar controlador
const productController = require('../controllers/productController');
// Importar middlewares
const {
    verifyToken,
    authorizeRoles
} = require('../middlewares/authMiddleware');
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión de productos
 */
/**
 * ---------------------------------------------------
 * LISTAR TODOS LOS PRODUCTOS
 * ---------------------------------------------------
 * Solo admin y seller pueden acceder
 */
/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Obtener todos los productos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Sin permisos suficientes
 */
router.get(
    '/',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    productController.getAllProducts
);
/**
 * ---------------------------------------------------
 * OBTENER PRODUCTO POR ID
 * ---------------------------------------------------
 * Solo admin y seller pueden consultar
 */
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Obtener producto por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 */
router.get(
    '/:id',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    productController.getProductById
);
/**
 * ---------------------------------------------------
 * CREAR PRODUCTO
 * ---------------------------------------------------
 * Solo admin y seller pueden crear productos
 */
/**
 * @swagger
 * /api/products/create:
 *   post:
 *     tags: [Products]
 *     summary: Crear producto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *               - stock
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del producto
 *               descripcion:
 *                 type: string
 *                 description: Descripción del producto
 *               precio:
 *                 type: number
 *                 description: Precio del producto
 *               stock:
 *                 type: integer
 *                 description: Cantidad disponible
 *               imagen:
 *                 type: string
 *                 description: URL de la imagen
 *               categoria:
 *                 type: string
 *                 description: Categoría del producto
 *             example:
 *               nombre: "Laptop Gamer"
 *               descripcion: "Laptop Ryzen 7"
 *               precio: 3500
 *               stock: 10
 *               imagen: "https://imagen.com/laptop.png"
 *               categoria: "Tecnología"
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error en los datos enviados
 *       401:
 *         description: No autorizado
 */
router.post(
    '/create',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    productController.create
);
/**
 * ---------------------------------------------------
 * ACTUALIZAR PRODUCTO
 * ---------------------------------------------------
 * Solo admin y seller pueden actualizar productos
 */
/**
 * @swagger
 * /api/products:
 *   put:
 *     tags: [Products]
 *     summary: Actualizar producto
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
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               imagen:
 *                 type: string
 *               categoria:
 *                 type: string
 *             example:
 *               id: 1
 *               nombre: "Laptop Actualizada"
 *               descripcion: "Nueva descripción"
 *               precio: 4200
 *               stock: 5
 *               imagen: "https://imagen.com/producto.png"
 *               categoria: "Tecnología"
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 */
router.put(
    '/',
    verifyToken,
    authorizeRoles(['admin', 'seller']),
    productController.update
);
/**
 * ---------------------------------------------------
 * ELIMINAR PRODUCTO
 * ---------------------------------------------------
 * Solo admin puede eliminar productos
 */
/**
 * @swagger
 * /api/products/delete/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Eliminar producto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo administradores pueden eliminar
 */
router.delete(
    '/delete/:id',
    verifyToken,
    authorizeRoles(['admin']),
    productController.delete
);
// Exportar rutas
module.exports = router;