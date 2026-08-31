// src/views/dashboard/UsersView.jsx
import { useMemo, useState } from 'react'
import useUsers from '../../hooks/useUsers'
import useAuth from '../../hooks/useAuth'
import AlertMessage from '../common/AlertMessage'
import UserForm from './UserForm'
import UserDetails from './UserDetails'
import '../../styles/Users.css'

const roleFilters = [
    { key: 'all', label: 'Todos' },
    { key: 'admin', label: 'Administradores' },
    { key: 'seller', label: 'Vendedores' },
    { key: 'customer', label: 'Clientes' }
]

const getRoleLabel = (role) => {
    switch (role) {
        case 'admin': return 'Administrador'
        case 'seller': return 'Vendedor'
        case 'customer': return 'Cliente'
        default: return 'Usuario'
    }
}

const getRoleBadgeClass = (role) => {
    switch (role) {
        case 'admin': return 'badge-sporting badge-sporting-admin'
        case 'seller': return 'badge-sporting badge-sporting-user'
        case 'customer': return 'badge-sporting badge-sporting-secondary'
        default: return 'badge-sporting badge-sporting-user'
    }
}

const UsersView = () => {
    const { users, loading, error, deleteUser, loadUsers, toggleUserStatus } = useUsers()
    const { currentUser } = useAuth()
    const [showForm, setShowForm] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [message, setMessage] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')

    const filteredUsers = useMemo(() => {
        const criteria = searchTerm.trim().toLowerCase()

        return users.filter((user) => {
            const matchesRole = roleFilter === 'all' || user.role === roleFilter
            const matchesSearch = !criteria || [
                user.email,
                user.id,
                user.name,
                user.lastname,
                user.document,
                user.role
            ].some((value) => String(value ?? '').toLowerCase().includes(criteria))

            return matchesRole && matchesSearch
        })
    }, [users, roleFilter, searchTerm])

    const canEdit = (user) => {
        if (!currentUser) return false
        return currentUser.role === 'admin' || currentUser.role === 'seller' || currentUser.id === user.id
    }

    const canDelete = (user) => {
        if (!currentUser) return false
        return currentUser.role === 'admin' && currentUser.id !== user.id
    }

    const canToggleStatus = (user) => {
        if (!currentUser) return false
        return currentUser.role === 'admin' && currentUser.id !== user.id
    }

    const canCreateUser = () => currentUser && (currentUser.role === 'admin' || currentUser.role === 'seller')

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
            } catch (err) {
                setMessage({ type: 'error', text: err.error || 'Error al eliminar usuario' })
            }
            setTimeout(() => setMessage(null), 3000)
        }
    }

    const handleToggleStatus = async (user) => {
        if (!canToggleStatus(user)) {
            setMessage({ type: 'error', text: 'No tiene permisos para cambiar el estado' })
            setTimeout(() => setMessage(null), 3000)
            return
        }

        const nextStatus = user.is_active === 1 ? 0 : 1
        const action = nextStatus === 1 ? 'activar' : 'desactivar'

        if (window.confirm(`¿Estás seguro de ${action} al usuario "${user.email}"?`)) {
            try {
                await toggleUserStatus(user.id, nextStatus === 1)
                setMessage({ type: 'success', text: `Usuario ${action}do exitosamente` })
            } catch (err) {
                setMessage({ type: 'error', text: err.error || `Error al ${action} usuario` })
            }
            setTimeout(() => setMessage(null), 3000)
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

    const activeUsers = users.filter((user) => user.is_active !== 0).length
    const adminUsers = users.filter((user) => user.role === 'admin').length

    return (
        <div>
            <div className="view-toolbar">
                <div>
                    <h2 style={{ margin: 0, color: '#333' }}>Usuarios del sistema</h2>
                </div>
                {canCreateUser() && (
                    <button
                        className="btn-sporting-primary"
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

            <div className="panel-summary-grid">
                <div className="panel-summary-card">
                    <div className="panel-summary-icon">U</div>
                    <div className="panel-summary-meta">
                        <span className="panel-summary-value">{users.length}</span>
                        <span className="panel-summary-label">Usuarios</span>
                    </div>
                </div>
                <div className="panel-summary-card">
                    <div className="panel-summary-icon">A</div>
                    <div className="panel-summary-meta">
                        <span className="panel-summary-value">{activeUsers}</span>
                        <span className="panel-summary-label">Activos</span>
                    </div>
                </div>
                <div className="panel-summary-card">
                    <div className="panel-summary-icon">R</div>
                    <div className="panel-summary-meta">
                        <span className="panel-summary-value">{adminUsers}</span>
                        <span className="panel-summary-label">Administradores</span>
                    </div>
                </div>
            </div>

            {message && (
                <AlertMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
            )}

            <div className="ui-card" style={{ padding: '16px' }}>
                <div className="view-filter" style={{ marginBottom: '12px' }}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar usuario..."
                        className="control-input"
                    />
                </div>

                <div className="view-filter" style={{ marginBottom: '8px' }}>
                    {roleFilters.map((filter) => (
                        <button
                            key={filter.key}
                            type="button"
                            className={roleFilter === filter.key ? 'btn-sporting-primary' : 'btn-sporting-secondary'}
                            onClick={() => setRoleFilter(filter.key)}
                            style={{ padding: '8px 14px', fontSize: '12px' }}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {error && !error.includes('No tiene permisos') && (
                <div className="error-message">
                    Error: {error}
                    <button onClick={loadUsers}>Reintentar</button>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredUsers.length === 0 ? (
                    <div className="ui-card" style={{ textAlign: 'center', color: '#666', padding: '30px 20px' }}>
                        No se encontraron usuarios con ese filtro.
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div key={user.id} className="ui-card" style={{ padding: '16px', border: currentUser?.id === user.id ? '2px solid rgba(139, 0, 0, 0.35)' : '1px solid var(--sporting-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(139, 0, 0, 0.08)', color: 'var(--sporting-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: 'var(--sporting-text)', fontSize: '15px' }}>
                                            {user.name} {user.lastname || ''}
                                            {currentUser?.id === user.id && (
                                                <span className="pill pill-success" style={{ marginLeft: '8px' }}>Tú</span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{user.email}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span className={getRoleBadgeClass(user.role)}>{getRoleLabel(user.role)}</span>
                                    {user.is_active !== undefined && (
                                        <button
                                            type="button"
                                            className={user.is_active ? 'pill pill-success' : 'pill pill-danger'}
                                            onClick={() => handleToggleStatus(user)}
                                            disabled={!canToggleStatus(user)}
                                            title={user.is_active ? 'Desactivar usuario' : 'Activar usuario'}
                                            style={{ border: 'none', cursor: canToggleStatus(user) ? 'pointer' : 'default' }}
                                        >
                                            {user.is_active ? 'Activo' : 'Inactivo'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px 16px', marginTop: '14px', fontSize: '13px', color: 'var(--sporting-text-muted)' }}>
                                <div><strong style={{ color: 'var(--sporting-text)' }}>Documento:</strong> {user.document || '—'}</div>
                                <div><strong style={{ color: 'var(--sporting-text)' }}>Rol:</strong> {getRoleLabel(user.role)}</div>
                                <div><strong style={{ color: 'var(--sporting-text)' }}>ID:</strong> #{user.id}</div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                                <button className="btn-sporting-secondary" type="button" onClick={() => handleViewDetails(user)}>Ver</button>
                                <button className="btn-sporting-secondary" type="button" onClick={() => handleEdit(user)} disabled={!canEdit(user)}>Editar</button>
                                <button className="btn-sporting-danger" type="button" onClick={() => handleDelete(user)} disabled={!canDelete(user)}>Eliminar</button>
                            </div>
                        </div>
                    ))
                )}
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