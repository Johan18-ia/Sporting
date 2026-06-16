// src/views/auth/RegisterView.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'

import '../../styles/Register.css'

const RegisterView = () => {

  const navigate = useNavigate()

  const { register } = useAuth()

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  const [formData, setFormData] =
    useState({
      name: '',
      lastname: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    })

  const handleChange = e => {

    const { name, value } = e.target

    setFormData(prev => ({
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
      !formData.name ||
      !formData.lastname ||
      !formData.email ||
      !formData.password
    ) {
      setError(
        'Todos los campos obligatorios deben completarse'
      )
      return
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        'Las contraseñas no coinciden'
      )
      return
    }

    try {

      setLoading(true)

      const result =
        await register({
          name: formData.name,
          lastname: formData.lastname,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })

      if (!result.success) {

        setError(
          result.error ||
          'No fue posible registrar el usuario'
        )

        return
      }

      setSuccess(
        'Usuario registrado correctamente'
      )

      setTimeout(() => {

        navigate('/login')

      }, 2000)

    } catch (error) {

      setError(
        error.message ||
        'Error al registrar usuario'
      )

    } finally {

      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Registro</h1>
        {error && (
          <div className="register-error">
            {error}
          </div>
        )}
        {success && (
          <div className="register-success">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
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
            placeholder="Correo electrónico"
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
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={loading}
          >
            {
              loading
                ? 'Registrando...'
                : 'Registrarse'
            }
          </button>
        </form>
        <div className="register-footer">
          <p>
            ¿Ya tienes cuenta?
            <span
              onClick={() =>
                navigate('/login')
              }
            >
              {' '}
              Inicia sesión
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterView