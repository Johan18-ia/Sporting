// src/views/layouts/NavIcons.jsx
// ====================================================
// ICONOS DEL SIDEBAR — SVG en linea, sin dependencias externas
// ====================================================
import React from 'react';

const base = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

export const IconDashboard = () => (
    <svg {...base}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
);

export const IconUsers = () => (
    <svg {...base}><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

export const IconTag = () => (
    <svg {...base}><path d="M20.59 13.41 12 22l-9-9V4a1 1 0 0 1 1-1h9l7.59 7.59a2 2 0 0 1 0 2.82Z" /><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" /></svg>
);

export const IconClock = () => (
    <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
);

export const IconGraduate = () => (
    <svg {...base}><path d="M2 9.5 12 5l10 4.5-10 4.5-10-4.5Z" /><path d="M6 11.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" /></svg>
);

export const IconShield = () => (
    <svg {...base}><path d="M12 3 4.5 6v6c0 4.5 3.2 7.7 7.5 9 4.3-1.3 7.5-4.5 7.5-9V6L12 3Z" /></svg>
);

export const IconTrophy = () => (
    <svg {...base}><path d="M8 3h8v4a4 4 0 0 1-8 0V3Z" /><path d="M8 4H4v1a4 4 0 0 0 4 4" /><path d="M16 4h4v1a4 4 0 0 1-4 4" /><path d="M10 14v3M14 14v3" /><path d="M8 21h8" /><path d="M9.5 17h5l.5 4h-6l.5-4Z" /></svg>
);

export const IconBag = () => (
    <svg {...base}><path d="M6 8h12l1 12H5L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);

export const IconGrid = () => (
    <svg {...base}><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></svg>
);

export const IconLogout = () => (
    <svg {...base}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>
);

export const IconMenu = () => (
    <svg {...base}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);

export const IconChevronLeft = () => (
    <svg {...base}><path d="M15 18l-6-6 6-6" /></svg>
);

export const IconCheckCircle = () => (
    <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 5-5" /></svg>
);

export const IconActivity = () => (
    <svg {...base}><path d="M3 12h4l2-7 4 14 2-7h6" /></svg>
);

export const IconLock = () => (
    <svg {...base}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);