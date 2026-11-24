import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthModel from '../../models/AuthModel'
import AlertMessage from '../common/AlertMessage'
import '../../styles/Login.css'

const ForgotPasswordView = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [recoveryCode, setRecoveryCode] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const value = email.trim().toLowerCase()
    if (!value) {
      setError('Ingresa tu correo electrónico')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      setError('Ingresa un correo válido')
      return
    }

    setLoading(true)
    setError('')
    setInfo('')
    setRecoveryCode('')

    try {
      const result = await AuthModel.forgotPassword(value)
      if (!result.success) {
        setError(result.error || 'No se pudo generar el código')
        return
      }
      setInfo(result.message || 'Código generado correctamente')
      if (result.data?.recoveryCode) {
        setRecoveryCode(result.data.recoveryCode)
      }
      sessionStorage.setItem('sporting_reset_email', value)
    } catch (err) {
      setError(err?.message || 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-split">
      <div className="login-container">
        <div className="login-card sporting-login-card">
          <button type="button" className="login-back-btn" onClick={() => navigate('/login')}>
            ← Volver al login
          </button>

          <div className="login-logo-text">
            <span className="sporting-club-name" style={{ color: '#8B0000' }}>SPORTING</span>
          </div>

          <div className="login-header sporting-header">
            <h1>Recuperar contraseña</h1>
            <p>Ingresa el correo de tu cuenta para generar un código de recuperación</p>
          </div>

          {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
          {info && <AlertMessage type="success" message={info} onClose={() => setInfo('')} />}

          {recoveryCode && (
            <div
              style={{
                marginBottom: 16,
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(139,0,0,0.06)',
                border: '1px solid rgba(139,0,0,0.15)',
                textAlign: 'center'
              }}
            >
              <p style={{ margin: '0 0 6px', fontSize: 13, color: '#6b5555' }}>
                Código de recuperación (válido 15 min)
              </p>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: 4, color: '#8B0000' }}>
                {recoveryCode}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                placeholder="usuario@ejemplo.com"
                disabled={loading}
                className="sporting-input"
                autoComplete="email"
              />
            </div>

            <button type="submit" className="login-button sporting-login-btn" disabled={loading}>
              {loading ? 'Generando código...' : 'Generar código'}
            </button>
          </form>

          {recoveryCode && (
            <button
              type="button"
              className="login-button sporting-login-btn"
              style={{ marginTop: 10, background: '#5a0000' }}
              onClick={() => navigate('/reset-password')}
            >
              Continuar a restablecer contraseña
            </button>
          )}

          <div className="login-footer sporting-footer">
            <p>
              ¿Recordaste tu clave?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/login')
                }}
                className="sporting-link"
              >
                Iniciar sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordView