// src/views/dashboard/DashboardView.jsx
// ====================================================
// VISTA: DASHBOARD - CORREGIDO
// ====================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import DashboardHeader from './DashboardHeader'
import DashboardStats from './DashboardStats'
import UsersView from './UsersView'
import CategoriesView from './CategoriesView' 
import SchedulesView from './SchedulesView'
import CatalogView from './CatalogView'
import ProductsView from './ProductsView'
import StudentsView from './StudentsView'
import TournamentsView from './TournamentsView'
import AlertMessage from '../common/AlertMessage'
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

  // ============================================
  // RENDERIZADO DE CONTENIDO CORREGIDO
  // ============================================
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="dashboard-welcome">
              <h2>Bienvenido, {currentUser?.name || currentUser?.email?.split('@')[0] || 'Usuario'}!</h2>
              <p>Panel de administración de Sporting Club</p>
            </div>
            
            <DashboardStats stats={{
              activeUsers: 150,
              todayVisits: 45,
              activeSessions: 23,
              successRate: 95
            }} />
            
            <div className="dashboard-info">
              <div className="info-card">
                <h3>📊 Resumen del Sistema</h3>
                <p>Gestión completa de la escuela de microfútbol</p>
                <ul>
                  <li>👥 Gestión de Usuarios</li>
                  <li>🏷️ Categorías por año</li>
                  <li>📅 Horarios de entrenamiento</li>
                  <li>👟 Gestión de Estudiantes</li>
                  <li>🏆 Torneos y Equipos</li>
                  <li>🛒 Catálogo de Productos</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h3>🔐 Estado de Autenticación</h3>
                <p><strong>Token:</strong> {localStorage.getItem('auth_token') ? '✅ Activo' : '❌ No encontrado'}</p>
                <p><strong>Usuario:</strong> {currentUser?.email}</p>
                <p><strong>Rol:</strong> <span className="role-badge role-admin">{currentUser?.role}</span></p>
              </div>
            </div>
          </>
        )
      case 'users':
        return <UsersView />
      case 'categories':
        return <CategoriesView />
      case 'schedules':
        return <SchedulesView />
      case 'products':
        return <ProductsView />
      case 'students':
        return <StudentsView />
      case 'tournaments':
        return <TournamentsView />
      case 'catalog':
        return <CatalogView />
      default:
        return null
    }
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader 
        user={currentUser} 
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {logoutMessage && (
        <AlertMessage 
          type="success" 
          message={logoutMessage}
          onClose={() => setLogoutMessage('')}
        />
      )}
      
      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  )
}

export default DashboardView