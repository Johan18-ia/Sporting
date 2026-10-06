// ====================================================
// CONTROLADOR: USER
// ====================================================
// Importa el modelo de usuarios
const User = require("../models/user");
// Librería para encriptar y comparar contraseñas
const bcrypt = require("bcryptjs");
// Librería para generar tokens JWT
const jwt = require("jsonwebtoken");
// Archivo de configuración donde está la clave secreta
const keys = require("../config/keys");
const db = require("../config/config");
const Student = require("../models/student");

// Exportación de métodos del controlador
module.exports = {

    // ====================================================
    // LOGIN DE USUARIO
    // ====================================================
    login(req, res) {
        // Obtiene email y contraseña enviados desde el cliente
        const email = req.body.email;
        const password = req.body.password;

        // Busca el usuario por email
        User.findByEmail(email, async (err, myUser) => {
            // Validación de error en consulta
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: "Error al consultar el usuario",
                    error: err,
                });
            }

            // Validación si el usuario no existe
            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: "El email no existe en la base de datos",
                });
            }

            // Verificar si el usuario está activo
            const isActive = myUser.is_active ?? 1;
            if (isActive === 0) {
                return res.status(403).json({
                    success: false,
                    message: "Usuario desactivado. Contacte al administrador.",
                });
            }

            // Compara la contraseña enviada con la contraseña encriptada
            const isPasswordValid = await bcrypt.compare(
                password,
                myUser.password
            );

            // Si la contraseña es correcta
            if (isPasswordValid) {
                // Genera el token JWT
                const token = jwt.sign(
                    {
                        id: myUser.id,
                        email: myUser.email,
                        role: myUser.role,
                    },
                    keys.secretOrKey,
                    { expiresIn: "24h" }  // ← Token válido por 24 horas
                );

                // Datos que se enviarán al cliente
                const data = {
                    id: myUser.id,
                    email: myUser.email,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    phone: myUser.phone,
                    image: myUser.image,
                    role: myUser.role,
                    user_type: myUser.user_type || 'none',
                    is_active: isActive,
                    studentProfile: myUser.student_profile_id ? {
                        id: myUser.student_profile_id,
                        user_id: myUser.id,
                        category_id: myUser.student_category_id,
                        category_name: myUser.student_category_name,
                        status: myUser.student_status
                    } : null,
                    isStudent: Boolean(myUser.student_profile_id),
                    category_id: myUser.student_category_id || null,
                    session_token: `JWT ${token}`,
                };

                // Respuesta exitosa
                return res.status(200).json({
                    success: true,
                    message: "Usuario autenticado",
                    data: data,
                });
            } else {
                // Respuesta si la contraseña es incorrecta
                return res.status(401).json({
                    success: false,
                    message: "Contraseña o correo incorrecto",
                });
            }
        });
    },

    // ====================================================
    // LISTAR TODOS LOS USUARIOS
    // ====================================================
    getAllUsers(req, res) {
        // Consulta todos los usuarios
        User.findAll((err, users) => {
            // Validación de error
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: "Error al listar usuarios",
                    error: err,
                });
            }
            // Respuesta exitosa
            return res.status(200).json({
                success: true,
                message: "Lista de usuarios",
                data: users,
            });
        });
    },

    // ====================================================
    // OBTENER USUARIO POR ID
    // ====================================================
    getUserById(req, res) {
        // Obtiene el id desde los parámetros
        const id = req.params.id;

        // Busca usuario por id
        User.findById(id, (err, user) => {
            // Validación de error
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: "Error al consultar el usuario",
                    error: err,
                });
            }

            // Validación si el usuario no existe
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado",
                });
            }

            // Respuesta exitosa
            return res.status(200).json({
                success: true,
                message: "Usuario encontrado",
                data: user,
            });
        });
    },

    // ====================================================
    // REGISTRAR USUARIO (PÚBLICO)
    // ====================================================
    register(req, res) {
        // Obtiene y normaliza el tipo de usuario solicitado.
        const user = req.body || {};
        const currentUserRole = req.user?.role;
        const userType = ['student', 'parent', 'none'].includes(user.user_type) ? user.user_type : 'none';
        user.user_type = userType;

        // Valida los datos obligatorios antes de abrir una transacción.
        if (!user.email) {
            return res.status(400).json({
                success: false,
                message: "El email es obligatorio",
            });
        }

        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: "La contraseña es obligatoria",
            });
        }

        if (typeof user.password !== 'string' || user.password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "La contraseña debe tener al menos 6 caracteres",
            });
        }

        if (!user.name) {
            return res.status(400).json({
                success: false,
                message: "El nombre es obligatorio",
            });
        }

        if (userType === 'student' && (!user.document || !user.birth_date || user.category_id == null || user.category_id === '')) {
            return res.status(400).json({
                success: false,
                message: "Documento, fecha de nacimiento y categoría son obligatorios para el estudiante",
            });
        }

        if (userType === 'parent' && !user.document) {
            return res.status(400).json({
                success: false,
                message: "El documento es obligatorio para el padre",
            });
        }

        // Conserva las restricciones de roles para el registro público y administrativo.
        if (!currentUserRole) {
            user.role = 'user';
        } else {
            if (!['admin', 'seller'].includes(currentUserRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Solo administradores y vendedores pueden crear usuarios",
                });
            }

            if (user.role === 'admin' && currentUserRole !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: "Solo un administrador puede crear otro administrador",
                });
            }

            if (user.role === 'seller' && !['admin', 'seller'].includes(currentUserRole)) {
                return res.status(403).json({
                    success: false,
                    message: "No tiene permisos para crear vendedores",
                });
            }
        }

        const validRoles = ['admin', 'seller', 'user'];
        const role = validRoles.includes(user.role) ? user.role : 'user';

        // Abre una conexión dedicada para que usuario y perfil sean atómicos.
        db.getConnection((err, connection) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error al crear el usuario y su perfil",
                });
            }

            connection.beginTransaction(async (transactionErr) => {
                if (transactionErr) {
                    connection.release();
                    return res.status(500).json({
                        success: false,
                        message: "Error al crear el usuario y su perfil",
                    });
                }

                try {
                    const connectionPromise = connection.promise();

                    // Verifica que la categoría del estudiante corresponda a su año de nacimiento.
                    if (userType === 'student') {
                        const birthYear = String(user.birth_date).slice(0, 4);
                        if (!/^\d{4}$/.test(birthYear)) {
                            await connectionPromise.rollback();
                            return res.status(400).json({
                                success: false,
                                message: "La fecha de nacimiento debe tener el formato YYYY-MM-DD",
                            });
                        }

                        const [categoryRows] = await connectionPromise.query(
                            'SELECT category_year FROM categories WHERE id = ?',
                            [user.category_id]
                        );

                        if (!categoryRows.length) {
                            await connectionPromise.rollback();
                            return res.status(400).json({
                                success: false,
                                message: "La categoría seleccionada no existe",
                            });
                        }

                        if (String(categoryRows[0].category_year) !== birthYear) {
                            await connectionPromise.rollback();
                            return res.status(400).json({
                                success: false,
                                message: `La categoría seleccionada no coincide con el año de nacimiento (${birthYear})`,
                            });
                        }
                    }

                    const passwordHash = await bcrypt.hash(user.password, 10);
                    const [userResult] = await connectionPromise.query(
                        `INSERT INTO users (name, lastname, email, password, phone, image, role, user_type, is_active, created_at, updated_at)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                        [
                            user.name,
                            user.lastname || '',
                            user.email,
                            passwordHash,
                            user.phone || '',
                            user.image || '',
                            role,
                            userType,
                            user.is_active ?? 1,
                        ]
                    );
                    const createdUserId = userResult.insertId;

                    if (userType === 'student') {
                        await connectionPromise.query(
                            `INSERT INTO student_profiles (user_id, document, birth_date, address, category_id, emergency_contact_name, emergency_contact_phone, parent_id, status, created_at, updated_at)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                            [
                                createdUserId,
                                user.document,
                                user.birth_date,
                                user.address || null,
                                user.category_id,
                                user.emergency_contact_name || null,
                                user.emergency_contact_phone || null,
                                user.parent_id || null,
                                user.status || 'active',
                            ]
                        );
                    } else if (userType === 'parent') {
                        await connectionPromise.query(
                            `INSERT INTO parent_profiles (user_id, document, address, occupation, created_at, updated_at)
                             VALUES (?, ?, ?, ?, NOW(), NOW())`,
                            [createdUserId, user.document, user.address || null, user.occupation || null]
                        );
                    }

                    // Confirma ambas inserciones solo cuando todo el flujo termina correctamente.
                    await connectionPromise.commit();

                    return res.status(201).json({
                        success: true,
                        message: "Usuario y perfil creados correctamente",
                        data: {
                            id: createdUserId,
                            name: user.name,
                            lastname: user.lastname || '',
                            email: user.email,
                            role,
                            user_type: userType,
                        },
                    });
                } catch (error) {
                    // Revierte usuario y perfil juntos si falla cualquier consulta o el commit.
                    try {
                        await connection.promise().rollback();
                    } catch (rollbackError) {
                        // Mantiene la respuesta asociada al error original.
                    }

                    // Identifica el campo duplicado para devolver un conflicto útil al cliente.
                    if (error.code === 'ER_DUP_ENTRY') {
                        const sqlMessage = error.sqlMessage || '';
                        let message = "Conflicto de datos duplicados";

                        if (sqlMessage.includes('users.email')) {
                            message = "El email ya está registrado";
                        } else if (sqlMessage.includes('student_profiles.document')) {
                            message = "El documento del estudiante ya está registrado";
                        } else if (sqlMessage.includes('parent_profiles.document')) {
                            message = "El documento del padre ya está registrado";
                        }

                        return res.status(409).json({
                            success: false,
                            message,
                        });
                    }

                    return res.status(500).json({
                        success: false,
                        message: "Error al crear el usuario y su perfil",
                    });
                } finally {
                    // Libera la conexión tanto si se confirma como si se revierte la transacción.
                    connection.release();
                }
            });
        });
    },

    // ====================================================
    // ACTUALIZAR USUARIO
    // ====================================================
    getUserUpdate(req, res) {
        // Obtiene datos del usuario
        const user = req.body;
        user.id = req.params.id;

        // Validar que el usuario tenga ID
        if (!user.id) {
            return res.status(400).json({
                success: false,
                message: "El ID del usuario es obligatorio",
            });
        }

        // ============================================
        // VALIDACIONES DE PERMISOS
        // ============================================
        const currentUserRole = req.user?.role;
        const currentUserId = req.user?.id;

        // Verificar que el usuario autenticado tenga permiso
        if (!currentUserRole) {
            return res.status(403).json({
                success: false,
                message: "No autorizado para actualizar usuarios",
            });
        }

        // Solo admin y seller pueden actualizar usuarios
        if (!['admin', 'seller'].includes(currentUserRole)) {
            return res.status(403).json({
                success: false,
                message: "Solo administradores y vendedores pueden actualizar usuarios",
            });
        }

        if (currentUserRole !== 'admin' && currentUserId !== parseInt(req.params.id)) {
            return res.status(403).json({
                success: false,
                message: "No puedes actualizar a otro usuario",
            });
        }

        // Un seller no puede cambiar el rol de un usuario a admin
        if (currentUserRole === 'seller' && user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: "Un vendedor no puede asignar el rol de administrador",
            });
        }

        // Un seller no puede actualizar a otro seller (solo admin puede)
        if (currentUserRole === 'seller' && user.role === 'seller') {
            // Verificar si el usuario actual es seller y quiere actualizar a otro seller
            return res.status(403).json({
                success: false,
                message: "Un vendedor no puede modificar a otro vendedor",
            });
        }

        // Un usuario no puede cambiar su propio rol
        if (user.id === currentUserId && user.role) {
            return res.status(403).json({
                success: false,
                message: "No puedes cambiar tu propio rol",
            });
        }

        // ============================================
        // ACTUALIZAR EL USUARIO
        // ============================================
        if (currentUserRole !== 'admin') {
            delete req.body.role;
        }

        User.update(user, (err, data) => {
            // Validación de error
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: "Error al actualizar el usuario",
                    error: err,
                });
            }

            // Respuesta exitosa
            return res.status(200).json({
                success: true,
                message: "Usuario actualizado",
                data: data,
            });
        });
    },

    // ====================================================
    // ELIMINAR USUARIO
    // ====================================================
    getUserDelete(req, res) {
        // Obtiene el id desde los parámetros
        const id = req.params.id;

        // ============================================
        // VALIDACIONES DE PERMISOS
        // ============================================
        const currentUserRole = req.user?.role;
        const currentUserId = req.user?.id;

        // Solo admin puede eliminar usuarios
        if (currentUserRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Solo el administrador puede eliminar usuarios",
            });
        }

        // Un admin no puede eliminarse a sí mismo
        if (parseInt(id) === currentUserId) {
            return res.status(403).json({
                success: false,
                message: "No puedes eliminar tu propio usuario",
            });
        }

        // ============================================
        // ELIMINAR EL USUARIO
        // ============================================
        User.delete(id, (err, data) => {
            // Validación de error
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: "Error al eliminar el usuario",
                    error: err,
                });
            }

            // Respuesta exitosa
            return res.status(200).json({
                success: true,
                message: "Usuario eliminado",
                data: data,
            });
        });
    },

    // ====================================================
    // CAMBIAR ESTADO DE USUARIO (ACTIVAR/DESACTIVAR)
    // ====================================================
    toggleUserStatus(req, res) {
        const id = req.params.id;
        const { is_active } = req.body;

        // Validar que el estado sea válido
        if (is_active === undefined || (is_active !== 0 && is_active !== 1)) {
            return res.status(400).json({
                success: false,
                message: "El estado debe ser 0 o 1",
            });
        }

        // Verificar permisos
        const currentUserRole = req.user?.role;
        const currentUserId = req.user?.id;

        if (currentUserRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Solo el administrador puede cambiar el estado de usuarios",
            });
        }

        // No permitir desactivarse a sí mismo
        if (parseInt(id) === currentUserId && is_active === 0) {
            return res.status(403).json({
                success: false,
                message: "No puedes desactivar tu propio usuario",
            });
        }

        // Actualizar estado
        User.update({ id, is_active }, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: "Error al cambiar el estado del usuario",
                    error: err,
                });
            }

            return res.status(200).json({
                success: true,
                message: is_active === 1 ? "Usuario activado" : "Usuario desactivado",
                data: data,
            });
        });
    }
};