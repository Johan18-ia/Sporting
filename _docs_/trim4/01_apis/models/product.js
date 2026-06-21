// Encargado JJ
// Importar la conexión a la base de datos
const db = require('../config/config');
// Crear objeto Product
const Product = {};
// ============================================
// LISTAR TODOS LOS PRODUCTOS
// ============================================
Product.findAll = (result) => {
    // Consulta SQL
    const sql = `SELECT * FROM productos`;
    // Ejecutar consulta
    db.query(sql, (err, products) => {
        // Validar errores
        if (err) {
            console.log('Error listando productos:', err);
            result(err, null);
        }
        else {
            // Retornar productos
            result(null, products);
        }
    });
};
// ============================================
// BUSCAR PRODUCTO POR ID
// ============================================
Product.findById = (id, result) => {
    // Consulta SQL
    const sql = `SELECT * FROM productos WHERE id = ?`;
    // Ejecutar consulta
    db.query(sql, [id], (err, product) => {
        // Validar errores
        if (err) {
            console.log('Error consultando producto:', err);
            result(err, null);
        }
        else {
            // Retornar producto
            result(null, product[0]);
        }
    });
};
// ============================================
// CREAR PRODUCTO
// ============================================
Product.create = (product, result) => {
    // Consulta SQL
    const sql = `
        INSERT INTO productos(
            nombre,
            descripcion,
            precio,
            stock,
            imagen,
            categoria,
            fecha_creacion,
            fecha_actualizacion
        )
        VALUES(?,?,?,?,?,?,?,?)
    `;
    // Ejecutar inserción
    db.query(
        sql,
        [
            product.nombre,
            product.descripcion,
            product.precio,
            product.stock,
            product.imagen,
            product.categoria,
            new Date(),
            new Date()
        ],
        (err, res) => {
            // Validar errores
            if (err) {
                console.log('Error creando producto:', err);
                result(err, null);
            }
            else {
                // Retornar producto creado
                result(null, {
                    id: res.insertId,
                    ...product
                });
            }
        }
    );
};
// ============================================
// ACTUALIZAR PRODUCTO
// ============================================
Product.update = (product, result) => {
    // Consulta SQL
    const sql = `
        UPDATE productos
        SET
            nombre = ?,
            descripcion = ?,
            precio = ?,
            stock = ?,
            imagen = ?,
            categoria = ?,
            fecha_actualizacion = ?
        WHERE id = ?
    `;
    // Ejecutar actualización
    db.query(
        sql,
        [
            product.nombre,
            product.descripcion,
            product.precio,
            product.stock,
            product.imagen,
            product.categoria,
            new Date(),
            product.id
        ],
        (err, res) => {
            // Validar errores
            if (err) {
                console.log('Error actualizando producto:', err);
                result(err, null);
            }
            else {
                // Retornar producto actualizado
                result(null, product);
            }
        }
    );
};
// ============================================
// ELIMINAR PRODUCTO
// ============================================
Product.delete = (id, result) => {
    // Consulta SQL
    const sql = `DELETE FROM productos WHERE id = ?`;
    // Ejecutar eliminación
    db.query(sql, [id], (err, res) => {
        // Validar errores
        if (err) {
            console.log('Error eliminando producto:', err);
            result(err, null);
        }
        else {
            // Retornar resultado
            result(null, res);
        }
    });
};
// Exportar modelo
module.exports = Product;