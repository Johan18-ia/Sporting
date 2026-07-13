// src/views/AdminDashboardView.jsx
import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

const AdminDashboardView = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const dashboardContainerStyles = {
        display: 'flex',
        minHeight: '100vh',
        fontFamily: '"Segoe UI", Roboto, sans-serif',
        background: '#f4f6f9'
    };

    const sidebarStyles = {
        width: '260px',
        background: '#8B0000', 
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
        position: 'fixed',
        height: '100vh',
        top: 0,
        left: 0
    };

    const sidebarHeaderStyles = {
        padding: '24px 20px',
        fontSize: '20px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        letterSpacing: '0.5px'
    };

    const menuContainerStyles = {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        padding: '20px 10px',
        flexGrow: 1
    };

    const getLinkStyles = (path) => {
        const isActive = location.pathname.includes(path);
        return {
            color: 'white',
            textDecoration: 'none',
            padding: '12px 15px',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'background 0.3s ease',
            background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
            borderLeft: isActive ? '4px solid #fff' : '4px solid transparent'
        };
    };

    const logoutButtonStyles = {
        background: 'rgba(0, 0, 0, 0.2)',
        color: '#ffcdd2',
        border: 'none',
        padding: '14px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '600',
        textAlign: 'center',
        transition: 'background 0.3s ease',
        borderTop: '1px solid rgba(255,255,255,0.1)'
    };

    const mainContentStyles = {
        marginLeft: '260px',
        flexGrow: 1,
        padding: '40px',
        minHeight: '100vh',
        boxSizing: 'border-box'
    };

    return (
        <div style={dashboardContainerStyles}>
            {/* BARRA LATERAL ADMINISTRATIVA (SIDEBAR) */}
            <div style={sidebarStyles}>
                <div style={sidebarHeaderStyles}>
                    ⚽ SPORTING CLUB
                    <div style={{ fontSize: '11px', fontWeight: '300', opacity: 0.7, marginTop: '4px' }}>
                        Panel de Administración
                    </div>
                </div>

                <div style={menuContainerStyles}>
                    <Link to="/dashboard/categorias" style={getLinkStyles('categorias')}>
                        📁 Categorías
                    </Link>
                    <Link to="/dashboard/horarios" style={getLinkStyles('horarios')}>
                        ⏱️ Horarios
                    </Link>
                    <Link to="/dashboard/torneos" style={getLinkStyles('torneos')}>
                        🏆 Torneos
                    </Link>
                    <Link to="/dashboard/productos" style={getLinkStyles('productos')}>
                        👕 Productos
                    </Link>
                    <Link to="/dashboard/catalogo" style={getLinkStyles('catalogo')}>
                        🛒 Ver Catálogo
                    </Link>
                </div>

                <button 
                    onClick={handleLogout} 
                    style={logoutButtonStyles}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.4)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.2)'}
                >
                    🚪 Cerrar Sesión
                </button>
            </div>

            {/* CONTENEDOR DINÁMICO DONDE RENDERIZAN LOS MÓDULOS */}
            <div style={mainContentStyles}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboardView;