// Importa el modelo de usuarios
const User = require("../models/user");
// Librería para encriptar y comparar contraseñas
const bcrypt = require("bcryptjs");
// Librería para generar tokens JWT
const jwt = require("jsonwebtoken");
// Archivo de configuración donde está la clave secreta
const keys = require("../config/keys");
// Exportación de métodos del controlador
module.exports = {
    // ---------------------------------------------------
    // LOGIN DE USUARIO
    // ---------------------------------------------------
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
                    { expiresIn: "1h" }
                );
                // Datos que se enviarán al cliente
                const data = {
                    id: myUser.id,
                    email: myUser.email,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    image: myUser.image,
                    phone: myUser.phone,
                    role: myUser.role,
                    session_token: `JWT ${token}`,
                };
                // Respuesta exitosa
                return res.status(201).json({
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
    // ---------------------------------------------------
    // LISTAR TODOS LOS USUARIOS
    // ---------------------------------------------------
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
    // ---------------------------------------------------
    // OBTENER USUARIO POR ID
    // ---------------------------------------------------
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
    // ---------------------------------------------------
    // REGISTRAR USUARIO
    // ---------------------------------------------------
    register(req, res) {
        // Obtiene los datos enviados desde el cliente
        const user = req.body;
        // Si no tiene rol, se asigna "user"
        if (!user.role) {
            user.role = "user";
        }
        // Crea el usuario en la base de datos
        User.create(user, (err, data) => {
            // Validación de error
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: "Error al crear al usuario",
                    error: err,
                });
            } else {
                // Respuesta exitosa
                return res.status(201).json({
                    success: true,
                    message: "Usuario creado correctamente",
                    data: data,
                });
            }
        });
    },
    // ---------------------------------------------------
    // ACTUALIZAR USUARIO
    // ---------------------------------------------------
    getUserUpdate(req, res) {
        // Obtiene datos del usuario
        const user = req.body;
        // Actualiza el usuario
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
    // ---------------------------------------------------
    // ELIMINAR USUARIO
    // ---------------------------------------------------
    getUserDelete(req, res) {
        // Obtiene el id desde los parámetros
        const id = req.params.id;
        // Elimina el usuario
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
};