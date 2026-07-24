// src/views/ui/PageHeader.jsx
import React from 'react';

const PageHeader = ({ title, description, actions }) => {
    return (
        <div className="ui-page-header">
            <div>
                <h2 className="ui-page-title">{title}</h2>
                {description && <p className="ui-page-description">{description}</p>}
            </div>
            {actions && <div className="ui-page-actions">{actions}</div>}
        </div>
    );
};

export default PageHeader;