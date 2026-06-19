import { useEffect, useState } from 'react'
import useUsers from '../../hooks/useUsers'

const UserForm = ({ user, isEdit, onSuccess, onClose }) => {
  const { createUser, updateUser } = useUsers()

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    role: 'user',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit && user) {
      // Use a ref or setTimeout to avoid state updates inside render
      const timer = setTimeout(() => {
        setFormData({
          name: user.name || '',
          lastname: user.lastname || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'user',
          password: ''
        })
        setError('')
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isEdit, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.lastname || !formData.email) {
      setError('Nombre, apellido y correo son obligatorios')
      return
    }

    if (!isEdit && !formData.password) {
      setError('La contraseña es obligatoria para crear un usuario')
      return
    }

    try {
      setLoading(true)
      setError('')

      const payload = {
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        role: formData.role
      }

      if (formData.password) {
        payload.password = formData.password
      }

      if (isEdit && user) {
        await updateUser(user.id, payload)
      } else {
        await createUser(payload)
      }

      onSuccess()
    } catch (err) {
      setError(err?.error || err?.message || 'No se pudo guardar el usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Editar usuario' : 'Crear usuario'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          {error && <p className="error-message">{error}</p>}

          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastname"
              placeholder="Apellido"
              value={formData.lastname}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleChange}
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
            <input
              type="password"
              name="password"
              placeholder={isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm