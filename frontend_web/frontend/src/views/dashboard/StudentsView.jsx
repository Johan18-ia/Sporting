// src/views/dashboard/StudentsView.jsx
// ====================================================
// VISTA: GESTIÓN DE ESTUDIANTES
// ====================================================
import React, { useState, useEffect } from 'react'
import AlertMessage from '../common/AlertMessage'
import CategoryModel from '../../models/CategoryModel'
import useAuth from '../../hooks/useAuth'
import StudentModel from '../../models/StudentModel'

const StudentsView = () => {
    const { currentUser } = useAuth()
    const [students, setStudents] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [filterCategory, setFilterCategory] = useState('')
    const [editingStudent, setEditingStudent] = useState(null)

    // ============================================
    // ESTADO DEL FORMULARIO
    // ============================================
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        document: '',
        category_id: '',
        birth_date: '',
        phone: '',
        address: '',
        emergency_contact: '',
        emergency_phone: ''
    })

    // ============================================
    // PERMISOS
    // ============================================
    const canEdit = () => {
        return currentUser && (currentUser.role === 'admin' || currentUser.role === 'seller')
    }

    const canDelete = () => {
        return currentUser && currentUser.role === 'admin'
    }

    const canCreate = () => {
        return currentUser && (currentUser.role === 'admin' || currentUser.role === 'seller')
    }

    // ============================================
    // CARGAR DATOS
    // ============================================
    const loadData = async () => {
        setLoading(true)
        setError(null)

        try {
            // Cargar estudiantes
            const studentsResult = await StudentModel.getAllStudents()
            if (studentsResult.success) {
                setStudents(studentsResult.data)
            } else {
                setError(studentsResult.error)
            }

            // Cargar categorías
            const categoriesResult = await CategoryModel.getAllCategories()
            if (categoriesResult.success) {
                setCategories(categoriesResult.data)
            }
        } catch (err) {
            setError('Error al cargar los datos')
        }

        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    // ============================================
    // MANEJADORES DEL FORMULARIO
    // ============================================
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validaciones
        if (!formData.name || !formData.lastname || !formData.document || !formData.category_id) {
            setMessage({ type: 'error', text: 'Complete todos los campos obligatorios' })
            setTimeout(() => setMessage(null), 3000)
            return
        }

        setLoading(true)

        try {
            const studentData = {
                name: formData.name,
                lastname: formData.lastname,
                document: formData.document,
                category_id: parseInt(formData.category_id),
                birth_date: formData.birth_date || null,
                phone: formData.phone || '',
                address: formData.address || '',
                emergency_contact: formData.emergency_contact || '',
                emergency_phone: formData.emergency_phone || ''
            }

            let result
            if (editingStudent) {
                // Actualizar estudiante existente
                result = await StudentModel.updateStudent(editingStudent.id, studentData)
            } else {
                // Crear nuevo estudiante
                result = await StudentModel.createStudent(studentData)
            }

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: editingStudent ? 'Estudiante actualizado exitosamente' : 'Estudiante registrado exitosamente'
                })
                setShowForm(false)
                setEditingStudent(null)
                setFormData({
                    name: '',
                    lastname: '',
                    document: '',
                    category_id: '',
                    birth_date: '',
                    phone: '',
                    address: '',
                    emergency_contact: '',
                    emergency_phone: ''
                })
                loadData()
            } else {
                setMessage({ type: 'error', text: result.error })
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error al guardar el estudiante' })
        }

        setLoading(false)
        setTimeout(() => setMessage(null), 3000)
    }

    // ============================================
    // ELIMINAR ESTUDIANTE
    // ============================================
    const handleDelete = async (id, name) => {
        if (!canDelete()) {
            setMessage({ type: 'error', text: 'No tiene permisos para eliminar estudiantes' })
            setTimeout(() => setMessage(null), 3000)
            return
        }

        if (window.confirm(`¿Eliminar al estudiante "${name}"?`)) {
            setLoading(true)
            const result = await StudentModel.deleteStudent(id)
            if (result.success) {
                setMessage({ type: 'success', text: 'Estudiante eliminado exitosamente' })
                loadData()
            } else {
                setMessage({ type: 'error', text: result.error })
            }
            setLoading(false)
            setTimeout(() => setMessage(null), 3000)
        }
    }

    // ============================================
    // EDITAR ESTUDIANTE
    // ============================================
    const handleEdit = (student) => {
        if (!canEdit()) {
            setMessage({ type: 'error', text: 'No tiene permisos para editar estudiantes' })
            setTimeout(() => setMessage(null), 3000)
            return
        }

        setEditingStudent(student)
        setFormData({
            name: student.name || '',
            lastname: student.lastname || '',
            document: student.document || '',
            category_id: student.category_id || '',
            birth_date: student.birth_date || '',
            phone: student.phone || '',
            address: student.address || '',
            emergency_contact: student.emergency_contact || '',
            emergency_phone: student.emergency_phone || ''
        })
        setShowForm(true)
    }

    // ============================================
    // FILTRAR ESTUDIANTES
    // ============================================
    const filteredStudents = filterCategory
        ? students.filter(s => s.category_id === parseInt(filterCategory))
        : students

    // ============================================
    // OBTENER NOMBRE DE CATEGORÍA
    // ============================================
    const getCategoryName = (categoryId) => {
        const cat = categories.find(c => c.id === categoryId)
        return cat ? `${cat.category_year || cat.name_year}` : 'Sin categoría'
    }

    // ============================================
    // ESTILOS
    // ============================================
    const containerStyles = {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
    }

    const headerStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
    }

    const filterStyles = {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap'
    }

    const selectStyles = {
        padding: '8px 15px',
        border: '2px solid #e1e5e9',
        borderRadius: '8px',
        fontSize: '14px',
        background: 'white'
    }

    const tableStyles = {
        width: '100%',
        borderCollapse: 'collapse',
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }

    const thStyles = {
        background: '#8B0000',
        color: 'white',
        padding: '12px 15px',
        textAlign: 'left',
        fontWeight: 600
    }

    const tdStyles = {
        padding: '12px 15px',
        borderBottom: '1px solid #e1e5e9'
    }

    // ============================================
    // RENDERIZADO
    // ============================================
    return (
        <div style={containerStyles}>
            {/* ============================================
            HEADER
            ============================================ */}
            <div style={headerStyles}>
                <h2 style={{ color: '#333', margin: 0 }}>👟 Gestión de Estudiantes</h2>
                {canCreate() && (
                    <button
                        onClick={() => {
                            setEditingStudent(null)
                            setFormData({
                                name: '',
                                lastname: '',
                                document: '',
                                category_id: '',
                                birth_date: '',
                                phone: '',
                                address: '',
                                emergency_contact: '',
                                emergency_phone: ''
                            })
                            setShowForm(!showForm)
                        }}
                        style={{
                            background: '#8B0000',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        {showForm ? '✕ Cancelar' : '+ Nuevo Estudiante'}
                    </button>
                )}
            </div>

            {/* ============================================
            MENSAJES
            ============================================ */}
            {message && (
                <AlertMessage
                    type={message.type}
                    message={message.text}
                    onClose={() => setMessage(null)}
                />
            )}

            {/* ============================================
            FORMULARIO
            ============================================ */}
            {showForm && (
                <form onSubmit={handleSubmit} style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    animation: 'fadeInUp 0.3s ease'
                }}>
                    <h3 style={{ marginBottom: '15px', color: '#333' }}>
                        {editingStudent ? '✏️ Editar Estudiante' : '📝 Registrar Estudiante'}
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {/* Nombre */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>
                                Nombres *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nombre del estudiante"
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '2px solid #e1e5e9',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Apellido */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>
                                Apellidos *
                            </label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                placeholder="Apellido del estudiante"
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '2px solid #e1e5e9',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Documento */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>
                                Documento *
                            </label>
                            <input
                                type="text"
                                name="document"
                                value={formData.document}
                                onChange={handleChange}
                                placeholder="Número de identificación"
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '2px solid #e1e5e9',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Categoría */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>
                                Categoría *
                            </label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '2px solid #e1e5e9',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    background: 'white'
                                }}
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.category_year || cat.name_year} - {cat.description || ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>
                                Fecha de Nacimiento
                            </label>
                            <input
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '2px solid #e1e5e9',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Número de contacto"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '2px solid #e1e5e9',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Dirección */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>
                                Dirección
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Dirección de residencia"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '2px solid #e1e5e9',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Contacto de Emergencia */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>
                                Contacto de Emergencia
                            </label>
                            <input
                                type="text"
                                name="emergency_contact"
                                value={formData.emergency_contact}
                                onChange={handleChange}
                                placeholder="Nombre del contacto"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '2px solid #e1e5e9',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Teléfono de Emergencia */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>
                                Teléfono de Emergencia
                            </label>
                            <input
                                type="tel"
                                name="emergency_phone"
                                value={formData.emergency_phone}
                                onChange={handleChange}
                                placeholder="Teléfono de emergencia"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '2px solid #e1e5e9',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '20px',
                        justifyContent: 'flex-end'
                    }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: '#8B0000',
                                color: 'white',
                                border: 'none',
                                padding: '10px 30px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            {loading ? 'Guardando...' : (editingStudent ? 'Actualizar' : 'Guardar')}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false)
                                setEditingStudent(null)
                            }}
                            style={{
                                background: '#e5e7eb',
                                color: '#333',
                                border: 'none',
                                padding: '10px 30px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {/* ============================================
            FILTROS
            ============================================ */}
            <div style={filterStyles}>
                <label style={{ fontWeight: 500 }}>Filtrar por categoría:</label>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={selectStyles}
                >
                    <option value="">Todas las categorías</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.category_year || cat.name_year}
                        </option>
                    ))}
                </select>
                <span style={{ color: '#666', fontSize: '14px' }}>
                    {filteredStudents.length} estudiante(s)
                </span>
            </div>

            {/* ============================================
            TABLA DE ESTUDIANTES
            ============================================ */}
            {loading && <p style={{ textAlign: 'center', color: '#666' }}>Cargando estudiantes...</p>}

            {error && !loading && (
                <div style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    Error: {error}
                </div>
            )}

            {!loading && !error && (
                <table style={tableStyles}>
                    <thead>
                        <tr>
                            <th style={thStyles}>ID</th>
                            <th style={thStyles}>Nombre Completo</th>
                            <th style={thStyles}>Documento</th>
                            <th style={thStyles}>Categoría</th>
                            <th style={thStyles}>Contacto</th>
                            <th style={thStyles}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                    No hay estudiantes registrados
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((s) => (
                                <tr key={s.id}>
                                    <td style={tdStyles}>#{s.id}</td>
                                    <td style={tdStyles}>
                                        <strong>{s.name} {s.lastname}</strong>
                                        <div style={{ fontSize: '11px', color: '#888' }}>
                                            {s.birth_date ? `📅 ${s.birth_date}` : ''}
                                        </div>
                                    </td>
                                    <td style={tdStyles}>{s.document}</td>
                                    <td style={tdStyles}>
                                        <span style={{
                                            background: '#8B0000',
                                            color: 'white',
                                            padding: '2px 10px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 600
                                        }}>
                                            {getCategoryName(s.category_id)}
                                        </span>
                                    </td>
                                    <td style={tdStyles}>
                                        <div style={{ fontSize: '13px' }}>
                                            {s.phone ? `📞 ${s.phone}` : ''}
                                            {s.emergency_contact && (
                                                <div style={{ fontSize: '11px', color: '#666' }}>
                                                    🆘 {s.emergency_contact}
                                                    {s.emergency_phone ? ` (${s.emergency_phone})` : ''}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={tdStyles}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleEdit(s)}
                                                disabled={!canEdit()}
                                                style={{
                                                    background: '#f59e0b',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '5px 12px',
                                                    borderRadius: '6px',
                                                    cursor: canEdit() ? 'pointer' : 'not-allowed',
                                                    fontSize: '13px',
                                                    opacity: canEdit() ? 1 : 0.5
                                                }}
                                                title={canEdit() ? 'Editar' : 'Sin permisos'}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s.id, s.name)}
                                                disabled={!canDelete()}
                                                style={{
                                                    background: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '5px 12px',
                                                    borderRadius: '6px',
                                                    cursor: canDelete() ? 'pointer' : 'not-allowed',
                                                    fontSize: '13px',
                                                    opacity: canDelete() ? 1 : 0.5
                                                }}
                                                title={canDelete() ? 'Eliminar' : 'Sin permisos'}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default StudentsView