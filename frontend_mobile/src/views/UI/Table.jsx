// src/views/ui/Table.jsx
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