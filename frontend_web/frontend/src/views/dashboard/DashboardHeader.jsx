// src/views/dashboard/DashboardHeader.jsx
const DashboardHeader = ({ user, onLogout, activeTab, onTabChange }) => {
  const headerStyles = {
    background: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexWrap: 'wrap',
    gap: '10px'
  }

  const logoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 0'
  }

  const logoTextStyles = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#8B0000',
    margin: 0
  }

  const badgeStyles = {
    background: '#8B0000',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600
  }

  const tabStyles = {
    display: 'flex',
    gap: '4px',
    background: '#f0f0f0',
    padding: '4px',
    borderRadius: '10px',
    flexWrap: 'wrap'
  }

  const tabBtnStyles = (isActive) => ({
    padding: '8px 16px',
    border: 'none',
    background: isActive ? '#8B0000' : 'transparent',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    color: isActive ? 'white' : '#555',
    whiteSpace: 'nowrap'
  })

  const userInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  }

  const userNameStyles = {
    fontWeight: 600,
    color: '#333',
    fontSize: '14px'
  }

  const userEmailStyles = {
    fontSize: '12px',
    color: '#666'
  }

  const logoutBtnStyles = {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.3s ease'
  }

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'users', label: '👥 Usuarios' },
    { id: 'students', label: '👟 Estudiantes' },
    { id: 'categories', label: '🏷️ Categorías' },
    { id: 'schedules', label: '📅 Horarios' },
    { id: 'products', label: '🛒 Productos' },
    { id: 'tournaments', label: '🏆 Torneos' }
  ]

  return (
    <header style={headerStyles}>
      <div style={logoStyles}>
        <span style={{ fontSize: '28px' }}>⚽</span>
        <h1 style={logoTextStyles}>SPORTING</h1>
        <span style={badgeStyles}>Admin</span>
      </div>

      <div style={tabStyles}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={tabBtnStyles(activeTab === tab.id)}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={userInfoStyles}>
        <div style={{ textAlign: 'right' }}>
          <div style={userNameStyles}>
            {user?.name || user?.email?.split('@')[0] || 'Usuario'}
          </div>
          <div style={userEmailStyles}>{user?.email}</div>
        </div>
        <button onClick={onLogout} style={logoutBtnStyles}>
          🚪 Salir
        </button>
      </div>
    </header>
  )
}

export default DashboardHeader