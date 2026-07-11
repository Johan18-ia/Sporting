// src/views/layouts/Sidebar.jsx
// ====================================================
// SIDEBAR — navegacion unica del panel administrativo
import logo from '../../assets/logo.png';
import React from 'react';
import {
    IconDashboard, IconUsers, IconTag, IconClock, IconGraduate,
    IconShield, IconTrophy, IconBag, IconGrid, IconLogout, IconChevronLeft
} from './NavIcons';

// Items del menu. "comingSoon" se usa para Equipos mientras se decide
// su implementacion (ver auditoria Fase 1 / Paso 5) — no rompe nada,
// solo se muestra visualmente deshabilitado.
const ADMIN_NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
    { id: 'users', label: 'Usuarios', icon: IconUsers },
    { id: 'categories', label: 'Categorías', icon: IconTag },
    { id: 'schedules', label: 'Horarios', icon: IconClock },
    { id: 'students', label: 'Estudiantes', icon: IconGraduate },
    { id: 'teams', label: 'Equipos', icon: IconShield, comingSoon: true },
    { id: 'tournaments', label: 'Torneos', icon: IconTrophy },
    { id: 'products', label: 'Productos', icon: IconBag },
    { id: 'catalog', label: 'Catálogo', icon: IconGrid },
];

// Menu reducido para el rol "user" (estudiante): su panel es una sola
// pantalla (StudentDashboardView ya muestra perfil + horarios + torneos),
// asi que no tiene sentido ofrecer secciones de administracion.
const STUDENT_NAV_ITEMS = [
    { id: 'dashboard', label: 'Mi Panel', icon: IconDashboard },
];

const Sidebar = ({ activeTab, onTabChange, collapsed, onToggleCollapse, mobileOpen, onCloseMobile, onLogout, role }) => {
    const items = role === 'user' ? STUDENT_NAV_ITEMS : ADMIN_NAV_ITEMS;

    const handleSelect = (item) => {
        if (item.comingSoon) return;
        onTabChange(item.id);
        onCloseMobile();
    };

    return (
        <>
            {mobileOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}

            <aside className={`app-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}>
<div className="app-sidebar-brand">
    <img
        src={logo}
        alt="Sporting Club"
        className="sidebar-logo"
    />
</div>

                <nav className="app-sidebar-nav">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                className={`sidebar-nav-item ${isActive ? 'is-active' : ''} ${item.comingSoon ? 'is-disabled' : ''}`}
                                onClick={() => handleSelect(item)}
                                title={item.comingSoon ? `${item.label} (próximamente)` : item.label}
                                disabled={item.comingSoon}
                            >
                                <span className="sidebar-nav-icon"><Icon /></span>
                                {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
                                {!collapsed && item.comingSoon && <span className="sidebar-nav-soon">pronto</span>}
                            </button>
                        );
                    })}
                </nav>

                <div className="app-sidebar-footer">
                    <button type="button" className="sidebar-nav-item sidebar-logout" onClick={onLogout} title="Cerrar sesión">
                        <span className="sidebar-nav-icon"><IconLogout /></span>
                        {!collapsed && <span className="sidebar-nav-label">Cerrar sesión</span>}
                    </button>

                    <button type="button" className="sidebar-collapse-btn" onClick={onToggleCollapse} title={collapsed ? 'Expandir' : 'Colapsar'}>
                        <span className={collapsed ? 'rotate-180' : ''}><IconChevronLeft /></span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;