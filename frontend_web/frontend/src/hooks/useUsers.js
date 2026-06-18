// src/hooks/useUsers.js
// Importa hooks de React
import { useState, useEffect } from 'react'
// Importa el controlador de usuarios
import UserController from '../controllers/UserController'

const useUsers = () => {
  // Lista de usuarios
  const [users, setUsers] = useState([])
  // Usuario seleccionado
  const [selectedUser, setSelectedUser] = useState(null)
  // Estado de carga
  const [loading, setLoading] = useState(false)
  // Manejo de errores
  const [error, setError] = useState(null)
  // ========================================
  // CARGAR TODOS LOS USUARIOS
  // ========================================
  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    UserController.getAllUsers(
      // Éxito
      (data) => {
        setUsers(data)
        setLoading(false)
      },
      // Error
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
  }
  // ========================================
  // OBTENER USUARIO POR ID
  // ========================================
  const getUserById = async (id) => {
    setLoading(true)
    UserController.getUserById(
      id,
      // Éxito
      (data) => {
        setSelectedUser(data)
        setLoading(false)
      },
      // Error
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
  }
  // ========================================
  // CREAR USUARIO
  // ========================================
  const createUser = async (userData) => {
    return new Promise((resolve, reject) => {
      UserController.createUser(
        userData,
        // Éxito
        (data) => {
          // Recargar usuarios
          loadUsers()
          resolve({
            success: true,
            data
          })
        },
        // Error
        (err) => {
          reject({
            success: false,
            error: err
          })
        }
      )
    })
  }
  // ========================================
  // ACTUALIZAR USUARIO
  // ========================================
  const updateUser = async (id, userData) => {
    return new Promise((resolve, reject) => {
      UserController.updateUser(
        id,
        userData,
        // Éxito
        (data) => {
          loadUsers()
          resolve({
            success: true,
            data
          })
        },
        // Error
        (err) => {
          reject({
            success: false,
            error: err
          })
        }
      )
    })
  }
  // ========================================
  // ACTUALIZAR PARCIALMENTE
  // ========================================
  const patchUser = async (id, partialData) => {
    return new Promise((resolve, reject) => {
      UserController.patchUser(
        id,
        partialData,
        // Éxito
        (data) => {
          loadUsers()
          resolve({
            success: true,
            data
          })
        },
        // Error
        (err) => {
          reject({
            success: false,
            error: err
          })
        }
      )
    })
  }
  // ========================================
  // ELIMINAR USUARIO
  // ========================================
  const deleteUser = async (id) => {
    return new Promise((resolve, reject) => {
      UserController.deleteUser(
        id,
        // Éxito
        () => {
          loadUsers()
          resolve({
            success: true
          })
        },
        // Error
        (err) => {
          reject({
            success: false,
            error: err
          })
        }
      )
    })
  }
  // ========================================
  // CARGAR USUARIOS AL INICIAR
  // ========================================
  useEffect(() => {
    loadUsers()
  }, [])
  // ========================================
  // EXPORTAR FUNCIONES Y ESTADOS
  // ========================================
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
    deleteUser
  }
}
// Exporta el hook
export default useUsers