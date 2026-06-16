// src/views/dashboard/UsersView.jsx
import { useState } from 'react'
import useUsers from '../../hooks/useUsers'
import useAuth from '../../hooks/useAuth'
import AlertMessage from '../common/AlertMessage'
import UserForm from './UserForm'
import UserDetails from './UserDetails'
import '../../styles/Users.css'

const UsersView = () => {
  // ============================================
  // HOOKS
  // ============================================
  const {
    users,
    loading,
    error,
    deleteUser,
    loadUsers
  } = useUsers()
  const {
    currentUser
  } = useAuth()
  // ============================================
  // ESTADOS
  // ============================================
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [message, setMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  // ============================================
  // FILTRO DE BÚSQUEDA
  // ============================================
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id?.toString().includes(searchTerm)
  )
  // ============================================
  // PERMISOS
  // ============================================
  const canCreateUser = () => {
    return currentUser?.role === 'admin'
  }
  const canEdit = () => {
    return currentUser?.role === 'admin'
  }
  const canDelete = (user) => {
    if (!currentUser) return false
    if (currentUser.role !== 'admin') {
      return false
    }
    if (currentUser.id === user.id) {
      return false
    }
    return true
  }
  // ============================================
  // ROLES
  // ============================================
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'role-badge role-admin'
      default:
        return 'role-badge role-user'
    }
  }
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
    if (!canDelete(user)) {
      setMessage({
        type: 'error',
        text: 'No tiene permisos para eliminar usuarios'
      })
      return
    }
    const confirmed = window.confirm(
      `¿Desea eliminar a ${user.email}?`
    )
    if (!confirmed) return
    try {
      await deleteUser(user.id)
      setMessage({
        type: 'success',
        text: 'Usuario eliminado correctamente'
      })
    } catch (err) {
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
    setSelectedUser(user)
    setEditMode(true)
    setShowForm(true)
    setShowDetails(false)
  }
  // ============================================
  // VER DETALLES
  // ============================================
  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setShowDetails(true)
    setShowForm(false)
    setEditMode(false)
  }
  // ============================================
  // FORMULARIO EXITOSO
  // ============================================
  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedUser(null)
    setEditMode(false)
    loadUsers()
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
  // CARGA INICIAL
  // ============================================
  if (loading && users.length === 0) {
    return (
      <div className="loading-container">
        Cargando usuarios...
      </div>
    )
  }
  // ============================================
  // ERROR GENERAL
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
  // RENDER
  // ============================================
  return (
    <div className="users-container">
      {/* CABECERA */}
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
      {/* MENSAJES */}
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
      {/* TABLA */}
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
      {/* FORMULARIO */}
      {showForm && (
        <UserForm
          user={selectedUser}
          isEdit={editMode}
          onSuccess={handleFormSuccess}
          onClose={handleCloseForm}
        />
      )}
      {/* DETALLES */}
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
export default UsersView