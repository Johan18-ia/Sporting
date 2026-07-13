// src/views/layouts/MainLayout.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import '../../styles/sporting-theme.css';
import '../../styles/Layout.css';
import '../../styles/UI.css';

const MainLayout = ({ activeTab, onTabChange, user, onLogout, children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
            <Sidebar
                activeTab={activeTab}
                onTabChange={onTabChange}
                collapsed={collapsed}
                onToggleCollapse={() => setCollapsed((v) => !v)}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
                onLogout={onLogout}
                role={user?.role}
            />

            <div className="app-main">
                <Topbar
                    user={user}
                    onLogout={onLogout}
                    onOpenMobileSidebar={() => setMobileOpen(true)}
                />
                <main className="app-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;