// src/views/dashboard/UserForm.jsx
// ====================================================
// FORMULARIO: USUARIO (CREAR/EDITAR)
// ====================================================
import { useState, useEffect } from 'react'
import useUsers from '../../hooks/useUsers'
import useAuth from '../../hooks/useAuth'
import CategoryModel from '../../models/CategoryModel'

const UserForm = ({ user, isEdit, onSuccess, onClose }) => {
    const { createUser, updateUser, patchUser } = useUsers()
    const { currentUser } = useAuth()
    const [categories, setCategories] = useState([])

    // ============================================
    // ESTADO DEL FORMULARIO
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
        emergency_contact: '',
        emergency_phone: '',
        address: '',
        image: '',
        role: 'user',
        category_id: '',
        is_active: 1
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [patchMode, setPatchMode] = useState(false)
    const [patchField, setPatchField] = useState('')
    const [patchValue, setPatchValue] = useState('')

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
    // CARGAR DATOS DEL USUARIO (SI ES EDICIÓN)
    // ============================================
    useEffect(() => {
        if (user && isEdit) {
            setFormData({
                name: user.name || '',
                lastname: user.lastname || '',
                document: user.document || '',
                birth_date: user.birth_date || '',
                email: user.email || '',
                password: '',
                confirmPassword: '',
                phone: user.phone || '',
                emergency_contact: user.emergency_contact || '',
                emergency_phone: user.emergency_phone || '',
                address: user.address || '',
                image: user.image || '',
                role: user.role || 'user',
                category_id: user.category_id || '',
                is_active: user.is_active !== undefined ? user.is_active : 1
            })
        }
    }, [user, isEdit])

    // ============================================
    // PERMISOS
    // ============================================
    const canAssignRole = () => {
        return currentUser?.role === 'admin'
    }

    const canChangeStatus = () => {
        return currentUser?.role === 'admin'
    }

    // ============================================
    // MANEJADORES
    // ============================================
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validaciones
        if (!formData.email) {
            setError('El email es requerido')
            return
        }

        if (!isEdit && formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        if (!isEdit && formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }

        if (!isEdit && !formData.name) {
            setError('El nombre es requerido')
            return
        }

        setLoading(true)
        setError('')

        try {
            if (isEdit) {
                if (patchMode && patchField) {
                    // Modo PATCH
                    const patchData = {}
                    patchData[patchField] = patchValue
                    await patchUser(user.id, patchData)
                } else {
                    // Modo PUT
                    const updateData = {
                        name: formData.name,
                        lastname: formData.lastname,
                        document: formData.document || null,
                        birth_date: formData.birth_date || null,
                        email: formData.email,
                        phone: formData.phone || '',
                        emergency_contact: formData.emergency_contact || null,
                        emergency_phone: formData.emergency_phone || null,
                        address: formData.address || null,
                        image: formData.image || '',
                        category_id: formData.category_id ? parseInt(formData.category_id) : null,
                        is_active: formData.is_active
                    }

                    if (canAssignRole()) {
                        updateData.role = formData.role
                    }

                    if (formData.password) {
                        updateData.password = formData.password
                    }

                    await updateUser(user.id, updateData)
                }
            } else {
                // Modo POST - Crear nuevo usuario
                const newUserData = {
                    name: formData.name,
                    lastname: formData.lastname || '',
                    document: formData.document || null,
                    birth_date: formData.birth_date || null,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone || '',
                    emergency_contact: formData.emergency_contact || null,
                    emergency_phone: formData.emergency_phone || null,
                    address: formData.address || null,
                    image: formData.image || '',
                    role: canAssignRole() ? formData.role : 'user',
                    category_id: formData.category_id ? parseInt(formData.category_id) : null,
                    is_active: formData.is_active
                }
                await createUser(newUserData)
            }
            onSuccess()
        } catch (err) {
            setError(err.error || 'Error al guardar usuario')
        } finally {
            setLoading(false)
        }
    }

    const handlePatchSubmit = async (e) => {
        e.preventDefault()
        if (!patchField || !patchValue) {
            setError('Seleccione un campo y un valor')
            return
        }

        setLoading(true)
        try {
            const patchData = {}
            patchData[patchField] = patchValue
            await patchUser(user.id, patchData)
            onSuccess()
        } catch (err) {
            setError(err.error || 'Error al actualizar campo')
        } finally {
            setLoading(false)
        }
    }

    // ============================================
    // RENDERIZADO
    // ============================================
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{isEdit ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="form-error">{error}</div>}

                {/* ============================================
                TOGGLE PATCH (SOLO ADMIN EN EDICIÓN)
                ============================================ */}
                {isEdit && canAssignRole() && (
                    <div className="patch-toggle">
                        <label>
                            <input
                                type="radio"
                                checked={!patchMode}
                                onChange={() => setPatchMode(false)}
                            />
                            Actualizar todos los datos
                        </label>
                        <label>
                            <input
                                type="radio"
                                checked={patchMode}
                                onChange={() => setPatchMode(true)}
                            />
                            Actualizar campo específico
                        </label>
                    </div>
                )}

                {/* ============================================
                FORMULARIO PATCH
                ============================================ */}
                {patchMode && isEdit ? (
                    <form onSubmit={handlePatchSubmit} className="user-form">
                        <div className="form-group">
                            <label>Campo a actualizar</label>
                            <select
                                value={patchField}
                                onChange={(e) => setPatchField(e.target.value)}
                                className="form-control"
                                required
                            >
                                <option value="">Seleccionar campo</option>
                                <option value="name">Nombre</option>
                                <option value="lastname">Apellido</option>
                                <option value="document">Documento</option>
                                <option value="birth_date">Fecha de Nacimiento</option>
                                <option value="email">Email</option>
                                <option value="phone">Teléfono</option>
                                <option value="emergency_contact">Contacto de Emergencia</option>
                                <option value="emergency_phone">Teléfono de Emergencia</option>
                                <option value="address">Dirección</option>
                                <option value="image">Imagen</option>
                                <option value="password">Contraseña</option>
                                {canAssignRole() && <option value="role">Rol</option>}
                                {canChangeStatus() && <option value="is_active">Estado (1=activo, 0=inactivo)</option>}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Nuevo valor</label>
                            {patchField === 'role' ? (
                                <select
                                    value={patchValue}
                                    onChange={(e) => setPatchValue(e.target.value)}
                                    className="form-control"
                                    required
                                >
                                    <option value="">Seleccionar rol</option>
                                    <option value="admin">Administrador</option>
                                    <option value="seller">Vendedor</option>
                                    <option value="user">Usuario</option>
                                </select>
                            ) : patchField === 'is_active' ? (
                                <select
                                    value={patchValue}
                                    onChange={(e) => setPatchValue(e.target.value)}
                                    className="form-control"
                                    required
                                >
                                    <option value="">Seleccionar estado</option>
                                    <option value="1">Activo</option>
                                    <option value="0">Inactivo</option>
                                </select>
                            ) : patchField === 'birth_date' ? (
                                <input
                                    type="date"
                                    value={patchValue}
                                    onChange={(e) => setPatchValue(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            ) : (
                                <input
                                    type={patchField === 'email' ? 'email' : (patchField === 'password' ? 'password' : 'text')}
                                    value={patchValue}
                                    onChange={(e) => setPatchValue(e.target.value)}
                                    placeholder={`Nuevo valor para ${patchField}`}
                                    className="form-control"
                                    required
                                />
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Actualizando...' : 'Actualizar Campo'}
                            </button>
                            <button type="button" className="btn-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    /* ============================================
                    FORMULARIO COMPLETO (CREAR/EDITAR)
                    ============================================ */
                    <form onSubmit={handleSubmit} className="user-form">
                        {/* ============================================
                        DATOS PERSONALES
                        ============================================ */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nombre {!isEdit && '*'}</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nombre"
                                    className="form-control"
                                    required={!isEdit}
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Apellido</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    placeholder="Apellido"
                                    className="form-control"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Documento</label>
                                <input
                                    type="text"
                                    name="document"
                                    value={formData.document}
                                    onChange={handleChange}
                                    placeholder="Número de identificación"
                                    className="form-control"
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    className="form-control"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* ============================================
                        DATOS DE CONTACTO
                        ============================================ */}
                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="usuario@ejemplo.com"
                                className="form-control"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Teléfono"
                                className="form-control"
                                disabled={loading}
                            />
                        </div>

                        {/* ============================================
                        CONTRASEÑA
                        ============================================ */}
                        {!isEdit && (
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Contraseña *</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Mínimo 6 caracteres"
                                        className="form-control"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirmar Contraseña *</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Repita la contraseña"
                                        className="form-control"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        )}

                        {isEdit && !patchMode && (
                            <div className="form-group">
                                <label>Nueva Contraseña (opcional)</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Dejar en blanco para mantener actual"
                                    className="form-control"
                                    disabled={loading}
                                />
                            </div>
                        )}

                        {/* ============================================
                        DATOS DE EMERGENCIA
                        ============================================ */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Contacto de Emergencia</label>
                                <input
                                    type="text"
                                    name="emergency_contact"
                                    value={formData.emergency_contact}
                                    onChange={handleChange}
                                    placeholder="Nombre del contacto"
                                    className="form-control"
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Teléfono de Emergencia</label>
                                <input
                                    type="tel"
                                    name="emergency_phone"
                                    value={formData.emergency_phone}
                                    onChange={handleChange}
                                    placeholder="Teléfono de emergencia"
                                    className="form-control"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Dirección</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Dirección"
                                className="form-control"
                                disabled={loading}
                            />
                        </div>

                        {/* ============================================
                        ROL Y CATEGORÍA
                        ============================================ */}
                        {canAssignRole() && (
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Rol</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="form-control"
                                        disabled={loading}
                                    >
                                        <option value="user">Usuario</option>
                                        <option value="seller">Vendedor</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                    <small className="form-hint">Define los permisos del usuario</small>
                                </div>
                                <div className="form-group">
                                    <label>Categoría (Año)</label>
                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                        className="form-control"
                                        disabled={loading}
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
                        )}

                        {/* ============================================
                        ESTADO (SOLO ADMIN)
                        ============================================ */}
                        {canChangeStatus() && (
                            <div className="form-group">
                                <label>Estado</label>
                                <select
                                    name="is_active"
                                    value={formData.is_active}
                                    onChange={handleChange}
                                    className="form-control"
                                    disabled={loading}
                                >
                                    <option value={1}>✅ Activo</option>
                                    <option value={0}>❌ Inactivo</option>
                                </select>
                            </div>
                        )}

                        {/* ============================================
                        IMAGEN
                        ============================================ */}
                        <div className="form-group">
                            <label>URL de Imagen</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="URL de la imagen de perfil"
                                className="form-control"
                                disabled={loading}
                            />
                        </div>

                        {/* ============================================
                        BOTONES
                        ============================================ */}
                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
                            </button>
                            <button type="button" className="btn-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default UserForm