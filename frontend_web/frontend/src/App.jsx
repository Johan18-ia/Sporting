// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './config/routes'
import LoginView from './views/auth/LoginView'
import RegisterView from './views/auth/RegisterView'
import DashboardView from './views/dashboard/DashboardView'
import CatalogoView from './views/public/CatalogoView'
import Navbar from './views/common/Navbar'
import Footer from './views/common/Footer'
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/catalogo" />} />
        <Route path="/catalogo" element={<CatalogoView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <DashboardView />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </div>
  )
}

export default App