import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import UserController from '../../controllers/UserController'
import { ROUTES } from '../../config/routes'
import PageHeader from '../ui/PageHeader'
import Card from '../ui/Card'
import Button from '../ui/Button'
import AlertMessage from '../common/AlertMessage'

const initialFormData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
}

const ChangePasswordView = () => {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [formData, setFormData] = useState(initialFormData)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [visiblePasswords, setVisiblePasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    })

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((previous) => ({ ...previous, [name]: value }))
        if (message) setMessage(null)
    }

    const togglePasswordVisibility = (field) => {
        setVisiblePasswords((previous) => ({ ...previous, [field]: !previous[field] }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Por favor complete todos los campos' })
            return
        }
        if (formData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres' })
            return
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'La nueva contraseña y su confirmación no coinciden' })
            return
        }
        if (formData.currentPassword === formData.newPassword) {
            setMessage({ type: 'error', text: 'La nueva contraseña debe ser diferente a la actual' })
            return
        }

        setLoading(true)
        setMessage(null)
        UserController.changePassword(
            formData.currentPassword,
            formData.newPassword,
            () => {
                setMessage({
                    type: 'success',
                    text: 'Contraseña actualizada correctamente. Cerrando sesión...'
                })
                window.setTimeout(async () => {
                    try {
                        await logout()
                        navigate(ROUTES.LOGIN, { replace: true })
                    } catch {
                        setLoading(false)
                        setMessage({ type: 'error', text: 'La contraseña cambió, pero no se pudo cerrar la sesión.' })
                    }
                }, 1200)
            },
            (error) => {
                setMessage({ type: 'error', text: error })
                setLoading(false)
            }
        )
    }

    const renderPasswordField = (field, label, placeholder, autoComplete) => (
        <div className="ui-field">
            <label htmlFor={field}>{label} *</label>
            <div className="password-field-control">
                <input
                    id={field}
                    type={visiblePasswords[field] ? 'text' : 'password'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    disabled={loading}
                    required
                />
                <button
                    type="button"
                    className="password-visibility-button"
                    onClick={() => togglePasswordVisibility(field)}
                    aria-label={visiblePasswords[field] ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    title={visiblePasswords[field] ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    disabled={loading}
                >
                    {visiblePasswords[field] ? 'Ocultar' : 'Mostrar'}
                </button>
            </div>
        </div>
    )

    return (
        <div>
            <PageHeader
                title="Cambiar contraseña"
                description="Confirma tu contraseña actual y define una nueva."
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
                    {renderPasswordField('currentPassword', 'Contraseña actual', 'Ingresa tu contraseña actual', 'current-password')}
                    {renderPasswordField('newPassword', 'Nueva contraseña', 'Mínimo 6 caracteres', 'new-password')}
                    {renderPasswordField('confirmPassword', 'Confirmar nueva contraseña', 'Repite la nueva contraseña', 'new-password')}

                    <div className="password-form-actions">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Actualizando...' : 'Cambiar contraseña'}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default ChangePasswordView