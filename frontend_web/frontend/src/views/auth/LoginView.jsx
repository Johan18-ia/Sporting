// src/views/auth/LoginView.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import AlertMessage from '../common/AlertMessage'
import logoImagen from '../assets/logo.png'  // ← Si tienes logo, si no, usa el texto
import '../../styles/Login.css'  // ← Tu archivo existente

const LoginView = () => {
  // ===== LOGICA COMPLETAMENTE  =====
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  // ===== FUNCIONES SIN CAMBIOS =====
  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('📝 Intentando login con:', credentials.email)

    if (!credentials.email || !credentials.password) {
      setError('Por favor complete todos los campos')
      return
    }

    setLoading(true)

    try {
      const result = await login(credentials)
      console.log('✅ Login exitoso:', result)
      navigate('/dashboard')
    } catch (err) {
      console.error('❌ Error en login:', err)
      setError(err.error || 'Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      setLoading(false)
    }
  }

  // ===== SOLO CAMBIA EL DISEÑO VISUAL =====
  return (
    <div className="login-container">
      <div className="login-card sporting-login-card">
        {/* Logo Sporting - Opcional, si no tienes logo usa texto */}
        {logoImagen ? (
          <img
            src={logoImagen}
            alt="Sporting Club"
            className="login-logo-sporting"
          />
        ) : (
          <div className="login-logo-text">
            ⚽ <span className="sporting-club-name">Sporting Club</span>
          </div>
        )}

        <div className="login-header sporting-header">
          <h1>Bienvenido a Sporting</h1>
          <p>Inicia sesión para acceder al panel</p>
        </div>

        {error && (
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="usuario@ejemplo.com"
              disabled={loading}
              autoComplete="off"
              className="sporting-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              autoComplete="off"
              className="sporting-input"
            />
          </div>

          <button
            type="submit"
            className="login-button sporting-login-btn"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer sporting-footer">
          <p>¿No tienes cuenta? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register') }} className="sporting-link">Regístrate aquí</a></p>
          <div className="demo-credentials sporting-demo">
            <p><strong>Email:</strong> oliver@stone.com</p>
            <p><strong>Contraseña:</strong> [la que usaste para hashear]</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginView