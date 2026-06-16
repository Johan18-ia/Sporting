import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './config/routes'

import LoginView from './views/auth/LoginView'
import RegisterView from './views/auth/RegisterView'

import DashboardView from './views/dashboard/DashboardView'
import UsersView from './views/dashboard/UsersView'

import Navbar from './views/common/Navbar'
import LoadingSpinner from './views/common/LoadingSpinner'

import useAuth from './hooks/useAuth'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return children
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Navigate to={ROUTES.LOGIN} replace />}
        />

        <Route
          path={ROUTES.LOGIN}
          element={<LoginView />}
        />

        <Route
          path={ROUTES.REGISTER}
          element={<RegisterView />}
        />

        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardView />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.USERS}
          element={
            <ProtectedRoute>
              <UsersView />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  )
}

export default App