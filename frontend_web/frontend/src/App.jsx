// src/App.jsx
// ====================================================
// COMPONENTE PRINCIPAL
// ====================================================
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
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Routes>
                {/* ============================================
                RUTA PÚBLICA - CATÁLOGO (Página de inicio)
                ============================================ */}
                <Route path="/" element={<Navigate to="/catalogo" />} />
                <Route path="/catalogo" element={<CatalogoView />} />

                {/* ============================================
                RUTAS DE AUTENTICACIÓN
                ============================================ */}
                <Route path="/login" element={<LoginView />} />
                <Route path="/register" element={<RegisterView />} />

                {/* ============================================
                RUTA PROTEGIDA - DASHBOARD
                ============================================ */}
                <Route
                    path="/dashboard/*"
                    element={
                        <ProtectedRoute>
                            <DashboardView />
                        </ProtectedRoute>
                    }
                />

                {/* ============================================
                RUTA 404 - NO ENCONTRADA
                ============================================ */}
                <Route path="*" element={<Navigate to="/catalogo" />} />
            </Routes>
            <Footer />
        </div>
    )
}

export default App