// src/views/auth/RegisterView.jsx
// ====================================================
// VISTA: REGISTRO DE USUARIOS (SOLO ADMIN/SELLER)
// ====================================================
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import AlertMessage from '../common/AlertMessage'
import CategoryModel from '../../models/CategoryModel'
import '../../styles/Register.css'

const RegisterView = () => {
    const { currentUser, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    // ============================================
    // ESTADOS
    // ============================================
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        document: '',
        birth_date: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'user',
        category_id: '',
        emergency_contact: '',
        emergency_phone: '',
        address: '',
        image: '',
        is_active: 1
    })

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // ============================================
    // CARGAR CATEGORÍAS
    // ============================================
    useEffect(() => {
        const loadCategories = async () => {
            const result = await CategoryModel.getAllCategories()
            if (result.success) {
                setCategories(result.data)
            }
        }
        loadCategories()
    }, [])

    // ============================================
    // VERIFICAR PERMISOS (SOLO ADMIN/SELLER)
    // ============================================
    useEffect(() => {
        if (!isAuthenticated) {
            // Si no está autenticado, redirigir al login
            navigate('/login')
            return
        }

        // Si está autenticado pero no es admin ni seller
        if (currentUser && !['admin', 'seller'].includes(currentUser.role)) {
            setError('No tienes permisos para registrar usuarios. Contacta al administrador.')
            setTimeout(() => {
                navigate('/dashboard')
            }, 3000)
        }
    }, [currentUser, isAuthenticated, navigate])

    // ============================================
    // MANEJAR CAMBIOS EN FORMULARIO
    // ============================================
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        if (error) setError('')
    }

    // ============================================
    // MANEJAR ENVÍO DEL FORMULARIO
    // ============================================
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validar campos obligatorios
        if (!formData.name || !formData.email || !formData.password) {
            setError('Nombre, email y contraseña son obligatorios')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError('Por favor ingrese un email válido')
            return
        }

        setLoading(true)
        setError('')

        try {
            // Preparar datos para enviar
            const userData = {
                name: formData.name,
                lastname: formData.lastname || '',
                document: formData.document || null,
                birth_date: formData.birth_date || null,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || '',
                role: formData.role || 'user',
                category_id: formData.category_id ? parseInt(formData.category_id) : null,
                emergency_contact: formData.emergency_contact || null,
                emergency_phone: formData.emergency_phone || null,
                address: formData.address || null,
                image: formData.image || '',
                is_active: formData.is_active
            }

            // Llamar al controlador para crear usuario
            const { register } = useAuth()
            const result = await register(userData)

            if (result.success) {
                setSuccess('Usuario creado exitosamente')
                setFormData({
                    name: '',
                    lastname: '',
                    document: '',
                    birth_date: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    phone: '',
                    role: 'user',
                    category_id: '',
                    emergency_contact: '',
                    emergency_phone: '',
                    address: '',
                    image: '',
                    is_active: 1
                })

                setTimeout(() => {
                    navigate('/dashboard/users')
                }, 2000)
            }
        } catch (err) {
            setError(err.error || 'Error al crear el usuario')
        } finally {
            setLoading(false)
        }
    }

    // ============================================
    // RENDERIZADO
    // ============================================
    return (
        <div className="register-container">
            <div className="register-card sporting-register-card">
                <div className="register-logo-text">
                    ⚽ <span className="sporting-club-name" style={{ color: '#8B0000' }}>Sporting Club</span>
                </div>

                <div className="register-header sporting-header">
                    <h1>Registrar Usuario</h1>
                    <p>Completa los datos para crear un nuevo usuario</p>
                    {currentUser && (
                        <p style={{ fontSize: '0.85rem', color: '#666' }}>
                            Registrando como <strong>{currentUser.role}</strong>
                        </p>
                    )}
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
                    {/* ============================================
                    DATOS PERSONALES
                    ============================================ */}
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
                                className="sporting-input"
                            />
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
                                className="sporting-input"
                            />
                        </div>
                    </div>

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
                                className="sporting-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="birth_date">Fecha de Nacimiento</label>
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

                    {/* ============================================
                    DATOS DE ACCESO
                    ============================================ */}
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
                            className="sporting-input"
                        />
                    </div>

                    {/* ============================================
                    ROL Y CATEGORÍA
                    ============================================ */}
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
                                <option value="seller">Vendedor</option>
                                {currentUser?.role === 'admin' && (
                                    <option value="admin">Administrador</option>
                                )}
                            </select>
                            {currentUser?.role === 'seller' && (
                                <small className="form-hint">Solo puedes crear usuarios o vendedores</small>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="category_id">Categoría (Año)</label>
                            <select
                                id="category_id"
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                disabled={loading}
                                className="sporting-input"
                            >
                                <option value="">Sin categoría</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.category_year || cat.name_year} - {cat.description || ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* ============================================
                    INFORMACIÓN DE EMERGENCIA
                    ============================================ */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="emergency_contact">Contacto de Emergencia</label>
                            <input
                                type="text"
                                id="emergency_contact"
                                name="emergency_contact"
                                value={formData.emergency_contact}
                                onChange={handleChange}
                                placeholder="Nombre del contacto"
                                disabled={loading}
                                className="sporting-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emergency_phone">Teléfono de Emergencia</label>
                            <input
                                type="tel"
                                id="emergency_phone"
                                name="emergency_phone"
                                value={formData.emergency_phone}
                                onChange={handleChange}
                                placeholder="Número de emergencia"
                                disabled={loading}
                                className="sporting-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Dirección</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Dirección de residencia"
                            disabled={loading}
                            className="sporting-input"
                        />
                    </div>

                    {/* ============================================
                    ESTADO DEL USUARIO (SOLO ADMIN)
                    ============================================ */}
                    {currentUser?.role === 'admin' && (
                        <div className="form-group">
                            <label htmlFor="is_active">Estado del Usuario</label>
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

                    {/* ============================================
                    IMAGEN
                    ============================================ */}
                    <div className="form-group">
                        <label htmlFor="image">URL de Imagen</label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="URL de la imagen de perfil"
                            disabled={loading}
                            className="sporting-input"
                        />
                    </div>

                    {/* ============================================
                    BOTÓN DE ENVÍO
                    ============================================ */}
                    <button
                        type="submit"
                        className="register-button sporting-register-btn"
                        disabled={loading}
                    >
                        {loading ? 'Creando usuario...' : 'Crear Usuario'}
                    </button>
                </form>

                {/* ============================================
                FOOTER
                ============================================ */}
                <div className="register-footer sporting-footer">
                    <p>
                        <Link to="/dashboard" className="sporting-link">
                            ← Volver al Dashboard
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