// src/views/dashboard/StudentsView.jsx
import React, { useState, useEffect, useMemo } from 'react'
import AlertMessage from '../common/AlertMessage'
import CategoryModel from '../../models/CategoryModel'
import useAuth from '../../hooks/useAuth'
import StudentModel from '../../models/StudentModel'
import PageHeader from '../ui/PageHeader'
import Button from '../ui/Button'
import '../../styles/Students.css'

const emptyForm = {
  name: '',
  lastname: '',
  document: '',
  category_id: '',
  birth_date: '',
  phone: '',
  address: '',
  emergency_contact: '',
  emergency_phone: ''
}

const formatBirth = (value) => {
  if (!value) return null
  const d = String(value).slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return null
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

const initials = (name, lastname) => {
  const a = (name || '').trim().charAt(0)
  const b = (lastname || '').trim().charAt(0)
  return ((a + b) || '?').toUpperCase()
}

const StudentsView = () => {
  const { currentUser } = useAuth()
  const [students, setStudents] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState('')
  const [search, setSearch] = useState('')
  const [editingStudent, setEditingStudent] = useState(null)
  const [formData, setFormData] = useState({ ...emptyForm })

  const canEdit = () =>
    currentUser && (currentUser.role === 'admin' || currentUser.role === 'seller')
  const canDelete = () => currentUser && currentUser.role === 'admin'
  const canCreate = () =>
    currentUser && (currentUser.role === 'admin' || currentUser.role === 'seller')

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const studentsResult = await StudentModel.getAllStudents()
      if (studentsResult.success) setStudents(studentsResult.data)
      else setError(studentsResult.error)

      const categoriesResult = await CategoryModel.getAllCategories()
      if (categoriesResult.success) setCategories(categoriesResult.data)
    } catch {
      setError('Error al cargar los datos')
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
        category_id: parseInt(formData.category_id, 10),
        birth_date: formData.birth_date || null,
        phone: formData.phone || '',
        address: formData.address || '',
        emergency_contact: formData.emergency_contact || '',
        emergency_phone: formData.emergency_phone || ''
      }
      const result = editingStudent
        ? await StudentModel.updateStudent(editingStudent.id, studentData)
        : await StudentModel.createStudent(studentData)

      if (result.success) {
        setMessage({
          type: 'success',
          text: editingStudent
            ? 'Estudiante actualizado exitosamente'
            : 'Estudiante registrado exitosamente'
        })
        setShowForm(false)
        setEditingStudent(null)
        setFormData({ ...emptyForm })
        loadData()
      } else {
        setMessage({ type: 'error', text: result.error })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al guardar el estudiante' })
    }
    setLoading(false)
    setTimeout(() => setMessage(null), 3000)
  }

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

  const handleEdit = (student) => {
    if (!canEdit()) return
    setEditingStudent(student)
    setFormData({
      name: student.name || '',
      lastname: student.lastname || '',
      document: student.document || '',
      category_id: student.category_id || '',
      birth_date: student.birth_date ? String(student.birth_date).slice(0, 10) : '',
      phone: student.phone || '',
      address: student.address || '',
      emergency_contact: student.emergency_contact || '',
      emergency_phone: student.emergency_phone || ''
    })
    setShowForm(true)
  }

  const openCreate = () => {
    setEditingStudent(null)
    setFormData({ ...emptyForm })
    setShowForm(true)
  }

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId || c.id === Number(categoryId))
    return cat ? `${cat.category_year || cat.name_year}` : 'Sin categoría'
  }

  const filteredStudents = useMemo(() => {
    let list = students
    if (filterCategory) {
      list = list.filter((s) => String(s.category_id) === String(filterCategory))
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((s) => {
        const full = `${s.name || ''} ${s.lastname || ''}`.toLowerCase()
        return (
          full.includes(q) ||
          String(s.document || '').toLowerCase().includes(q) ||
          String(s.phone || '').toLowerCase().includes(q)
        )
      })
    }
    return list
  }, [students, filterCategory, search])

  return (
    <div className="stu-page">
      <PageHeader
        title="Estudiantes"
        description="Gestión de alumnos por categoría"
        actions={
          canCreate() ? (
            <Button
              onClick={() => {
                if (showForm) {
                  setShowForm(false)
                  setEditingStudent(null)
                  setFormData({ ...emptyForm })
                } else openCreate()
              }}
            >
              {showForm ? '✕ Cancelar' : '+ Nuevo Estudiante'}
            </Button>
          ) : null
        }
      />

      {message && (
        <AlertMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
      )}

      <div className="stu-stats">
        <div className="stu-stat">
          <div className="stu-stat-icon stu-stat-icon--e">E</div>
          <div>
            <span className="stu-stat-value">{students.length}</span>
            <span className="stu-stat-label">Estudiantes</span>
          </div>
        </div>
        <div className="stu-stat">
          <div className="stu-stat-icon stu-stat-icon--c">C</div>
          <div>
            <span className="stu-stat-value">{categories.length}</span>
            <span className="stu-stat-label">Categorías</span>
          </div>
        </div>
        <div className="stu-stat">
          <div className="stu-stat-icon stu-stat-icon--f">F</div>
          <div>
            <span className="stu-stat-value">{filteredStudents.length}</span>
            <span className="stu-stat-label">En vista</span>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="stu-form-card">
          <h3 className="stu-form-title">
            {editingStudent ? 'Editar estudiante' : 'Nuevo estudiante'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="stu-form-grid">
              <div className="ui-field">
                <label>Nombre *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="ui-field">
                <label>Apellido *</label>
                <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
              </div>
              <div className="ui-field">
                <label>Documento *</label>
                <input type="text" name="document" value={formData.document} onChange={handleChange} required />
              </div>
              <div className="ui-field">
                <label>Categoría *</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange} required>
                  <option value="">Seleccionar...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.category_year || c.name_year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ui-field">
                <label>Fecha de nacimiento</label>
                <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
              </div>
              <div className="ui-field">
                <label>Teléfono</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="ui-field" style={{ gridColumn: '1 / -1' }}>
                <label>Dirección</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} />
              </div>
              <div className="ui-field">
                <label>Contacto de emergencia</label>
                <input type="text" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} />
              </div>
              <div className="ui-field">
                <label>Tel. emergencia</label>
                <input type="text" name="emergency_phone" value={formData.emergency_phone} onChange={handleChange} />
              </div>
            </div>
            <div className="stu-form-actions">
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : editingStudent ? 'Actualizar' : 'Registrar estudiante'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="stu-toolbar">
        <div className="stu-search-wrap">
          <input
            type="search"
            className="stu-search"
            placeholder="Buscar por nombre, documento o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="stu-chips">
          <button
            type="button"
            className={`stu-chip ${!filterCategory ? 'is-active' : ''}`}
            onClick={() => setFilterCategory('')}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`stu-chip ${String(filterCategory) === String(c.id) ? 'is-active' : ''}`}
              onClick={() => setFilterCategory(String(c.id))}
            >
              {c.category_year || c.name_year}
            </button>
          ))}
        </div>
      </div>

      {loading && students.length === 0 && <p className="stu-status">Cargando estudiantes...</p>}
      {error && <p className="stu-status stu-status-error">{error}</p>}

      {!loading && filteredStudents.length === 0 ? (
        <div className="stu-empty">
          <div className="stu-empty-icon">👤</div>
          <p className="stu-empty-title">Sin estudiantes</p>
          <p className="stu-empty-text">
            {search || filterCategory
              ? 'No hay resultados con esos filtros.'
              : 'Registra el primer estudiante con el botón de arriba.'}
          </p>
        </div>
      ) : (
        <div className="stu-grid">
          {filteredStudents.map((s) => {
            const year = getCategoryName(s.category_id)
            const birth = formatBirth(s.birth_date)
            return (
              <article key={s.id} className="stu-card">
                <div className="stu-card-top">
                  <div className="stu-avatar">{initials(s.name, s.lastname)}</div>
                  <div className="stu-card-head">
                    <h3 className="stu-card-name">
                      {s.name} {s.lastname}
                    </h3>
                    <span className="stu-card-year">{year}</span>
                  </div>
                </div>
                <div className="stu-card-rows">
                  <div className="stu-row">
                    <span className="stu-row-label">Documento</span>
                    <span className="stu-row-value">{s.document || '—'}</span>
                  </div>
                  {birth && (
                    <div className="stu-row">
                      <span className="stu-row-label">Nacimiento</span>
                      <span className="stu-row-value">{birth}</span>
                    </div>
                  )}
                  <div className="stu-row">
                    <span className="stu-row-label">Contacto</span>
                    <span className="stu-row-value">{s.phone || '—'}</span>
                  </div>
                  {s.address && (
                    <div className="stu-row">
                      <span className="stu-row-label">Dirección</span>
                      <span className="stu-row-value">{s.address}</span>
                    </div>
                  )}
                </div>
                <div className="stu-card-actions">
                  <button
                    type="button"
                    className="stu-btn stu-btn-edit"
                    onClick={() => handleEdit(s)}
                    disabled={!canEdit()}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="stu-btn stu-btn-del"
                    onClick={() => handleDelete(s.id, `${s.name} ${s.lastname}`)}
                    disabled={!canDelete()}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StudentsView