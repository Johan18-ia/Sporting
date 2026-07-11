// src/views/ui/Card.jsx
// ====================================================
// CARD REUTILIZABLE
// Reemplaza los `<div style={{background:'white', boxShadow...}}>`
// repetidos en Torneos, Productos, Horarios, etc.
// ====================================================
import React from 'react';

const Card = ({ title, className = '', bodyClassName = '', children, ...rest }) => {
    return (
        <div className={`ui-card ${className}`.trim()} {...rest}>
            {title && <h3 className="ui-card-title">{title}</h3>}
            <div className={`ui-card-body ${bodyClassName}`.trim()}>
                {children}
            </div>
        </div>
    );
};

export default Card;