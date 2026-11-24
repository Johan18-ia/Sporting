import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthModel from '../../models/AuthModel'
import AlertMessage from '../common/AlertMessage'
import '../../styles/Login.css'

const ResetPasswordView = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(() => ({
    email: sessionStorage.getItem('sporting_reset_email') || '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  }))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = form.email.trim().toLowerCase()
    const code = form.code.trim()
    const newPassword = form.newPassword
    const confirmPassword = form.confirmPassword

    if (!email || !code || !newPassword || !confirmPassword) {
      setError('Completa todos los campos')
      return
    }
    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await AuthModel.resetPassword({ email, code, newPassword })
      if (!result.success) {
        setError(result.error || 'No se pudo restablecer la contraseña')
        return
      }
      sessionStorage.removeItem('sporting_reset_email')
      setSuccess(result.message || 'Contraseña actualizada. Redirigiendo al login...')
      setTimeout(() => navigate('/login'), 1800)
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
          <button type="button" className="login-back-btn" onClick={() => navigate('/forgot-password')}>
            ← Volver
          </button>

          <div className="login-logo-text">
            <span className="sporting-club-name" style={{ color: '#8B0000' }}>SPORTING</span>
          </div>

          <div className="login-header sporting-header">
            <h1>Nueva contraseña</h1>
            <p>Ingresa el código de recuperación y tu nueva clave</p>
          </div>

          {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
          {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="sporting-input"
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="code">Código de recuperación</label>
              <input
                type="text"
                id="code"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="6 dígitos"
                className="sporting-input"
                disabled={loading}
                inputMode="numeric"
                maxLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nueva contraseña</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="sporting-input"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                className="sporting-input"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="login-button sporting-login-btn" disabled={loading}>
              {loading ? 'Guardando...' : 'Restablecer contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordView