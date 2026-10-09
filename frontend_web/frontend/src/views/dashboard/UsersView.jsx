/**
 * UsersView.jsx:
 * - ¿Qué hace? Muestra la lista de usuarios con roles, filtros, estado y acciones de administración.
 * - ¿Qué función cumple en el proyecto? Es la vista equivalente al listado del mobile para controlar identidad, permisos y estudiantes.
 * - Origen mobile equivalente: frontend_mobile/src/presentation/views/users/UsersScreen.tsx
 */
import { useState, useMemo, useEffect } from 'react'
import useUsers from '../../hooks/useUsers'
import useAuth from '../../hooks/useAuth'
import StudentModel from '../../models/StudentModel'
import AlertMessage from '../common/AlertMessage'
import UserForm from './UserForm'
import UserDetails from './UserDetails'
import PageHeader from '../ui/PageHeader'
import Button from '../ui/Button'
import '../../styles/UsersCards.css'

const ROLE_META = {
  admin: { label: 'Administrador', color: '#8B0000' },
  seller: { label: 'Vendedor', color: '#A52A2A' },
  user: { label: 'Estudiante', color: '#B22222' },
  customer: { label: 'Cliente', color: '#6B2D2D' }
}

const USER_TYPE_META = {
  student: { label: 'Estudiante', color: '#B22222' },
  parent: { label: 'Padre', color: '#6B2D2D' },
  none: { label: 'Ninguno', color: '#777' }
}

const initials = (user) => {
  const a = (user?.name || '').trim().charAt(0)
  const b = (user?.lastname || '').trim().charAt(0)
  if (a || b) return ((a + b) || '?').toUpperCase()
  return (user?.email || '?').charAt(0).toUpperCase()
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
  const [filterRole, setFilterRole] = useState('')
  const [filterType, setFilterType] = useState('')
  const [studentMap, setStudentMap] = useState({})

  useEffect(() => {
    const loadStudentMap = async () => {
      try {
        const result = await StudentModel.getAllStudents()
        if (result.success && Array.isArray(result.data)) {
          const nextMap = {}
          result.data.forEach((student) => {
            if (student && student.user_id) {
              nextMap[Number(student.user_id)] = student
            }
          })
          setStudentMap(nextMap)
        }
      } catch (err) {
        console.warn('No se pudo cargar el mapa de estudiantes:', err)
      }
    }

    loadStudentMap()
  }, [])

  const canEdit = () =>
    currentUser && (currentUser.role === 'admin' || currentUser.role === 'seller')

  const canDelete = (user) => {
    if (!currentUser || currentUser.role !== 'admin') return false
    if (currentUser.id === user.id) return false
    return true
  }

  const canToggleStatus = (user) => {
    if (!currentUser || currentUser.role !== 'admin') return false
    if (currentUser.id === user.id) return false
    return true
  }

  const canCreateUser = () =>
    currentUser && (currentUser.role === 'admin' || currentUser.role === 'seller')

    const normalizeRole = (role) => {
    const value = String(role || '').toLowerCase()
    if (['admin', 'seller', 'user', 'customer'].includes(value)) return value
    return 'user'
  }

  const roleLabel = (role) => ROLE_META[normalizeRole(role)]?.label || 'Usuario'
  const roleColor = (role) => ROLE_META[normalizeRole(role)]?.color || '#8B0000'
  const userTypeLabel = (type) => USER_TYPE_META[type]?.label || 'Ninguno'

  const filteredUsers = useMemo(() => {
    let list = [...(users || [])]

    list = list.map((user) => {
      const normalizedRole = normalizeRole(user.role)
      const isStudentUser = normalizedRole === 'user' && (
        String(user.user_type || '').toLowerCase() === 'student' ||
        Boolean(studentMap[Number(user.id)]) ||
        Boolean(user.isStudent)
      )

      return {
        ...user,
        role: normalizedRole,
        isStudentUser,
        resolvedUserType: isStudentUser ? 'student' : (String(user.user_type || 'none').toLowerCase() || 'none')
      }
    })

    if (filterRole) list = list.filter((u) => normalizeRole(u.role) === filterRole)
    if (filterType) list = list.filter((u) => (u.resolvedUserType || 'none') === filterType)
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase()
      list = list.filter((user) => {
        const documentText = String(user.document ?? '')
        const roleText = normalizeRole(user.role)
        return (
          String(user.email || '').toLowerCase().includes(q) ||
          String(user.id ?? '').includes(q) ||
          String(user.name || '').toLowerCase().includes(q) ||
          String(user.lastname || '').toLowerCase().includes(q) ||
          documentText.toLowerCase().includes(q) ||
          roleText.toLowerCase().includes(q)
        )
      })
    }

    const roleOrder = { admin: 1, seller: 2, user: 3, customer: 4 }
    return list.sort((a, b) => {
      const aRole = normalizeRole(a.role)
      const bRole = normalizeRole(b.role)
      const aOrder = roleOrder[aRole] ?? 99
      const bOrder = roleOrder[bRole] ?? 99
      if (aOrder !== bOrder) return aOrder - bOrder
      return String(a.name || '').localeCompare(String(b.name || ''))
    })
  }, [users, searchTerm, filterRole, filterType, studentMap])

  const stats = useMemo(() => {
    const all = users || []
    return {
      total: all.length,
      admin: all.filter((u) => u.role === 'admin').length,
      seller: all.filter((u) => u.role === 'seller').length,
      user: all.filter((u) => u.role === 'user' || u.role === 'customer').length,
      active: all.filter((u) => u.is_active === 1 || u.is_active === true).length
    }
  }, [users])

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
    const isActive = user.is_active === 1 || user.is_active === true
    const newStatus = isActive ? 0 : 1
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

  if (loading && (!users || users.length === 0)) {
    return <div className="usr-status">Cargando usuarios...</div>
  }

  if (error && (error.includes('No tiene permisos') || error.includes('403'))) {
    return (
      <div className="usr-denied">
        <h3>Acceso denegado</h3>
        <p>No tiene permisos para ver la lista de usuarios.</p>
      </div>
    )
  }

  return (
    <div className="usr-page">
      <PageHeader
        title="Usuarios"
        description="Gestión de cuentas y roles del sistema"
        actions={
          canCreateUser() ? (
            <Button
              onClick={() => {
                setSelectedUser(null)
                setEditMode(false)
                setShowForm(true)
                setShowDetails(false)
              }}
            >
              + Nuevo Usuario
            </Button>
          ) : null
        }
      />

      {message && (
        <AlertMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
      )}

      <div className="usr-stats">
        <div className="usr-stat">
          <span className="usr-stat-value">{stats.total}</span>
          <span className="usr-stat-label">Total</span>
        </div>
        <div className="usr-stat">
          <span className="usr-stat-value">{stats.admin}</span>
          <span className="usr-stat-label">Admins</span>
        </div>
        <div className="usr-stat">
          <span className="usr-stat-value">{stats.seller}</span>
          <span className="usr-stat-label">Vendedores</span>
        </div>
        <div className="usr-stat">
          <span className="usr-stat-value">{stats.user}</span>
          <span className="usr-stat-label">Estudiantes</span>
        </div>
        <div className="usr-stat">
          <span className="usr-stat-value">{stats.active}</span>
          <span className="usr-stat-label">Activos</span>
        </div>
      </div>

      <div className="usr-toolbar">
        <input
          type="search"
          className="usr-search"
          placeholder="Buscar por nombre, email, documento o rol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="usr-chips">
          <button
            type="button"
            className={`usr-chip ${!filterRole ? 'is-active' : ''}`}
            onClick={() => setFilterRole('')}
          >
            Todos
          </button>
          {Object.entries(ROLE_META).map(([key, meta]) => (
            <button
              key={key}
              type="button"
              className={`usr-chip ${filterRole === key ? 'is-active' : ''}`}
              onClick={() => setFilterRole(key)}
            >
              {meta.label}
            </button>
          ))}
        </div>
        <div className="usr-chips" style={{ marginTop: '8px' }}>
          <button
            type="button"
            className={`usr-chip ${!filterType ? 'is-active' : ''}`}
            onClick={() => setFilterType('')}
          >
            Todos los tipos
          </button>
          {Object.entries(USER_TYPE_META).map(([key, meta]) => (
            <button
              key={key}
              type="button"
              className={`usr-chip ${filterType === key ? 'is-active' : ''}`}
              onClick={() => setFilterType(key)}
            >
              {meta.label}
            </button>
          ))}
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="usr-empty">
          <p className="usr-empty-title">Sin usuarios</p>
          <p className="usr-empty-text">
            {searchTerm || filterRole
              ? 'No hay resultados con esos filtros.'
              : 'Crea el primer usuario con el botón de arriba.'}
          </p>
        </div>
      ) : (
        <div className="usr-grid">
          {filteredUsers.map((user) => {
            const isActive =
              user.is_active === undefined || user.is_active === null
                ? true
                : user.is_active === 1 || user.is_active === true
            const color = roleColor(user.role)
            const studentTypeLabel = user.role === 'user' && user.isStudentUser ? 'Estudiante' : userTypeLabel(user.resolvedUserType || 'none')
            return (
              <article key={user.id} className="usr-card">
                <div className="usr-card-top">
                  <div
                    className="usr-avatar"
                    style={{ background: `linear-gradient(135deg, ${color}, #c41e3a)` }}
                  >
                    {initials(user)}
                  </div>
                  <div className="usr-card-head">
                    <h3 className="usr-card-name">
                      {user.name || user.lastname
                        ? `${user.name || ''} ${user.lastname || ''}`.trim()
                        : user.email?.split('@')[0]}
                    </h3>
                    <span className="usr-role-badge" style={{ color, background: `${color}14` }}>
                      {roleLabel(user.role)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`usr-status-pill ${isActive ? 'is-on' : 'is-off'}`}
                    onClick={() => handleToggleStatus(user)}
                    disabled={!canToggleStatus(user)}
                  >
                    {isActive ? 'Activo' : 'Inactivo'}
                  </button>
                </div>

                <div className="usr-card-rows">
                  <div className="usr-row">
                    <span className="usr-row-label">Email</span>
                    <span className="usr-row-value">{user.email || '—'}</span>
                  </div>
                  {user.document && (
                    <div className="usr-row">
                      <span className="usr-row-label">Documento</span>
                      <span className="usr-row-value">{user.document}</span>
                    </div>
                  )}
                  <div className="usr-row">
                    <span className="usr-row-label">Tipo</span>
                    <span className="usr-row-value">{studentTypeLabel}</span>
                  </div>
                  <div className="usr-row">
                    <span className="usr-row-label">Estado</span>
                    <span className="usr-row-value">{isActive ? 'Activo' : 'Inactivo'}</span>
                  </div>
                  <div className="usr-row">
                    <span className="usr-row-label">ID</span>
                    <span className="usr-row-value">#{user.id}</span>
                  </div>
                </div>

                <div className="usr-card-actions">
                  <button type="button" className="usr-btn usr-btn-view" onClick={() => handleViewDetails(user)}>
                    Ver
                  </button>
                  <button
                    type="button"
                    className="usr-btn usr-btn-edit"
                    onClick={() => handleEdit(user)}
                    disabled={!canEdit(user)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="usr-btn usr-btn-del"
                    onClick={() => handleDelete(user)}
                    disabled={!canDelete(user)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

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