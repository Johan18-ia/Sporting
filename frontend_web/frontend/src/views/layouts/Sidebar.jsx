// src/views/layouts/Sidebar.jsx
import React from 'react';
import {
    IconDashboard, IconUsers, IconTag, IconClock, IconGraduate,
    IconShield, IconTrophy, IconBag, IconLogout, IconChevronLeft
} from './NavIcons';
import logoSporting from '../../assets/logo.png'

const ADMIN_NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
    { id: 'users', label: 'Usuarios', icon: IconUsers },
    { id: 'categories', label: 'Categorías', icon: IconTag },
    { id: 'schedules', label: 'Horarios', icon: IconClock },
    { id: 'students', label: 'Estudiantes', icon: IconGraduate },
    { id: 'teams', label: 'Equipos', icon: IconShield },
    { id: 'tournaments', label: 'Torneos', icon: IconTrophy },
    { id: 'products', label: 'Productos', icon: IconBag },
];

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
                    {!collapsed && (
                        <img
                            src={logoSporting}
                            alt="Sporting Club"
                            className="navbar-logo-img"
                            onError={(e) => {
                                e.target.style.display = 'none'
                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'inline'
                            }}
                        />
                    )}
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
            </aside>
        </>
    );
};

export default Sidebar;