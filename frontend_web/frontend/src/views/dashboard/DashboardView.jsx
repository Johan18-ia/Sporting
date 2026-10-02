// src/views/dashboard/DashboardView.jsx
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import StudentModel from '../../models/StudentModel'
import TournamentModel from '../../models/TournamentModel'
import ProductModel from '../../models/ProductModel'
import CategoryModel from '../../models/CategoryModel'
import ScheduleModel from '../../models/ScheduleModel'
import TeamModel from '../../models/TeamModel'
import MainLayout from '../layouts/MainLayout'
import PageHeader from '../ui/PageHeader'
import Card from '../ui/Card'
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
import '../../styles/DashboardChart.css'
import '../../styles/Users.css'

const METRIC_META = [
  { key: 'students', label: 'Estudiantes', color: '#8B0000', icon: IconGraduate },
  { key: 'categories', label: 'Categorías', color: '#A52A2A', icon: IconTag },
  { key: 'schedules', label: 'Horarios', color: '#B22222', icon: IconClock },
  { key: 'tournaments', label: 'Torneos', color: '#C41E3A', icon: IconTrophy },
  { key: 'activeTournaments', label: 'Torneos activos', color: '#8B4513', icon: IconCheckCircle },
  { key: 'products', label: 'Productos', color: '#A0522D', icon: IconBag },
  { key: 'teams', label: 'Equipos', color: '#6B2D2D', icon: IconShield },
]

const DashboardView = () => {
  const { currentUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [logoutMessage, setLogoutMessage] = useState('')
  const navigate = useNavigate()

  const [overview, setOverview] = useState({
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
      const [studentsRes, tournamentsRes, productsRes, categoriesRes, schedulesRes, teamsRes] =
        await Promise.all([
          StudentModel.getAllStudents(),
          TournamentModel.getAllTournaments(),
          ProductModel.getAllProducts(),
          CategoryModel.getAllCategories(),
          ScheduleModel.getAllSchedules(),
          TeamModel.getAllTeams()
        ])

      const tournaments = tournamentsRes.success ? tournamentsRes.data : []

      setOverview({
        students: studentsRes.success ? studentsRes.data.length : 0,
        tournaments: tournaments.length,
        activeTournaments: tournaments.filter(
          (t) => (t.status || 'Activo') === 'Activo'
        ).length,
        products: productsRes.success ? productsRes.data.length : 0,
        categories: categoriesRes.success ? categoriesRes.data.length : 0,
        schedules: schedulesRes.success ? schedulesRes.data.length : 0,
        teams: teamsRes.success ? teamsRes.data.length : 0
      })
      setOverviewLoading(false)
    }

    loadOverview()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setLogoutMessage('Sesión cerrada exitosamente')
      setTimeout(() => navigate('/login'), 1500)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const totalRecords = useMemo(
    () =>
      overview.students +
      overview.categories +
      overview.schedules +
      overview.tournaments +
      overview.products +
      overview.teams,
    [overview]
  )

  const maxMetric = useMemo(() => {
    const vals = METRIC_META.map((m) => overview[m.key] || 0)
    return Math.max(...vals, 1)
  }, [overview])

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

  // Solo se usa cuando activeTab === 'dashboard'
  const renderDashboardHome = () => (
    <>
      <PageHeader
        title={`Bienvenido, ${
          currentUser?.name || currentUser?.email?.split('@')[0] || 'Usuario'
        }`}
        description="Panel de administración de Sporting Club"
      />

      <div className="dash-chart-panel">
        <div className="dash-chart-header">
          <div>
            <h3 className="dash-chart-title">Resumen del sistema</h3>
            <p className="dash-chart-sub">
              Distribución de registros en la escuela de microfútbol
            </p>
          </div>
          <div className="dash-chart-total">
            <span className="dash-chart-total-value">
              {overviewLoading ? '—' : totalRecords}
            </span>
            <span className="dash-chart-total-label">registros totales</span>
          </div>
        </div>

        <div className="dash-bars">
          {METRIC_META.map((m) => {
            const value = overview[m.key] || 0
            const pct = overviewLoading ? 0 : Math.round((value / maxMetric) * 100)
            const share =
              !overviewLoading && totalRecords > 0
                ? Math.round((value / totalRecords) * 100)
                : 0
            return (
              <div key={m.key} className="dash-bar-row">
                <div className="dash-bar-label">
                  <span className="dash-bar-dot" style={{ background: m.color }} />
                  {m.label}
                </div>
                <div className="dash-bar-track">
                  <div
                    className="dash-bar-fill"
                    style={{ width: `${pct}%`, background: m.color }}
                  />
                </div>
                <div className="dash-bar-value">
                  <strong>{overviewLoading ? '—' : value}</strong>
                  <span className="dash-bar-share">{share}%</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="dash-dist-track">
          {METRIC_META.map((m) => {
            const value = overview[m.key] || 0
            if (!totalRecords || value === 0) return null
            const widthPct = (value / totalRecords) * 100
            return (
              <div
                key={m.key}
                className="dash-dist-seg"
                style={{ width: `${widthPct}%`, background: m.color }}
                title={`${m.label}: ${value}`}
              />
            )
          })}
        </div>
      </div>

      <div className="dash-bottom-grid">
        <Card title="Resumen operativo">
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardHome()
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
      <div key={activeTab}>{renderContent()}</div>
    </MainLayout>
  )
}

export default DashboardView