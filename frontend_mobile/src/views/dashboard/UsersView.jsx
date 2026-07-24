// src/views/dashboard/UsersView.jsx
// ====================================================
// VISTA: GESTIÓN DE USUARIOS
// ====================================================
import { useState } from 'react'
import useUsers from '../../hooks/useUsers'
import useAuth from '../../hooks/useAuth'
import AlertMessage from '../common/AlertMessage'
import UserForm from './UserForm'
import UserDetails from './UserDetails'
import '../../styles/Users.css'

const UsersView = () => {
    const { users, loading, error, deleteUser, loadUsers, toggleUserStatus } = useUsers()
    const { currentUser } = useAuth()
    const [showForm, setShowForm] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [message, setMessage] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    // ============================================
    // FILTRAR USUARIOS
    // ============================================
    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id?.toString().includes(searchTerm) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.document?.includes(searchTerm) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // ============================================
    // PERMISOS
    // ============================================
    const canEdit = (user) => {
        if (!currentUser) return false
        if (currentUser.role === 'admin') return true
        if (currentUser.role === 'seller') return true
        return false
    }

    const canDelete = (user) => {
        if (!currentUser) return false
        if (currentUser.role !== 'admin') return false
        if (currentUser.id === user.id) return false
        return true
    }

    const canToggleStatus = (user) => {
        if (!currentUser) return false
        if (currentUser.role !== 'admin') return false
        if (currentUser.id === user.id) return false
        return true
    }

    const canCreateUser = () => {
        return currentUser && (currentUser.role === 'admin' || currentUser.role === 'seller')
    }

    // ============================================
    // BADGES DE ROL
    // ============================================
    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin': return 'role-badge role-admin'
            case 'seller': return 'role-badge role-seller'
            case 'customer': return 'role-badge role-customer'
            default: return 'role-badge role-user'
        }
    }

    const getRoleText = (role) => {
        switch (role) {
            case 'admin': return ' Administrador'
            case 'seller': return ' Vendedor'
            case 'customer': return ' Cliente'
            default: return ' Usuario'
        }
    }

    const getStatusBadge = (isActive) => {
        if (isActive === undefined || isActive === null) return null
        return {
            background: isActive ? '#10b981' : '#8B0000',
            color: 'white',
            padding: '2px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer'
        }
    }

    // ============================================
    // MANEJADORES
    // ============================================
    const handleDelete = async (user) => {
        if (!canDelete(user)) {
            setMessage({ type: 'error', text: 'No tiene permisos para eliminar este usuario' })
            setTimeout(() => setMessage(null), 3000)
            return
        }

        if (window.confirm(`¿Estás seguro de eliminar al usuario "${user.email}"?`)) {
            try {
                await deleteUser(user.id)
                setMessage({ type: 'success', text: 'Usuario eliminado exitosamente' })
                setTimeout(() => setMessage(null), 3000)
            } catch (err) {
                setMessage({ type: 'error', text: err.error || 'Error al eliminar usuario' })
            }
        }
    }

    const handleToggleStatus = async (user) => {
        if (!canToggleStatus(user)) {
            setMessage({ type: 'error', text: 'No tiene permisos para cambiar el estado' })
            setTimeout(() => setMessage(null), 3000)
            return
        }

        const newStatus = user.is_active === 1 ? 0 : 1
        const action = newStatus === 1 ? 'activar' : 'desactivar'

        if (window.confirm(`¿Estás seguro de ${action} al usuario "${user.email}"?`)) {
            try {
                await toggleUserStatus(user.id, newStatus === 1)
                setMessage({ type: 'success', text: `Usuario ${action}do exitosamente` })
                setTimeout(() => setMessage(null), 3000)
            } catch (err) {
                setMessage({ type: 'error', text: err.error || `Error al ${action} usuario` })
            }
        }
    }

    const handleEdit = (user) => {
        if (!canEdit(user)) {
            setMessage({ type: 'error', text: 'No tiene permisos para editar este usuario' })
            setTimeout(() => setMessage(null), 3000)
            return
        }
        setSelectedUser(user)
        setEditMode(true)
        setShowForm(true)
        setShowDetails(false)
    }

    const handleViewDetails = (user) => {
        setSelectedUser(user)
        setShowDetails(true)
        setShowForm(false)
        setEditMode(false)
    }

    const handleFormSuccess = () => {
        setShowForm(false)
        setEditMode(false)
        setSelectedUser(null)
        loadUsers()
        setMessage({ type: 'success', text: 'Operación completada exitosamente' })
        setTimeout(() => setMessage(null), 3000)
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setEditMode(false)
        setSelectedUser(null)
    }

    const handleCloseDetails = () => {
        setShowDetails(false)
        setSelectedUser(null)
    }

    // ============================================
    // RENDERIZADO
    // ============================================
    if (loading && users.length === 0) {
        return <div className="loading-container">Cargando usuarios...</div>
    }

    if (error && (error.includes('No tiene permisos') || error.includes('403'))) {
        return (
            <div className="error-container">
                <div className="error-icon"></div>
                <h3>Acceso Denegado</h3>
                <p>No tiene permisos para ver la lista de usuarios.</p>
                <p className="error-hint">Contacte al administrador si necesita acceso.</p>
            </div>
        )
    }

    return (
        <div className="users-container">
            <div className="users-header">
                <h2>Tus estudiantes</h2>
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

            {message && (
                <AlertMessage
                    type={message.type}
                    message={message.text}
                    onClose={() => setMessage(null)}
                />
            )}

            <div className="users-search">
                <input
                    type="text"
                    placeholder="Buscar por email, nombre, documento, ID o rol..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {error && !error.includes('No tiene permisos') && (
                <div className="error-message">
                    Error: {error}
                    <button onClick={loadUsers}>Reintentar</button>
                </div>
            )}

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Documento</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-data">
                                    No hay usuarios registrados
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className={currentUser?.id === user.id ? 'current-user-row' : ''}>
                                    <td>{user.id}</td>
                                    <td>
                                        <strong>{user.name} {user.lastname || ''}</strong>
                                        <div style={{ fontSize: '11px', color: '#888' }}>
                                            {user.birth_date ? ` ${user.birth_date}` : ''}
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '13px', color: '#666' }}>
                                        {user.document || '—'}
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={getRoleBadgeClass(user.role)}>
                                            {getRoleText(user.role)}
                                        </span>
                                    </td>
                                    <td>
                                        {user.is_active !== undefined && (
                                            <span
                                                style={getStatusBadge(user.is_active)}
                                                onClick={() => handleToggleStatus(user)}
                                                title={`${user.is_active ? 'Desactivar' : 'Activar'} usuario`}
                                            >
                                                {user.is_active ? '✅ Activo' : '❌ Inactivo'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="actions">
                                        <button
                                            className="btn-view"
                                            onClick={() => handleViewDetails(user)}
                                            title="Ver detalles"
                                        >
                                            
                                        </button>
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEdit(user)}
                                            title="Editar"
                                            disabled={!canEdit(user)}
                                        >
                                            
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(user)}
                                            title="Eliminar"
                                            disabled={!canDelete(user)}
                                        >
                                            
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <UserForm
                    user={selectedUser}
                    isEdit={editMode}
                    onSuccess={handleFormSuccess}
                    onClose={handleCloseForm}
                />
            )}

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