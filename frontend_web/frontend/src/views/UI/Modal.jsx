// src/views/ui/Modal.jsx
// ====================================================
// MODAL REUTILIZABLE
// Reutiliza las clases .modal-overlay / .modal-content / .modal-header
// que ya existian en styles/Users.css (las mismas que usa UserDetails.jsx),
// para que todas las vistas que necesiten un modal usen el mismo patron.
// ====================================================
import React from 'react';

const Modal = ({ title, onClose, footer, children }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="ui-modal-body">
                    {children}
                </div>

                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    );
};

export default Modal;