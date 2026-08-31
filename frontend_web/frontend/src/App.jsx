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

// ============================================
// COMPONENTE: RUTA PROTEGIDA
// ============================================
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

// ============================================
// COMPONENTE: APP
// ============================================
function App() {
    const { user, isAuthenticated } = useAuth()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to={ROUTES.CATALOGO} replace />} />
                <Route path={ROUTES.CATALOGO} element={<CatalogoView />} />
                <Route path={ROUTES.LOGIN} element={<LoginView />} />
                <Route path={ROUTES.REGISTER} element={<RegisterView />} />

                <Route
                    path={`${ROUTES.DASHBOARD}/*`}
                    element={
                        <ProtectedRoute>
                            <DashboardView />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to={isAuthenticated && user ? ROUTES.DASHBOARD : ROUTES.CATALOGO} replace />} />
            </Routes>
            <Footer />
        </div>
    )
}

export default App