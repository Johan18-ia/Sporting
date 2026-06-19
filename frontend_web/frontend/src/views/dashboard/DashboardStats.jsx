// src/views/dashboard/DashboardStats.jsx
const DashboardStats = ({ stats }) => {
  // ============================================
  // TARJETAS DEL DASHBOARD SPORTY
  // ============================================
  const statItems = [
    {
      label: 'Usuarios',
      value: stats?.users || 0,
      icon: '👥'
    },
    {
      label: 'Categorías',
      value: stats?.categories || 0,
      icon: '📂'
    },
    {
      label: 'Horarios',
      value: stats?.schedules || 0,
      icon: '📅'
    },
    {
      label: 'Torneos',
      value: stats?.tournaments || 0,
      icon: '🏆'
    },
    {
      label: 'Productos',
      value: stats?.products || 0,
      icon: '🛒'
    }
  ]
  return (
    <div className="stats-grid">
      {statItems.map((item) => (
        <div
          key={`stat-${item.label}`}
          className="stat-card"
        >
          <div className="stat-icon">
            {item.icon}
          </div>
          <div className="stat-content">
            <h3>
              {item.value}
            </h3>
            <p>
              {item.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
export default DashboardStats