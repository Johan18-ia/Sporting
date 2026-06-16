// src/views/auth/LoginView.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'

import '../../styles/Login.css'

const LoginView = () => {

  const navigate = useNavigate()

  const { login } = useAuth()

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [credentials, setCredentials] =
    useState({
      email: '',
      password: ''
    })

  const handleChange = e => {

    const { name, value } = e.target

    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))

    if (error) {
      setError('')
    }
  }

  const handleSubmit = async e => {

    e.preventDefault()

    if (
      !credentials.email ||
      !credentials.password
    ) {
      setError(
        'Todos los campos son obligatorios'
      )
      return
    }

    try {

      setLoading(true)

      const result =
        await login(credentials)

      if (!result.success) {

        setError(
          result.error ||
          'Credenciales incorrectas'
        )

        return
      }

      navigate('/dashboard')

    } catch (error) {

      setError(
        error.message ||
        'Error al iniciar sesión'
      )

    } finally {

      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Bienvenido</h1>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Usuario"
            value={credentials.email}
            onChange={handleChange}
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={credentials.password}
            onChange={handleChange}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {
              loading
                ? 'Ingresando...'
                : 'Iniciar sesión'
            }
          </button>

        </form>

        <div className="register-area">

          <p>
            ¿No tienes cuenta?
            <span
              onClick={() =>
                navigate('/register')
              }
            >
              {' '}
              Regístrate aquí
            </span>
          </p>

          <button
            className="back-btn"
            onClick={() => navigate('/')}
          >
            Volver
          </button>

        </div>

      </div>

    </div>
  )
}

export default LoginView