// src/views/dashboard/UserDetails.jsx
import useAuth from '../../hooks/useAuth'

const UserDetails = ({ user, onClose, onEdit }) => {
  const { currentUser } = useAuth()
  // ============================
  // PERMISO DE EDICIÓN
  // ============================
  const canEdit = () => {
    return currentUser?.role === 'admin'
  }
  // ============================
  // TEXTO DE ROLES (UNIFICADO SPORTY)
  // ============================
  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return '👑 Administrador'
      case 'user':
        return '👤 Usuario'
      default:
        return '👤 Usuario'
    }
  }
  // ============================
  // CLASE CSS DE ROL
  // ============================
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'role-admin'
      default:
        return 'role-user'
    }
  }
  // ============================
  // FORMATO DE FECHA
  // ============================
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? 'N/A'
      : date.toLocaleString()
  }
  // ============================
  // RENDER
  // ============================
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <h3>Detalles del Usuario</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        {/* INFO */}
        <div className="user-details">
          <div className="detail-row">
            <span className="detail-label">ID:</span>
            <span className="detail-value">{user.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Nombre:</span>
            <span className="detail-value">
              {user.name} {user.lastname}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Rol:</span>
            <span className="detail-value">
              <span className={getRoleBadgeClass(user.role)}>
                {getRoleText(user.role)}
              </span>
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Teléfono:</span>
            <span className="detail-value">
              {user.phone || 'No registrado'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Creado:</span>
            <span className="detail-value">
              {formatDate(user.created_at)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Actualizado:</span>
            <span className="detail-value">
              {formatDate(user.updated_at)}
            </span>
          </div>
        </div>
        {/* FOOTER */}
        <div className="modal-footer">
          {canEdit() && (
            <button className="btn-primary" onClick={onEdit}>
              Editar Usuario
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
export default UserDetails