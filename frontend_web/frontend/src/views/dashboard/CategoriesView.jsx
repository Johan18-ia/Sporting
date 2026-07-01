// frontend_web/frontend/src/views/dashboard/DashboardView.jsx
// ====================================================
// VISTA: DASHBOARD PRINCIPAL (RUTEO POR ROL)
// ====================================================
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import UsersView from './UsersView';
import CategoriesView from './CategoriesView';
import SchedulesView from './SchedulesView'; // Asegúrate de que este componente existe
import TournamentsView from './TournamentsView'; // Asegúrate de que este componente existe
import ProductsView from './ProductsView'; // Asegúrate de que este componente existe
import StudentDashboardView from './StudentDashboardView';
// Importa las vistas para administradores y vendedores si son diferentes
import AdminDashboardView from './AdminDashboardView';
import '../../styles/Dashboard.css';

const DashboardView = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    // Si no hay usuario autenticado, redirigir al login
    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    // Determinar que vista renderizar según el rol
    const renderDashboardHome = () => {
        if (currentUser.role === 'user') {
            return <StudentDashboardView />;
        }
        // Para admin y seller, usar un dashboard de administración
        return <AdminDashboardView />;
    };

    // ============================================
    // SIDEBAR DINAMICO SEGUN ROL
    // ============================================
    const renderSidebar = () => {
        // Para estudiantes, sidebar reducido
        if (currentUser.role === 'user') {
            return (
                <div className="sporting-sidebar">
                    <div className="sidebar-menu">
                        <div className="sidebar-separator">NAVEGACION</div>
                        <button
                            className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('dashboard'); navigate('/dashboard'); }}
                        >
                            Mi Panel
                        </button>
                        <button
                            className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('profile'); navigate('/dashboard/profile'); }}
                        >
                            Mi Perfil
                        </button>
                    </div>
                </div>
            );
        }

        // Sidebar completo para admin y seller
        return (
            <div className="sporting-sidebar">
                <div className="sidebar-menu">
                    <div className="sidebar-separator">GESTION</div>
                    <button
                        className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('dashboard'); navigate('/dashboard'); }}
                    >
                        Inicio
                    </button>
                    <button
                        className={`sidebar-link ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('users'); navigate('/dashboard/users'); }}
                    >
                        Usuarios
                    </button>
                    <button
                        className={`sidebar-link ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('categories'); navigate('/dashboard/categories'); }}
                    >
                        Categorias
                    </button>
                    <button
                        className={`sidebar-link ${activeTab === 'schedules' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('schedules'); navigate('/dashboard/schedules'); }}
                    >
                        Horarios
                    </button>
                    <button
                        className={`sidebar-link ${activeTab === 'tournaments' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('tournaments'); navigate('/dashboard/tournaments'); }}
                    >
                        Torneos
                    </button>
                    <button
                        className={`sidebar-link ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('products'); navigate('/dashboard/products'); }}
                    >
                        Productos
                    </button>
                </div>
            </div>
        );
    };

    // ============================================
    // RENDERIZADO PRINCIPAL
    // ============================================
    return (
        <div className="sporting-layout-master">
            {/* TOP NAVBAR */}
            <header className="sporting-top-navbar">
                <div className="navbar-logo-area">
                    <span className="logo-placeholder">
                        <span className="logo-text">SPORTING</span>
                        <span className="logo-subtext">Club</span>
                    </span>
                </div>
                <div className="navbar-user-area">
                    <span className="user-email-display">
                        {currentUser.email}
                    </span>
                    <button
                        className="btn-logout-sporting"
                        onClick={() => {
                            // Lógica de logout
                            localStorage.removeItem('auth_token');
                            localStorage.removeItem('user_data');
                            window.location.href = '/login';
                        }}
                    >
                        Salir
                    </button>
                </div>
            </header>

            {/* BODY CON SIDEBAR Y CONTENIDO */}
            <div className="sporting-body-container">
                {renderSidebar()}

                <div className="sporting-content-workspace">
                    <Routes>
                        {/* Ruta raíz del dashboard */}
                        <Route path="/" element={renderDashboardHome()} />

                        {/* Rutas para administración */}
                        <Route path="/users" element={<UsersView />} />
                        <Route path="/categories" element={<CategoriesView />} />
                        <Route path="/schedules" element={<SchedulesView />} />
                        <Route path="/tournaments" element={<TournamentsView />} />
                        <Route path="/products" element={<ProductsView />} />

                        {/* Ruta para el perfil del estudiante (puedes crearla después) */}
                        <Route path="/profile" element={<div>Perfil del Estudiante</div>} />

                        {/* Redirigir rutas no encontradas */}
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;