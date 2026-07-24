// src/hooks/useUsers.js
// ====================================================
// HOOK: USERS
// ====================================================
import { useState, useEffect } from 'react'
import UserController from '../controllers/UserController'

const useUsers = () => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // ============================================
    // CARGAR TODOS LOS USUARIOS
    // ============================================
    const loadUsers = async () => {
        setLoading(true)
        setError(null)

        UserController.getAllUsers(
            (data) => {
                setUsers(data)
                setLoading(false)
            },
            (err) => {
                setError(err)
                setLoading(false)
            }
        )
    }

    // ============================================
    // OBTENER USUARIO POR ID
    // ============================================
    const getUserById = async (id) => {
        setLoading(true)

        UserController.getUserById(
            id,
            (data) => {
                setSelectedUser(data)
                setLoading(false)
            },
            (err) => {
                setError(err)
                setLoading(false)
            }
        )
    }

    // ============================================
    // CREAR USUARIO
    // ============================================
    const createUser = async (userData) => {
        return new Promise((resolve, reject) => {
            UserController.createUser(
                userData,
                (data) => {
                    loadUsers()
                    resolve({ success: true, data })
                },
                (err) => {
                    reject({ success: false, error: err })
                }
            )
        })
    }

    // ============================================
    // ACTUALIZAR USUARIO
    // ============================================
    const updateUser = async (id, userData) => {
        return new Promise((resolve, reject) => {
            UserController.updateUser(
                id,
                userData,
                (data) => {
                    loadUsers()
                    resolve({ success: true, data })
                },
                (err) => {
                    reject({ success: false, error: err })
                }
            )
        })
    }

    // ============================================
    // ACTUALIZAR CAMPO ESPECÍFICO (PATCH)
    // ============================================
    const patchUser = async (id, partialData) => {
        return new Promise((resolve, reject) => {
            UserController.patchUser(
                id,
                partialData,
                (data) => {
                    loadUsers()
                    resolve({ success: true, data })
                },
                (err) => {
                    reject({ success: false, error: err })
                }
            )
        })
    }

    // ============================================
    // ELIMINAR USUARIO
    // ============================================
    const deleteUser = async (id) => {
        return new Promise((resolve, reject) => {
            UserController.deleteUser(
                id,
                () => {
                    loadUsers()
                    resolve({ success: true })
                },
                (err) => {
                    reject({ success: false, error: err })
                }
            )
        })
    }

    // ============================================
    // CAMBIAR ESTADO DEL USUARIO
    // ============================================
    const toggleUserStatus = async (id, isActive) => {
        return new Promise((resolve, reject) => {
            UserController.toggleUserStatus(
                id,
                isActive,
                (data) => {
                    loadUsers()
                    resolve({ success: true, data })
                },
                (err) => {
                    reject({ success: false, error: err })
                }
            )
        })
    }

    // ============================================
    // CARGAR USUARIOS AL MONTAR EL HOOK
    // ============================================
    useEffect(() => {
        loadUsers()
    }, [])

    return {
        users,
        selectedUser,
        loading,
        error,
        loadUsers,
        getUserById,
        createUser,
        updateUser,
        patchUser,
        deleteUser,
        toggleUserStatus  // ← NUEVO
    }
}

export default useUsers