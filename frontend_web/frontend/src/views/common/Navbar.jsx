// src/views/common/Navbar.jsx
// ====================================================
// COMPONENTE: NAVBAR
// ====================================================
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import '../../styles/Navbar.css'

const Navbar = () => {
    const { isAuthenticated, logout, currentUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        await logout()
        navigate('/catalogo')
    }

    // No mostrar navbar en dashboard (ya tiene su propio header)
    if (location.pathname.includes('/dashboard')) {
        return null
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* ============================================
                LOGO
                ============================================ */}
                <div className="navbar-logo">
                    <Link to="/catalogo">
                        <h2>⚽ Sporting Club</h2>
                    </Link>
                </div>

                {/* ============================================
                MENÚ
                ============================================ */}
                <div className="navbar-menu">
                    <Link to="/catalogo" className="nav-link">
                         Catálogo
                    </Link>

                    {!isAuthenticated ? (
                        // ============================================
                        // USUARIO NO AUTENTICADO
                        // ============================================
                        <>
                            <Link to="/login" className="nav-link">
                                Iniciar Sesión
                            </Link>
                            <Link to="/register" className="nav-link btn-primary">
                                Registrarse
                            </Link>
                        </>
                    ) : (
                        // ============================================
                        // USUARIO AUTENTICADO
                        // ============================================
                        <>
                            <span className="user-welcome">
                                👋 Hola, {currentUser?.name || currentUser?.email}
                            </span>
                            <Link to="/dashboard" className="nav-link">
                                 Dashboard
                            </Link>
                            <button onClick={handleLogout} className="nav-link btn-logout">
                                 Cerrar Sesión
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar