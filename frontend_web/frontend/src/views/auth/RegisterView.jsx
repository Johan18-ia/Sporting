// src/views/auth/RegisterView.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import AlertMessage from '../common/AlertMessage'
import '../../styles/Register.css'

const RegisterView = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { register } = useAuth()
  const navigate = useNavigate()

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

    if (!formData.name || !formData.lastname || !formData.email || !formData.password) {
      setError('Por favor complete todos los campos obligatorios')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 5) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingrese un email válido')
      return
    }

    setLoading(true)

    try {
      await register({
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role
      })

      setSuccess('Usuario registrado exitosamente. Redirigiendo al login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.error || 'Error al registrar usuario. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card sporting-register-card">
        {/* Logo sin imagen - solo texto y emoji */}
        <div className="register-logo-text">
          ⚽ <span className="sporting-club-name" style={{ color: '#8B0000' }}>Sporting Club</span>
        </div>

        <div className="register-header sporting-header">
          <h1>Únete a Sporting</h1>
          <p>Crea tu cuenta para acceder al sistema</p>
        </div>

        {error && (
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        {success && (
          <AlertMessage
            type="success"
            message={success}
            onClose={() => setSuccess('')}
          />
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ingrese su nombre"
                disabled={loading}
                required
                className="sporting-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastname">Apellido *</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Ingrese su apellido"
                disabled={loading}
                required
                className="sporting-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="usuario@ejemplo.com"
              disabled={loading}
              required
              className="sporting-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Opcional"
              disabled={loading}
              className="sporting-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Contraseña *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
                required
                className="sporting-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repita su contraseña"
                disabled={loading}
                required
                className="sporting-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="form-control sporting-select"
            >
              <option value="user">👤 Usuario</option>
              <option value="customer">👤 Cliente</option>
              <option value="seller">🛒 Vendedor</option>
              <option value="admin">👑 Administrador</option>
            </select>
            <small className="form-hint sporting-hint">El rol por defecto es "usuario"</small>
          </div>

          <button
            type="submit"
            className="register-button sporting-register-btn"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="register-footer sporting-footer">
          <p>¿Ya tienes cuenta? <Link to="/login" className="sporting-link">Inicia Sesión aquí</Link></p>
        </div>
      </div>
    </div>
  )
}

export default RegisterView