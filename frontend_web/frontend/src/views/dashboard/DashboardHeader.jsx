// src/views/dashboard/DashboardHeader.jsx

import '../../styles/Navbar.css'
const DashboardHeader = ({
  user,
  onLogout,
  activeTab,
  onTabChange
}) => {

  return (
    <header className="sporty-header">
      {/* ========================================= */}
      {/* LOGO / TÍTULO */}
      {/* ========================================= */}
      <div className="sporty-logo">
        <h2>SPORTY</h2>
        <span>
          Sistema de Gestión Deportiva
        </span>
      </div>
      {/* ========================================= */}
      {/* MENÚ PRINCIPAL */}
      {/* ========================================= */}
      <nav className="sporty-menu">
        <button
          className={
            activeTab === 'dashboard'
              ? 'active'
              : ''
          }
          onClick={() =>
            onTabChange('dashboard')
          }
        >
          Dashboard
        </button>
        <button
          className={
            activeTab === 'users'
              ? 'active'
              : ''
          }
          onClick={() =>
            onTabChange('users')
          }
        >
          Usuarios
        </button>
        <button
          className={
            activeTab === 'categories'
              ? 'active'
              : ''
          }
          onClick={() =>
            onTabChange('categories')
          }
        >
          Categorías
        </button>
        <button
          className={
            activeTab === 'schedules'
              ? 'active'
              : ''
          }
          onClick={() =>
            onTabChange('schedules')
          }
        >
          Horarios
        </button>
        <button
          className={
            activeTab === 'tournaments'
              ? 'active'
              : ''
          }
          onClick={() =>
            onTabChange('tournaments')
          }
        >
          Torneos
        </button>
        <button
          className={
            activeTab === 'products'
              ? 'active'
              : ''
          }
          onClick={() =>
            onTabChange('products')
          }
        >
          Productos
        </button>
      </nav>
      {/* ========================================= */}
      {/* USUARIO */}
      {/* ========================================= */}
      <div className="sporty-user">
        <div>
          <strong>
            {user?.name || 'Usuario'}
          </strong>
          <p>
            {user?.email}
          </p>
          <small>
            Rol:
            {' '}
            {user?.role || 'Usuario'}
          </small>
        </div>
        <button
          className="logout-btn"
          onClick={onLogout}
        >
          Salir
        </button>
      </div>
    </header>
  )
}
export default DashboardHeader