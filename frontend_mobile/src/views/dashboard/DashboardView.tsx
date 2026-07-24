// src/views/dashboard/DashboardView.jsx
import { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import StudentModel from '../../models/StudentModel'
import TournamentModel from '../../models/TournamentModel'
import ProductModel from '../../models/ProductModel'
import CategoryModel from '../../models/CategoryModel'
import ScheduleModel from '../../models/ScheduleModel'
import TeamModel from '../../models/TeamModel'
import MainLayout from '../layouts/MainLayout'
import DashboardStats from './DashboardStats'
import PageHeader from '../UI/PageHeader'
import Card from '../UI/Card'
import {
  IconGraduate, IconTrophy, IconCheckCircle, IconBag,
  IconShield, IconTag, IconClock
} from '../layouts/NavIcons'
import UsersView from './UsersView'
import CategoriesView from './CategoriesView'
import AlertMessage from '../common/AlertMessage'
import SchedulesView from './SchedulesView'
import ProductsView from './ProductsView'
import StudentsView from './StudentsView'
import TournamentsView from './TournamentsView'
import TeamsView from './TeamsView'
import ReportsView from './ReportsView'
import StudentDashboardView from './StudentDashboardView'
import '../../styles/Dashboard.css'
import '../../styles/Users.css'

interface DashboardOverview {
  students: number
  tournaments: number
  activeTournaments: number
  products: number
  categories: number
  schedules: number
  teams: number
}

const DashboardView = () => {
  const { currentUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [logoutMessage, setLogoutMessage] = useState('')

  // ============================================
  // METRICAS REALES DEL PANEL
  // Reutiliza los mismos modelos que ya usan StudentsView,
  // TournamentsView y ProductsView/CatalogoView — no se
  // inventa ninguna llamada nueva a la API.
  // ============================================
  const [overview, setOverview] = useState<DashboardOverview>({
    students: 0,
    tournaments: 0,
    activeTournaments: 0,
    products: 0,
    categories: 0,
    schedules: 0,
    teams: 0
  })
  const [overviewLoading, setOverviewLoading] = useState(true)

  useEffect(() => {
    const loadOverview = async () => {
      setOverviewLoading(true)
      const [studentsRes, tournamentsRes, productsRes, categoriesRes, schedulesRes, teamsRes] = await Promise.all([
        StudentModel.getAllStudents(),
        TournamentModel.getAllTournaments(),
        ProductModel.getAllProducts(),
        CategoryModel.getAllCategories(),
        ScheduleModel.getAllSchedules(),
        TeamModel.getAllTeams()
      ])

      const tournaments = tournamentsRes.success && Array.isArray(tournamentsRes.data) ? tournamentsRes.data : []

      setOverview({
        students: studentsRes.success && Array.isArray(studentsRes.data) ? studentsRes.data.length : 0,
        tournaments: tournaments.length,
        activeTournaments: tournaments.filter((t: any) => (t.status || 'Activo') === 'Activo').length,
        products: productsRes.success && Array.isArray(productsRes.data) ? productsRes.data.length : 0,
        categories: categoriesRes.success && Array.isArray(categoriesRes.data) ? categoriesRes.data.length : 0,
        schedules: schedulesRes.success && Array.isArray(schedulesRes.data) ? schedulesRes.data.length : 0,
        teams: teamsRes.success && Array.isArray(teamsRes.data) ? teamsRes.data.length : 0
      })
      setOverviewLoading(false)
    }

    loadOverview()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setLogoutMessage('Sesión cerrada exitosamente')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  // ============================================
  // ROL "user" (estudiante): mismas secciones separadas
  // que el admin, con su propio activeTab.
  // ============================================
  if (currentUser?.role === 'user') {
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
        <StudentDashboardView activeTab={activeTab} />
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
            <PageHeader
              title={`Bienvenido, ${currentUser?.name || currentUser?.email?.split('@')[0] || 'Usuario'}`}
              description="Panel de administración de Sporting Club"
            />

            <DashboardStats
              loading={overviewLoading}
              items={[
                { label: 'Estudiantes', value: overview.students, icon: IconGraduate },
                { label: 'Categorías', value: overview.categories, icon: IconTag },
                { label: 'Horarios', value: overview.schedules, icon: IconClock },
                { label: 'Torneos', value: overview.tournaments, icon: IconTrophy },
                { label: 'Torneos Activos', value: overview.activeTournaments, icon: IconCheckCircle },
                { label: 'Productos', value: overview.products, icon: IconBag },
                { label: 'Equipos', value: overview.teams, icon: IconShield }
              ]}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <Card title="Resumen del Sistema">
                <p style={{ color: 'var(--sporting-text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                  Gestión completa de la escuela de microfútbol
                </p>
                <ul className="ui-summary-list">
                  <li><span className="dot" />Gestión de Usuarios</li>
                  <li><span className="dot" />Categorías por año</li>
                  <li><span className="dot" />Horarios de entrenamiento</li>
                  <li><span className="dot" />Gestión de Estudiantes</li>
                  <li><span className="dot" />Torneos y Equipos</li>
                  <li><span className="dot" />Catálogo de Productos</li>
                </ul>
              </Card>

              <Card title="Cuenta">
                <div className="ui-account-row">
                  <span className="label">Sesión</span>
                  <span className="value">
                    <span className={`status-dot ${localStorage.getItem('auth_token') ? '' : 'off'}`}>
                      {localStorage.getItem('auth_token') ? 'Activa' : 'No encontrada'}
                    </span>
                  </span>
                </div>
                <div className="ui-account-row">
                  <span className="label">Usuario</span>
                  <span className="value">{currentUser?.email}</span>
                </div>
                <div className="ui-account-row">
                  <span className="label">Rol</span>
                  <span className="badge-sporting badge-sporting-admin">{currentUser?.role}</span>
                </div>
              </Card>
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
      case 'teams':
        return <TeamsView />
      case 'reports':
        return <ReportsView />
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