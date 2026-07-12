// src/views/dashboard/SchedulesView.jsx
import React, { useState, useEffect } from 'react'
import ScheduleModel from '../../models/ScheduleModel'
import CategoryModel from '../../models/CategoryModel'
import AlertMessage from '../common/AlertMessage'
import PageHeader from '../ui/PageHeader'
import Card from '../ui/Card'
import Table from '../ui/Table'
import Button from '../ui/Button'

const SchedulesView = () => {
  // ============================================
  // LOGICA SIN CAMBIOS
  // ============================================
  const [schedules, setSchedules] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState('')
  const [formData, setFormData] = useState({
    id_category: '',
    day_of_week: 'Lunes',
    start_time: '08:00',
    end_time: '10:00'
  })

  const loadData = async () => {
    setLoading(true)
    const [schedulesRes, categoriesRes] = await Promise.all([
      ScheduleModel.getAllSchedules(),
      CategoryModel.getAllCategories()
    ])

    if (schedulesRes.success) setSchedules(schedulesRes.data)
    if (categoriesRes.success) setCategories(categoriesRes.data)

    if (!schedulesRes.success || !categoriesRes.success) {
      setError('Error al cargar datos')
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.id_category || !formData.day_of_week) {
      setMessage({ type: 'error', text: 'Complete todos los campos' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setLoading(true)
    const result = await ScheduleModel.createSchedule(formData)

    if (result.success) {
      setMessage({ type: 'success', text: 'Horario asignado exitosamente' })
      setShowForm(false)
      setFormData({ id_category: '', day_of_week: 'Lunes', start_time: '08:00', end_time: '10:00' })
      loadData()
    } else {
      setMessage({ type: 'error', text: result.error })
    }
    setLoading(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este horario?')) {
      const result = await ScheduleModel.deleteSchedule(id)
      if (result.success) {
        setMessage({ type: 'success', text: 'Horario eliminado' })
        loadData()
      } else {
        setMessage({ type: 'error', text: result.error })
      }
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const filteredSchedules = filterCategory
    ? schedules.filter(s => s.id_category === parseInt(filterCategory))
    : schedules

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

  // ============================================
  // PRESENTACION — unica parte que cambia
  // ============================================
  return (
    <div>
      <PageHeader
        title="Horarios de Entrenamiento"
        actions={
          <Button
            onClick={() => {
              setShowForm(!showForm)
              if (!showForm) {
                setFormData({ id_category: '', day_of_week: 'Lunes', start_time: '08:00', end_time: '10:00' })
              }
            }}
          >
            {showForm ? '✕ Cancelar' : '+ Asignar Horario'}
          </Button>
        }
      />

      {message && (
        <AlertMessage
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      {showForm && (
        <Card title="Asignar Horario">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 15px' }}>
              <div className="ui-field">
                <label>Categoría *</label>
                <select name="id_category" value={formData.id_category} onChange={handleChange} required>
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category_year || cat.name_year} - {cat.description || ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ui-field">
                <label>Día *</label>
                <select name="day_of_week" value={formData.day_of_week} onChange={handleChange} required>
                  {days.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="ui-field">
                <label>Hora Inicio *</label>
                <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required />
              </div>
              <div className="ui-field">
                <label>Hora Fin *</label>
                <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Asignar Horario'}
            </Button>
          </form>
        </Card>
      )}

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <label style={{ fontWeight: 500, fontSize: '13.5px', color: 'var(--sporting-text-muted)' }}>Filtrar por categoría:</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: '8px 15px', border: '1px solid #ccc', borderRadius: 'var(--sporting-radius)', fontSize: '14px' }}
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.category_year || cat.name_year}
            </option>
          ))}
        </select>
        <span style={{ color: 'var(--sporting-text-muted)', fontSize: '13.5px' }}>
          {filteredSchedules.length} horario(s)
        </span>
      </div>

      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Categoría</th>
            <th>Día</th>
            <th>Horario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredSchedules.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                No hay horarios registrados
              </td>
            </tr>
          ) : (
            filteredSchedules.map((s, index) => (
              <tr key={s.id}>
                <td>{index + 1}</td>
                <td>
                  <span className="badge-sporting badge-sporting-admin">
                    {s.category_name || `Categoría ${s.id_category}`}
                  </span>
                </td>
                <td><strong>{s.day_of_week}</strong></td>
                <td>{s.start_time} - {s.end_time}</td>
                <td>
                  <Button variant="danger" onClick={() => handleDelete(s.id)}>🗑️</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default SchedulesView