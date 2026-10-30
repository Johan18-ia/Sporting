// src/views/dashboard/UserDetails.jsx
import useAuth from '../../hooks/useAuth'
import useUsers from '../../hooks/useUsers'

const UserDetails = ({ user, onClose, onEdit, onChanged }) => {
  const { currentUser } = useAuth()
  const { deleteUser, toggleUserStatus } = useUsers()
  const isOwnAccount = Number(user?.id) === Number(currentUser?.id)
  
  // Verificar si el usuario actual puede editar (admin o seller)
  const canEdit = () => {
    return currentUser && (currentUser.role === 'admin' || currentUser.role === 'seller')
  }

  // Obtener texto legible del rol
  const getRoleText = (role) => {
    switch (String(role || '').toLowerCase()) {
      case 'admin': return '👑 Administrador'
      case 'seller': return '�️ Moderador'
      case 'customer': return '👤 Cliente'
      case 'user': return '🎓 Estudiante'
      default: return '👤 Usuario'
    }
  }

  // Formatear fecha si existe
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return 'N/A'
    }
  }

  const handleToggleStatus = async () => {
    if (isOwnAccount) return
    const isActive = user.is_active === 1 || user.is_active === true
    const action = isActive ? 'desactivar' : 'activar'
    if (!window.confirm(`¿Deseas ${action} al usuario "${user.email}"?`)) return
    await toggleUserStatus(user.id, !isActive)
    onChanged?.()
  }

  const handleDelete = async () => {
    if (isOwnAccount) return
    if (!window.confirm(`¿Deseas eliminar al usuario "${user.email}"? Esta acción no se puede deshacer.`)) return
    await deleteUser(user.id)
    onChanged?.()
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detalles del Usuario</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="user-details">
          <div className="detail-row">
            <span className="detail-label">ID:</span>
            <span className="detail-value">{user.id}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Nombre completo:</span>
            <span className="detail-value">
              {user.name} {user.lastname || ''}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Rol:</span>
            <span className="detail-value">
              <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                {getRoleText(user.role)}
              </span>
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Teléfono:</span>
            <span className="detail-value">{user.phone || 'No registrado'}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Fecha registro:</span>
            <span className="detail-value">{formatDate(user.created_at)}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Última actualización:</span>
            <span className="detail-value">{formatDate(user.updated_at)}</span>
          </div>
        </div>

        <div className="modal-footer">
          {canEdit() && !isOwnAccount && (
            <button className="btn-primary" onClick={onEdit}>
              Editar Usuario
            </button>
          )}
          {canEdit() && !isOwnAccount && (
            <button className="btn-secondary" onClick={handleToggleStatus}>
              {user.is_active === 1 || user.is_active === true ? 'Desactivar' : 'Activar'}
            </button>
          )}
          {currentUser?.role === 'admin' && !isOwnAccount && (
            <button className="btn-danger" onClick={handleDelete}>
              Eliminar
            </button>
          )}
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}


const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'admin': return 'role-admin'
    case 'seller': return 'role-seller'
    case 'customer': return 'role-customer'
    default: return 'role-user'
  }
}

export default UserDetails