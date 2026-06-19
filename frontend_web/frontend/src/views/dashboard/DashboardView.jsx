// src/views/dashboard/DashboardView.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Hook de autenticación
import useAuth from '../../hooks/useAuth'
// Componentes del dashboard
import DashboardHeader from './DashboardHeader'
import DashboardStats from './DashboardStats'
import UsersView from './UsersView'
// Componentes comunes
import AlertMessage from '../common/AlertMessage'
// Estilos
import '../../styles/Dashboard.css'
import '../../styles/Users.css'

const DashboardView = () => {
  // ============================================
  // AUTH
  // ============================================
  const {
    currentUser,
    logout
  } = useAuth()
  const navigate = useNavigate()
  // ============================================
  // ESTADOS
  // ============================================
  const [activeTab, setActiveTab] =
    useState('dashboard')
  const [logoutMessage, setLogoutMessage] =
    useState('')
  // ============================================
  // CERRAR SESIÓN
  // ============================================
  const handleLogout = async () => {
    try {
      await logout()
      setLogoutMessage(
        'Sesión cerrada correctamente'
      )
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      console.error(
        'Error al cerrar sesión:',
        error
      )
    }
  }
  // ============================================
  // CONTENIDO DINÁMICO
  // ============================================
  const renderContent = () => {
    switch (activeTab) {
      // ========================================
      // INICIO DEL DASHBOARD
      // ========================================
      case 'dashboard':
        return (
          <>
            {/* Bienvenida */}
            <div className="dashboard-welcome">
              <h2>
                Bienvenido,
                {' '}
                {
                  currentUser?.name ||
                  currentUser?.email?.split('@')[0] ||
                  'Usuario'
                }
              </h2>
              <p>
                Panel principal del sistema Sporty
              </p>
            </div>
            {/* Estadísticas generales */}
            <DashboardStats
              stats={{
                users: 0,
                categories: 0,
                schedules: 0,
                tournaments: 0,
                products: 0
              }}
            />
            {/* Información del sistema */}
            <div className="dashboard-info">
              <div className="info-card">
                <h3>
                  Sistema Sporty
                </h3>
                <p>
                  Plataforma de gestión deportiva
                  para administración de usuarios,
                  categorías, horarios,
                  torneos y productos.
                </p>
                <ul>
                  <li>
                    ✅ Autenticación JWT
                  </li>
                  <li>
                    ✅Gestión de Usuarios
                  </li>
                  <li>
                    ✅ Gestión de Categorías
                  </li>
                  <li>
                    ✅ Gestión de Horarios
                  </li>
                  <li>
                    ✅ Gestión de Torneos
                  </li>
                  <li>
                    ✅ Gestión de Productos
                  </li>
                </ul>
              </div>
              {/* Información del usuario */}
              <div className="info-card">
                <h3>
                  Información de Sesión
                </h3>
                <p>
                  <strong>
                    Usuario:
                  </strong>
                  {' '}
                  {currentUser?.email}
                </p>
                <p>
                  <strong>
                    Nombre:
                  </strong>
                  {' '}
                  {currentUser?.name}
                </p>
                <p>
                  <strong>
                    Rol:
                  </strong>
                  {' '}
                  {currentUser?.role || 'Usuario'}
                </p>
                <p>
                  <strong>
                    Token:
                  </strong>
                  {' '}
                  {
                    localStorage.getItem(
                      'sporty_token'
                    )
                      ? 'Activo'
                      : 'No encontrado'
                  }
                </p>
              </div>
            </div>
          </>
        )
      // ========================================
      // MÓDULO USUARIOS
      // ========================================
      case 'users':
        return (
          <UsersView />
        )
      // ========================================
      // FUTUROS MÓDULOS SPORTY
      // ========================================
      case 'categories':
        return (
          <h2>
            Módulo Categorías
          </h2>
        )
      case 'schedules':
        return (
          <h2>
            Módulo Horarios
          </h2>
        )
      case 'tournaments':
        return (
          <h2>
            Módulo Torneos
          </h2>
        )
      case 'products':
        return (
          <h2>
            Módulo Productos
          </h2>
        )
      default:
        return null
    }
  }

  // ============================================
  // RENDER PRINCIPAL
  // ============================================

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
          onClose={() =>
            setLogoutMessage('')
          }
        />
      )}
      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  )
}
export default DashboardView