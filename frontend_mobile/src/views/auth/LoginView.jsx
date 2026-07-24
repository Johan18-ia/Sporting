// src/views/auth/LoginView.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import AlertMessage from '../common/AlertMessage'
import '../../styles/Login.css'
import login from '../../assets/login.jpg'

const LoginHeroImage = () => {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="login-hero-placeholder">
        <span>Agrega tu imagen aquí</span>
        <small>public/assets/login.jpg</small>
      </div>
    )
  }

  return (
<img
  src={login}
  alt="Sporting Club"
  className="login-hero-image"
  onError={() => setFailed(true)}
/>
  )
}

const LoginView = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

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

    if (!credentials.email || !credentials.password) {
      setError('Por favor complete todos los campos')
      return
    }

    setLoading(true)

    try {
      await login(credentials)
      navigate('/dashboard')
    } catch (err) {
      setError(err.error || 'Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    // No existe todavia un flujo de recuperacion de contraseña en el backend.
    // Se deja este aviso para no simular una funcionalidad que no existe.
    alert('Para restablecer tu contraseña, comunícate con el administrador del sistema.')
  }

  return (
    <div className="login-split">
      <div className="login-container">
        <div className="login-card sporting-login-card">
          <button
            type="button"
            className="login-back-btn"
            onClick={() => navigate('/')}
          >
            ← Volver al inicio
          </button>

          <div className="login-logo-text">
            <span className="sporting-club-name" style={{ color: '#8B0000' }}>SPORTING</span>
          </div>

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

            <a href="#" onClick={handleForgotPassword} className="forgot-password-link">
              ¿Olvidaste tu contraseña?
            </a>
          </form>

          <div className="login-footer sporting-footer">
            <p>¿No tienes cuenta? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register') }} className="sporting-link">Regístrate aquí</a></p>
            <div className="demo-credentials sporting-demo">
              <p><strong>Email:</strong> profealbeiro2020@gmail.com</p>
              <p><strong>Contraseña:</strong> [la que usaste para hashear]</p>
            </div>
          </div>
        </div>
      </div>

      <div className="login-image-panel">
        <LoginHeroImage />
      </div>
    </div>
  )
}

export default LoginView