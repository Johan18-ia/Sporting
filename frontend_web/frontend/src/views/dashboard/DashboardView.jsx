// src/views/dashboard/DashboardView.jsx
// src/views/dashboard/DashboardView.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import UsersView from './UsersView'
import CategoriesView from './CategoriesView'
import AlertMessage from '../common/AlertMessage'
import SchedulesView from './SchedulesView'
import CatalogView from './CatalogView'
import ProductsView from './ProductsView'
import StudentsView from './StudentsView'
import TournamentsView from './TournamentsView'
import logoSporting from '../../assets/Logo.png'; 
import '../../styles/Dashboard.css'
import '../../styles/Users.css'

const DashboardView = () => {
  const { currentUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [logoutMessage, setLogoutMessage] = useState('')
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      setLogoutMessage('Sesión cerrada exitosamente')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="animacion-aparecer">
            <div className="dashboard-welcome-banner">
              <h2>Bienvenido de nuevo, {currentUser?.name || currentUser?.email?.split('@')[0] || 'Entrenador'}</h2>
              <p>Panel de administración — Sporting</p>
            </div>

            <div className="stats-grid-container">
              <div className="stat-box-card">
                <h4>Usuarios Activos</h4>
                <p className="stat-number">150</p>
              </div>
              <div className="stat-box-card">
                <h4>Alumnos Registrados</h4>
                <p className="stat-number">85</p>
              </div>
              <div className="stat-box-card">
                <h4>Torneos Vigentes</h4>
                <p className="stat-number">4</p>
              </div>
              <div className="stat-box-card">
                <h4>Rol Asignado</h4>
                <span className="role-badge-pill">{currentUser?.role || 'Admin'}</span>
              </div>
            </div>

          </div>
        )
      case 'users': return <UsersView />
      case 'categories': return <CategoriesView />
      case 'schedules': return <SchedulesView />
      case 'products': return <ProductsView />
      case 'students': return <StudentsView />
      case 'tournaments': return <TournamentsView />
      case 'catalog': return <CatalogView />
      default: return null
    }
  }

  return (
    <div className="sporting-layout-master">
      
<header className="sporting-top-navbar">
  <div className="navbar-logo-area">
    <div className="logo-placeholder">
      {/* Espacio optimizado para la imagen del club */}
      <img 
        src={logoSporting}  // Usamos la variable importada aquí con llaves
        alt="Sporting Logo" 
        className="navbar-logo-img"
        style={{
          height: '100%',
          maxHeight: '70px', 
          objectFit: 'contain',
          display: 'block'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          if (e.target.nextSibling) e.target.nextSibling.style.display = 'inline';
        }}
      />
      <span className="logo-text" style={{ display: 'none' }}>
        SPORTING
      </span>
    </div>
  </div>
  <div className="navbar-user-area">
    <span className="user-email-display">{currentUser?.email}</span>
    <button onClick={handleLogout} className="btn-logout-sporting">
      Cerrar Sesión
    </button>
  </div>
</header>

      <div className="sporting-body-container">
        
        <aside className="sporting-sidebar">
          <nav className="sidebar-menu">
            <button 
              className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Inicio
            </button>           

            <button 
              className={`sidebar-link ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              Categorías
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'schedules' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedules')}
            >
              Horarios
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'tournaments' ? 'active' : ''}`}
              onClick={() => setActiveTab('tournaments')}
            >
              Torneos
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Productos
            </button>
            <button 
              className={`sidebar-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Estudiantes
            </button>
          </nav>
        </aside>

        {/* CONTENEDOR CENTRAL DE TRABAJO */}
        <main className="sporting-content-workspace">
          {logoutMessage && (
            <AlertMessage
              type="success"
              message={logoutMessage}
              onClose={() => setLogoutMessage('')}
            />
          )}
          <div className="workspace-scrollable-box">
            {renderContent()}
          </div>
        </main>

      </div>
    </div>
  )
}

export default DashboardView