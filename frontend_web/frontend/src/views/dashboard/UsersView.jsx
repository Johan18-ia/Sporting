// src/views/dashboard/UsersView.jsx

// ============================================
// IMPORTACIONES
// ============================================

// Hook de React para manejo de estados
import { useState } from 'react'

// Hook personalizado para gestión de usuarios
import useUsers from '../../hooks/useUsers'

// Hook para obtener información del usuario autenticado
import useAuth from '../../hooks/useAuth'

// Componente para mostrar mensajes de alerta
import AlertMessage from '../common/AlertMessage'

// Formulario para crear y editar usuarios
import UserForm from './UserForm'

// Vista de detalles del usuario
import UserDetails from './UserDetails'

// Estilos del módulo de usuarios
import '../../styles/Users.css'

const UsersView = () => {
  // ============================================
  // HOOKS PERSONALIZADOS
  // ============================================
  // Obtiene información y funciones del módulo usuarios
  const {
    users,
    loading,
    error,
    deleteUser,
    loadUsers
  } = useUsers()
  // Obtiene el usuario autenticado
  const {
    currentUser
  } = useAuth()
  // ============================================
  // ESTADOS DEL COMPONENTE
  // ============================================
  // Controla visibilidad del formulario
  const [showForm, setShowForm] = useState(false)
  // Controla visibilidad del modal de detalles
  const [showDetails, setShowDetails] = useState(false)
  // Usuario actualmente seleccionado
  const [selectedUser, setSelectedUser] = useState(null)
  // Define si el formulario está en modo edición
  const [editMode, setEditMode] = useState(false)
  // Mensajes informativos o de error
  const [message, setMessage] = useState(null)
  // Texto utilizado en el buscador
  const [searchTerm, setSearchTerm] = useState('')
  // ============================================
  // FILTRO DE BÚSQUEDA
  // ============================================
  // Filtra usuarios por:
  // - Email
  // - Nombre
  // - Apellido
  // - Rol
  // - ID
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id?.toString().includes(searchTerm)
  )
  // ============================================
  // VALIDACIÓN DE PERMISOS
  // ============================================
  // Solo administradores pueden crear usuarios
  const canCreateUser = () => {
    return currentUser?.role === 'admin'
  }
  // Solo administradores pueden editar usuarios
  const canEdit = () => {
    return currentUser?.role === 'admin'
  }
  // Solo administradores pueden eliminar usuarios
  // y no pueden eliminarse a sí mismos
  const canDelete = (user) => {
    if (!currentUser) {
      return false
    }
    if (currentUser.role !== 'admin') {
      return false
    }
    if (currentUser.id === user.id) {
      return false
    }
    return true
  }
  // ============================================
  // FORMATEO DE ROLES
  // ============================================
  // Devuelve la clase CSS correspondiente al rol
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'role-badge role-admin'

      default:
        return 'role-badge role-user'
    }
  }
  // Devuelve el texto visible del rol
  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return '👑 Administrador'
      default:
        return '👤 Usuario'
    }
  }
  // ============================================
  // ELIMINAR USUARIO
  // ============================================
  const handleDelete = async (user) => {
    // Verifica permisos
    if (!canDelete(user)) {
      setMessage({
        type: 'error',
        text: 'No tiene permisos para eliminar usuarios'
      })
      return
    }
    // Confirmación del usuario
    const confirmed = window.confirm(
      `¿Desea eliminar a ${user.email}?`
    )
    if (!confirmed) {
      return
    }
    try {
      // Solicita eliminación
      await deleteUser(user.id)
      // Recarga la lista
      loadUsers()
      // Mensaje de éxito
      setMessage({
        type: 'success',
        text: 'Usuario eliminado correctamente'
      })
    } catch (err) {
      // Mensaje de error
      setMessage({
        type: 'error',
        text: err.error || 'Error al eliminar usuario'
      })
    }
  }
  // ============================================
  // EDITAR USUARIO
  // ============================================
  const handleEdit = (user) => {
    // Selecciona usuario
    setSelectedUser(user)
    // Activa modo edición
    setEditMode(true)
    // Muestra formulario
    setShowForm(true)
    // Oculta detalles
    setShowDetails(false)
  }
  // ============================================
  // VER DETALLES
  // ============================================
  const handleViewDetails = (user) => {
    // Guarda usuario seleccionado
    setSelectedUser(user)
    // Muestra modal de detalles
    setShowDetails(true)
    // Oculta formulario
    setShowForm(false)
    // Desactiva edición
    setEditMode(false)
  }
  // ============================================
  // OPERACIÓN EXITOSA
  // ============================================
  const handleFormSuccess = () => {
    // Cierra formulario
    setShowForm(false)
    // Limpia usuario seleccionado
    setSelectedUser(null)
    // Sale del modo edición
    setEditMode(false)
    // Recarga usuarios
    loadUsers()
    // Mensaje informativo
    setMessage({
      type: 'success',
      text: 'Operación realizada correctamente'
    })
  }
  // ============================================
  // CERRAR FORMULARIO
  // ============================================
  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedUser(null)
    setEditMode(false)
  }
  // ============================================
  // CERRAR DETALLES
  // ============================================
  const handleCloseDetails = () => {
    setShowDetails(false)
    setSelectedUser(null)
  }
  // ============================================
  // ESTADO DE CARGA
  // ============================================
  if (loading && users.length === 0) {
    return (
      <div className="loading-container">
        Cargando usuarios...
      </div>
    )
  }
  // ============================================
  // MANEJO DE ERRORES
  // ============================================
  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button
          className="btn-primary"
          onClick={loadUsers}
        >
          Reintentar
        </button>
      </div>
    )
  }
  // ============================================
  // INTERFAZ PRINCIPAL
  // ============================================
  return (
    <div className="users-container">
      {/* CABECERA DEL MÓDULO */}
      <div className="users-header">
        <h2>
          Gestión de Usuarios
        </h2>
        {canCreateUser() && (
          <button
            className="btn-primary"
            onClick={() => {
              setSelectedUser(null)
              setEditMode(false)
              setShowForm(true)
              setShowDetails(false)
            }}
          >
            + Nuevo Usuario
          </button>
        )}
      </div>
      {/* MENSAJES DEL SISTEMA */}
      {message && (
        <AlertMessage
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
      {/* BUSCADOR */}
      <div className="users-search">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
        }
          className="search-input"
        />
      </div>
      {/* TABLA DE USUARIOS */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="no-data"
                >
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {user.name} {user.lastname}
                  </td>
                  <td>
                    {user.email}
                  </td>
                  <td>
                    <span
                      className={
                        getRoleBadgeClass(user.role)
                      }
                    >
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td>
                    {user.phone || '—'}
                  </td>
                  <td className="actions">
                    <button
                      className="btn-view"
                      onClick={() =>
                        handleViewDetails(user)
                      }
                    >
                      👁️
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() =>
                        handleEdit(user)
                      }
                      disabled={!canEdit()}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() =>
                        handleDelete(user)
                      }
                      disabled={!canDelete(user)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* FORMULARIO DE CREACIÓN Y EDICIÓN */}
      {showForm && (
        <UserForm
          user={selectedUser}
          isEdit={editMode}
          onSuccess={handleFormSuccess}
          onClose={handleCloseForm}
        />
      )}
      {/* DETALLES DEL USUARIO */}
      {showDetails && selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={handleCloseDetails}
          onEdit={() => {
            handleCloseDetails()
            handleEdit(selectedUser)
          }}
        />
      )}
    </div>
  )
}
// Exporta el componente
export default UsersView