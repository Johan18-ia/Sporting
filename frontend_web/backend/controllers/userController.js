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
        // Obtiene datos del usuario desde el body
        const user = req.body;
        const currentUserRole = req.user?.role;
        const userType = ['student', 'parent', 'none'].includes(user.user_type) ? user.user_type : 'none';
        user.user_type = userType;

        // ============================================
        // VALIDACIONES DE CAMPOS OBLIGATORIOS
        // ============================================
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

        if (user.password.length < 6) {
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

        // El registro público solo puede crear usuarios normales.
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

        // ============================================
        // CREAR EL USUARIO
        // ============================================
        User.create(user, (err, data) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        success: false,
                        message: "El email ya está registrado",
                    });
                }

                return res.status(501).json({
                    success: false,
                    message: "Error al crear al usuario",
                    error: err,
                });
            }

            const createdUserId = data?.id;

            if (userType === 'student') {
                const studentData = {
                    user_id: createdUserId,
                    document: user.document || null,
                    birth_date: user.birth_date || null,
                    address: user.address || null,
                    category_id: user.category_id || null,
                    emergency_contact_name: user.emergency_contact_name || null,
                    emergency_contact_phone: user.emergency_contact_phone || null,
                    parent_id: user.parent_id || null,
                    status: user.status || 'active'
                };

                db.query(
                    `INSERT INTO student_profiles (user_id, document, birth_date, address, category_id, emergency_contact_name, emergency_contact_phone, parent_id, status, created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                    [
                        studentData.user_id,
                        studentData.document,
                        studentData.birth_date,
                        studentData.address,
                        studentData.category_id,
                        studentData.emergency_contact_name,
                        studentData.emergency_contact_phone,
                        studentData.parent_id,
                        studentData.status
                    ],
                    (studentErr) => {
                        if (studentErr) {
                            return res.status(500).json({
                                success: false,
                                message: 'Usuario creado pero no se pudo crear el perfil de estudiante',
                                error: studentErr
                            });
                        }

                        return res.status(201).json({
                            success: true,
                            message: 'Usuario y perfil de estudiante creados correctamente',
                            data: { ...data, user_type: userType }
                        });
                    }
                );
                return;
            }

            if (userType === 'parent') {
                db.query(
                    `INSERT INTO parent_profiles (user_id, document, address, occupation, created_at, updated_at)
                     VALUES (?, ?, ?, ?, NOW(), NOW())`,
                    [createdUserId, user.document || null, user.address || null, user.occupation || null],
                    (parentErr) => {
                        if (parentErr) {
                            return res.status(500).json({
                                success: false,
                                message: 'Usuario creado pero no se pudo crear el perfil de padre',
                                error: parentErr
                            });
                        }

                        return res.status(201).json({
                            success: true,
                            message: 'Usuario y perfil de padre creados correctamente',
                            data: { ...data, user_type: userType }
                        });
                    }
                );
                return;
            }

            return res.status(201).json({
                success: true,
                message: "Usuario creado correctamente",
                data: { ...data, user_type: userType },
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