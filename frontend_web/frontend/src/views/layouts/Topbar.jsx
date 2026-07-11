// src/views/layouts/Topbar.jsx
import React from 'react';
import { IconMenu, IconLogout } from './NavIcons';

const ROLE_LABELS = {
    admin: 'Administrador',
    seller: 'Vendedor',
    user: 'Estudiante',
};

const getInitials = (user) => {
    const name = user?.name || user?.email?.split('@')[0] || '?';
    return name.slice(0, 2).toUpperCase();
};

const Topbar = ({ user, onLogout, onOpenMobileSidebar }) => {
    return (
        <header className="app-topbar">
            <button type="button" className="topbar-menu-btn" onClick={onOpenMobileSidebar} aria-label="Abrir menú">
                <IconMenu />
            </button>

            <div className="topbar-spacer" />

            <div className="topbar-user">
                <div className="topbar-user-info">
                    <span className="topbar-user-name">{user?.name || user?.email?.split('@')[0] || 'Usuario'}</span>
                    <span className="topbar-user-role">{ROLE_LABELS[user?.role] || user?.role || ''}</span>
                </div>
                <div className="topbar-avatar">{getInitials(user)}</div>
                <button type="button" className="topbar-logout-btn" onClick={onLogout} title="Cerrar sesión">
                    <IconLogout />
                </button>
            </div>
        </header>
    );
};

export default Topbar;