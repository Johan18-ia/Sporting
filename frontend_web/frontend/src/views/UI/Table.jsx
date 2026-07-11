// src/views/ui/Table.jsx
// ====================================================
// TABLE REUTILIZABLE
// No cambia la estructura (sigue siendo table/thead/tbody/tr/td
// normal de React), solo centraliza el estilo para no repetir
// thStyles/tdStyles en cada vista.
// ====================================================
import React from 'react';

const Table = ({ children, className = '', ...rest }) => {
    return (
        <div className="ui-table-wrapper">
            <table className={`ui-table ${className}`.trim()} {...rest}>
                {children}
            </table>
        </div>
    );
};

export default Table;