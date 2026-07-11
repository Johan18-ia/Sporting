// src/views/ui/Button.jsx
// ====================================================
// BOTON REUTILIZABLE
// No inventa estilos nuevos: envuelve las clases que ya
// existian en sporting-theme.css (.btn-sporting-primary,
// .btn-sporting-secondary, .btn-sporting-danger).
// ====================================================
import React from 'react';

const VARIANT_CLASS = {
    primary: 'btn-sporting-primary',
    secondary: 'btn-sporting-secondary',
    danger: 'btn-sporting-danger',
};

const Button = ({ variant = 'primary', fullWidth, className = '', children, ...rest }) => {
    const variantClass = VARIANT_CLASS[variant] || VARIANT_CLASS.primary;
    return (
        <button
            className={`${variantClass} ${fullWidth ? 'ui-btn-full' : ''} ${className}`.trim()}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;