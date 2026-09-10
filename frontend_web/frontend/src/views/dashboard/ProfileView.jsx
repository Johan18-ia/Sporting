import React from 'react';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../ui/PageHeader';
import Card from '../ui/Card';

const ProfileView = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <PageHeader
        title="Mi Perfil"
        description="Resumen de tu información personal y de acceso."
      />

      <Card>
        <div className="ui-account-row">
          <span className="label">Nombre</span>
          <span className="value">{currentUser?.name || 'Sin nombre'} {currentUser?.lastname || ''}</span>
        </div>
        <div className="ui-account-row">
          <span className="label">Email</span>
          <span className="value">{currentUser?.email || 'Sin email'}</span>
        </div>
        <div className="ui-account-row">
          <span className="label">Teléfono</span>
          <span className="value">{currentUser?.phone || 'No registrado'}</span>
        </div>
        <div className="ui-account-row">
          <span className="label">Rol</span>
          <span className={`badge-sporting ${currentUser?.role === 'admin' ? 'badge-sporting-admin' : currentUser?.role === 'seller' ? 'badge-sporting-seller' : 'badge-sporting-user'}`}>
            {currentUser?.role || 'Usuario'}
          </span>
        </div>
        <div className="ui-account-row">
          <span className="label">Categoría / Año</span>
          <span className="value">{currentUser?.category_id || 'Sin asignar'}</span>
        </div>
      </Card>
    </div>
  );
};

export default ProfileView;
