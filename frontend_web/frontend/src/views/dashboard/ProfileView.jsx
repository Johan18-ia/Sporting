/**
 * ProfileView.jsx:
 * - ¿Qué hace? Muestra y permite editar el perfil del usuario autenticado.
 * - ¿Qué función cumple en el proyecto? Es la vista equivalente a la pantalla de perfil del mobile para mantener la sesión sincronizada en web.
 * - Origen mobile equivalente: frontend_mobile/src/presentation/views/profile/ProfileScreen.tsx
 */
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useUsers from '../../hooks/useUsers';
import { getFieldError } from '../../utils/validators';
import PageHeader from '../ui/PageHeader';
import Card from '../ui/Card';
import AlertMessage from '../common/AlertMessage';

const ProfileView = () => {
  const { currentUser, updateUserSession } = useAuth();
  const { patchUser } = useUsers();
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        lastname: currentUser.lastname || '',
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      });
    }
  }, [currentUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (message) setMessage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentUser?.id) {
      setMessage({ type: 'error', text: 'No hay sesión activa.' });
      return;
    }

    const validationErrors = [
      getFieldError('name', formData.name),
      getFieldError('name', formData.lastname),
      getFieldError('email', formData.email),
      getFieldError('phone', formData.phone)
    ].filter(Boolean);

    if (validationErrors.length) {
      setMessage({ type: 'error', text: validationErrors[0] });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        name: formData.name.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      };

      const result = await patchUser(currentUser.id, payload);
      const nextUser = { ...currentUser, ...payload };
      updateUserSession(nextUser);
      setMessage({ type: 'success', text: result?.success ? 'Perfil actualizado correctamente.' : 'Perfil actualizado.' });
    } catch (error) {
      setMessage({ type: 'error', text: error?.error || 'No se pudo actualizar el perfil.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Mi Perfil"
        description="Actualiza tus datos personales y mantén la sesión sincronizada."
      />

      {message && (
        <AlertMessage
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="ui-account-row">
            <span className="label">Rol</span>
            <span className={`badge-sporting ${currentUser?.role === 'admin' ? 'badge-sporting-admin' : currentUser?.role === 'seller' ? 'badge-sporting-seller' : 'badge-sporting-user'}`}>
              {currentUser?.role === 'seller' ? 'Moderador' : currentUser?.role || 'Usuario'}
            </span>
          </div>

          <div className="ui-field">
            <label htmlFor="name">Nombre</label>
            <input id="name" name="name" value={formData.name} onChange={handleChange} className="sporting-input" />
          </div>

          <div className="ui-field">
            <label htmlFor="lastname">Apellido</label>
            <input id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} className="sporting-input" />
          </div>

          <div className="ui-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="sporting-input" />
          </div>

          <div className="ui-field">
            <label htmlFor="phone">Teléfono</label>
            <input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="sporting-input" />
          </div>

          <div className="ui-account-row">
            <span className="label">Categoría / Año</span>
            <span className="value">{currentUser?.category_id || 'Sin asignar'}</span>
          </div>

          <button type="submit" className="btn-sporting-primary" disabled={saving} style={{ marginTop: 16, width: '100%' }}>
            {saving ? 'Guardando...' : 'Guardar perfil'}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default ProfileView;
