// frontend_web/frontend/src/views/common/Navbar.jsx
// ====================================================
// COMPONENTE: NAVBAR (VERSION ACTUALIZADA PARA ROLES)
// ====================================================
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import '../../styles/Navbar.css'
// Coloca tu archivo en: src/assets/logo.png
import logoSporting from '../../assets/logo.png'

const Navbar = () => {
    const { isAuthenticated, logout, currentUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        await logout()
        navigate('/catalogo')
    }

    // ============================================
    // OCULTAR NAVBAR EN PÁGINAS DE AUTENTICACIÓN Y DASHBOARD
    // ============================================
    const isAuthPage = ['/login', '/register'].includes(location.pathname)
    const isDashboard = location.pathname.includes('/dashboard')

    if (isAuthPage || isDashboard) {
        return null
    }

    // ============================================
    // RENDERIZADO DE NAVBAR SEGUN ROL
    // ============================================
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/" className="navbar-logo-link">
                        <img
                            src={logoSporting}
                            alt="Sporting Club"
                            className="navbar-logo-img"
                            onError={(e) => {
                                e.target.style.display = 'none'
                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'inline'
                            }}
                        />
                        <h2 className="navbar-logo-fallback" style={{ display: 'none' }}>Sporting Club</h2>
                    </Link>
                </div>
                <div className="navbar-menu">
                    {isAuthenticated ? (
                        <>
                            {/* Si es admin o seller, mostrar enlaces de gestion */}
                            {currentUser?.role !== 'user' && (
                                <>
                                    <Link to="/dashboard" className="nav-link">
                                        Panel de Control
                                    </Link>
                                    <Link to="/dashboard/users" className="nav-link">
                                        Usuarios
                                    </Link>
                                    <Link to="/dashboard/categories" className="nav-link">
                                        Categorias
                                    </Link>
                                    <Link to="/dashboard/schedules" className="nav-link">
                                        Horarios
                                    </Link>
                                    <Link to="/dashboard/tournaments" className="nav-link">
                                        Torneos
                                    </Link>
                                    <Link to="/dashboard/products" className="nav-link">
                                        Productos
                                    </Link>
                                </>
                            )}

                            {/* Informacion del usuario */}
                            <span className="user-welcome">
                                Hola, {currentUser?.name || 'Usuario'}
                            </span>

                            <button onClick={handleLogout} className="nav-link btn-logout">
                                Cerrar Sesion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link btn-primary">
                                Iniciar Sesion
                            </Link>                          
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar