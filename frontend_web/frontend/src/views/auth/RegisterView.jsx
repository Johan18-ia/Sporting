/**
 * RegisterView.jsx:
 * - ¿Qué hace? Valida y crea la cuenta del usuario, con las reglas de registro del mobile en una vista web.
 * - ¿Qué función cumple en el proyecto? Es la vista equivalente a RegisterScreen del mobile, manteniendo validaciones y mensajes consistentes.
 * - Origen mobile equivalente: frontend_mobile/src/presentation/views/auth/RegisterScreen.tsx
 */
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import AlertMessage from '../common/AlertMessage'
import CategoryModel from '../../models/CategoryModel'
import { getFieldError } from '../../utils/validators'
import '../../styles/Register.css'

const initialForm = {
    name: '',
    lastname: '',
    document: '',
    birth_date: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user',
    user_type: 'student',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    address: '',
    occupation: '',
    image: '',
    is_active: 1
}

const RegisterView = () => {
    const { currentUser, isAuthenticated, register } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState(initialForm)
    const [categories, setCategories] = useState([])
    const [categoriesLoaded, setCategoriesLoaded] = useState(false)
    const [categoriesLoadError, setCategoriesLoadError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const result = await CategoryModel.getAllCategories()
                if (result.success) {
                    setCategories(result.data)
                } else {
                    setCategoriesLoadError(true)
                }
            } catch {
                setCategoriesLoadError(true)
            } finally {
                setCategoriesLoaded(true)
            }
        }
        loadCategories()
    }, [])

    const birthYear = useMemo(() => {
        if (!formData.birth_date) return null
        const year = formData.birth_date.slice(0, 4)
        return /^\d{4}$/.test(year) ? year : null
    }, [formData.birth_date])

    const autoCategory = useMemo(() => {
        if (!birthYear || !categories.length) return null
        return categories.find(
            category => String(category.category_year) === birthYear
        ) || null
    }, [birthYear, categories])

    const autoCategoryId = autoCategory?.id == null ? '' : String(autoCategory.id)

    useEffect(() => {
        if (isAuthenticated && currentUser) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, currentUser, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const email = formData.email.trim()
        const name = formData.name.trim()
        const lastname = formData.lastname.trim()

        if (!name || !lastname || !email || !formData.password || !formData.confirmPassword) {
            setError('Nombre, apellido, email y contraseña son obligatorios')
            return
        }

        if (!formData.phone || formData.phone.trim().length < 7) {
            setError('El teléfono es obligatorio y debe tener al menos 7 dígitos')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError('Por favor ingrese un email válido')
            return
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        const validationErrors = [
            getFieldError('name', name),
            getFieldError('name', lastname),
            getFieldError('digits', formData.document),
            getFieldError('email', email),
            getFieldError('phone', formData.phone),
            getFieldError('name', formData.emergency_contact_name),
            getFieldError('phone', formData.emergency_contact_phone),
            getFieldError('url', formData.image)
        ].filter(Boolean)

        if (validationErrors.length) {
            setError(validationErrors[0])
            return
        }

        if (formData.user_type === 'student') {
            if (!formData.birth_date) {
                setError('La fecha de nacimiento es obligatoria')
                return
            }
            if (!categoriesLoaded || categoriesLoadError) {
                setError('No se pudieron cargar las categorías. Inténtalo nuevamente.')
                return
            }
            if (!birthYear || !autoCategoryId) {
                setError(`No existe una categoría para el año ${birthYear || 'indicado'}`)
                return
            }
        }

        setLoading(true)
        setError('')

        try {
            const payload = {
                name,
                lastname,
                document: formData.document || null,
                birth_date: formData.birth_date || null,
                email,
                password: formData.password,
                phone: formData.phone.trim(),
                role: 'user',
                user_type: formData.user_type || 'student',
                category_id: formData.user_type === 'student' && autoCategoryId ? Number(autoCategoryId) : null,
                emergency_contact_name: formData.emergency_contact_name || null,
                emergency_contact_phone: formData.emergency_contact_phone || null,
                address: formData.address || null,
                occupation: formData.occupation || null,
                image: formData.image || '',
                is_active: Number(formData.is_active)
            }

            const result = await register(payload)

            if (result.success) {
                setSuccess('Usuario creado exitosamente')
                setFormData(initialForm)
                setTimeout(() => navigate('/login'), 1500)
            } else {
                setError(result.error || 'No se pudo crear el usuario')
            }
        } catch (err) {
            setError(err?.error || err?.message || 'Error al crear el usuario')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-container">
            <div className="register-card sporting-register-card">
                <div className="register-logo-text">
                    ⚽ <span className="sporting-club-name" style={{ color: '#8B0000' }}>Sporting Club</span>
                </div>

                <div className="register-header sporting-header">
                    <h1>Crear Cuenta</h1>
                    <p>Registra tu perfil como estudiante o padre de familia</p>
                </div>

                {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
                {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label>Tipo de usuario</label>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <input
                                    type="radio"
                                    name="user_type"
                                    value="student"
                                    checked={formData.user_type === 'student'}
                                    onChange={handleChange}
                                />
                                Estudiante
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <input
                                    type="radio"
                                    name="user_type"
                                    value="parent"
                                    checked={formData.user_type === 'parent'}
                                    onChange={handleChange}
                                />
                                Padre
                            </label>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Nombre *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nombre completo"
                                disabled={loading}
                                required
                                className={`sporting-input ${getFieldError('name', formData.name) ? 'field-invalid' : ''}`}
                            />
                            {getFieldError('name', formData.name) && <small className="field-error-message">{getFieldError('name', formData.name)}</small>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastname">Apellido</label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                placeholder="Apellido"
                                disabled={loading}
                                className={`sporting-input ${getFieldError('name', formData.lastname) ? 'field-invalid' : ''}`}
                            />
                            {getFieldError('name', formData.lastname) && <small className="field-error-message">{getFieldError('name', formData.lastname)}</small>}
                        </div>
                    </div>

                    {formData.user_type === 'student' && (
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="document">Documento</label>
                                <input
                                    type="text"
                                    id="document"
                                    name="document"
                                    value={formData.document}
                                    onChange={handleChange}
                                    placeholder="Número de identificación"
                                    disabled={loading}
                                    className={`sporting-input ${getFieldError('digits', formData.document) ? 'field-invalid' : ''}`}
                                    required
                                />
                                {getFieldError('digits', formData.document) && <small className="field-error-message">{getFieldError('digits', formData.document)}</small>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="birth_date">Fecha de nacimiento</label>
                                <input
                                    type="date"
                                    id="birth_date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="sporting-input"
                                />
                            </div>
                        </div>
                    )}

                    {formData.user_type === 'parent' && (
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="document">Documento del padre</label>
                                <input
                                    type="text"
                                    id="document"
                                    name="document"
                                    value={formData.document}
                                    onChange={handleChange}
                                    placeholder="Número de identificación"
                                    disabled={loading}
                                    className={`sporting-input ${getFieldError('digits', formData.document) ? 'field-invalid' : ''}`}
                                    required
                                />
                                {getFieldError('digits', formData.document) && <small className="field-error-message">{getFieldError('digits', formData.document)}</small>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="occupation">Ocupación</label>
                                <input
                                    type="text"
                                    id="occupation"
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    placeholder="Ej: Empresario"
                                    disabled={loading}
                                    className="sporting-input"
                                />
                            </div>
                        </div>
                    )}

                    {formData.user_type === 'student' && (
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="category_id">Categoría asignada</label>
                                <input
                                    type="text"
                                    id="category_id"
                                    value={autoCategoryLabel}
                                    readOnly
                                    disabled
                                    className="sporting-input sporting-input-readonly"
                                    placeholder="Se asigna al ingresar la fecha de nacimiento"
                                />
                                {!formData.birth_date && (
                                    <small className="form-hint">
                                        Ingresa la fecha de nacimiento para asignar la categoría
                                    </small>
                                )}
                                {birthYear && categoriesLoaded && !categoriesLoadError && !autoCategoryId && (
                                    <small className="form-hint form-hint-error">
                                        No existe una categoría para el año {birthYear}. Contacta al administrador.
                                    </small>
                                )}
                                {categoriesLoadError && (
                                    <small className="form-hint form-hint-error">
                                        No se pudieron cargar las categorías.
                                    </small>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Dirección</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Dirección principal"
                                    disabled={loading}
                                    className="sporting-input"
                                />
                            </div>
                        </div>
                    )}

                    {formData.user_type === 'student' && (
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="emergency_contact_name">Contacto de emergencia</label>
                                <input
                                    type="text"
                                    id="emergency_contact_name"
                                    name="emergency_contact_name"
                                    value={formData.emergency_contact_name}
                                    onChange={handleChange}
                                    placeholder="Nombre del responsable"
                                    disabled={loading}
                                    className={`sporting-input ${getFieldError('name', formData.emergency_contact_name) ? 'field-invalid' : ''}`}
                                />
                                {getFieldError('name', formData.emergency_contact_name) && <small className="field-error-message">{getFieldError('name', formData.emergency_contact_name)}</small>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="emergency_contact_phone">Teléfono de emergencia</label>
                                <input
                                    type="tel"
                                    id="emergency_contact_phone"
                                    name="emergency_contact_phone"
                                    value={formData.emergency_contact_phone}
                                    onChange={handleChange}
                                    placeholder="Número de emergencia"
                                    disabled={loading}
                                    className={`sporting-input ${getFieldError('phone', formData.emergency_contact_phone) ? 'field-invalid' : ''}`}
                                />
                                {getFieldError('phone', formData.emergency_contact_phone) && <small className="field-error-message">{getFieldError('phone', formData.emergency_contact_phone)}</small>}
                            </div>
                        </div>
                    )}

                    {formData.user_type === 'parent' && (
                        <div className="form-group">
                            <label htmlFor="address">Dirección</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Dirección principal"
                                disabled={loading}
                                className="sporting-input"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="usuario@ejemplo.com"
                            disabled={loading}
                            required
                            className={`sporting-input ${getFieldError('email', formData.email) ? 'field-invalid' : ''}`}
                        />
                        {getFieldError('email', formData.email) && <small className="field-error-message">{getFieldError('email', formData.email)}</small>}
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
                            <label htmlFor="confirmPassword">Confirmar contraseña *</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repita la contraseña"
                                disabled={loading}
                                required
                                className="sporting-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Teléfono</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Número de contacto"
                            disabled={loading}
                            className={`sporting-input ${getFieldError('phone', formData.phone) ? 'field-invalid' : ''}`}
                        />
                        {getFieldError('phone', formData.phone) && <small className="field-error-message">{getFieldError('phone', formData.phone)}</small>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="role">Rol</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                disabled={loading || currentUser?.role === 'seller'}
                                className="sporting-input"
                            >
                                <option value="user">Usuario</option>
                                <option value="seller">Moderador</option>
                                {currentUser?.role === 'admin' && <option value="admin">Administrador</option>}
                            </select>
                        </div>
                        {currentUser?.role === 'admin' && (
                            <div className="form-group">
                                <label htmlFor="is_active">Estado</label>
                                <select
                                    id="is_active"
                                    name="is_active"
                                    value={formData.is_active}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="sporting-input"
                                >
                                    <option value={1}>Activo</option>
                                    <option value={0}>Inactivo</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">URL de imagen</label>
                        <input
                            type="url"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="URL de la imagen de perfil"
                            disabled={loading}
                            className={`sporting-input ${getFieldError('url', formData.image) ? 'field-invalid' : ''}`}
                        />
                        {getFieldError('url', formData.image) && <small className="field-error-message">{getFieldError('url', formData.image)}</small>}
                    </div>

                    <button type="submit" className="register-button sporting-register-btn" disabled={loading}>
                        {loading ? 'Creando usuario...' : 'Crear Usuario'}
                    </button>
                </form>

                <div className="register-footer sporting-footer">
                    <p>
                        <Link to="/login" className="sporting-link">
                            ← Ya tengo cuenta
                        </Link>
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>
                        Los campos marcados con * son obligatorios
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterView