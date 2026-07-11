// src/views/dashboard/DashboardView.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useDashboard from '../../hooks/useDashboard'
import MainLayout from '../layouts/MainLayout'
import DashboardStats from './DashboardStats'
import UsersView from './UsersView'
import CategoriesView from './CategoriesView'
import AlertMessage from '../common/AlertMessage'
import SchedulesView from './SchedulesView'
import CatalogView from './CatalogView'
import ProductsView from './ProductsView'
import StudentsView from './StudentsView'
import TournamentsView from './TournamentsView'
import StudentDashboardView from './StudentDashboardView'
import '../../styles/Dashboard.css'
import '../../styles/Users.css'

const DashboardView = () => {
  const { currentUser, logout } = useAuth()
  const { stats, loading: statsLoading, loadStats } = useDashboard()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [logoutMessage, setLogoutMessage] = useState('')
  const navigate = useNavigate()

  // Carga las estadisticas reales a traves del hook/controller/modelo
  // que ya existian en el proyecto (antes no se usaban en ningun lado
  // y el dashboard mostraba numeros fijos escritos a mano).
  useEffect(() => {
    loadStats()
  }, [])

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
  // ROL "user" (estudiante): panel propio, mas simple.
  // Esta rama existia en un componente viejo del proyecto que se
  // superponia con el dashboard nuevo (ver auditoria); se restaura
  // aqui reutilizando StudentDashboardView.jsx tal cual ya estaba.
  // ============================================
  if (currentUser?.role === 'user') {
    return (
      <MainLayout
        activeTab="dashboard"
        onTabChange={() => {}}
        user={currentUser}
        onLogout={handleLogout}
      >
        {logoutMessage && (
          <AlertMessage
            type="success"
            message={logoutMessage}
            onClose={() => setLogoutMessage('')}
          />
        )}
        <StudentDashboardView />
      </MainLayout>
    )
  }

  // ============================================
  // ROLES "admin" / "seller": panel de administracion
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

            <DashboardStats
              stats={{
                activeUsers: stats?.activeUsers ?? 0,
                todayVisits: stats?.todayVisits ?? 0,
                activeSessions: stats?.activeSessions ?? 0,
                successRate: stats?.successRate ?? 0
              }}
              loading={statsLoading}
            />

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
    <MainLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      user={currentUser}
      onLogout={handleLogout}
    >
      {logoutMessage && (
        <AlertMessage
          type="success"
          message={logoutMessage}
          onClose={() => setLogoutMessage('')}
        />
      )}
      {renderContent()}
    </MainLayout>
  )
}

export default DashboardView