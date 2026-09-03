// src/views/dashboard/SchedulesView.jsx
import React, { useState, useEffect } from 'react'
import ScheduleModel from '../../models/ScheduleModel'
import CategoryModel from '../../models/CategoryModel'
import AlertMessage from '../common/AlertMessage'
import PageHeader from '../ui/PageHeader'
import Card from '../ui/Card'
import Button from '../ui/Button'

const SchedulesView = () => {
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
  const getDayColor = (day) => ({
    Lunes: '#2196F3',
    Martes: '#4CAF50',
    'Miércoles': '#FF9800',
    Jueves: '#9C27B0',
    Viernes: '#00BCD4',
    Sábado: '#8B0000',
    Domingo: '#DC3545'
  }[day] || '#666')

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

      <div className="panel-summary-grid">
        <div className="panel-summary-card">
          <div className="panel-summary-icon">H</div>
          <div className="panel-summary-meta">
            <span className="panel-summary-value">{schedules.length}</span>
            <span className="panel-summary-label">Horarios</span>
          </div>
        </div>
        <div className="panel-summary-card">
          <div className="panel-summary-icon">C</div>
          <div className="panel-summary-meta">
            <span className="panel-summary-value">{categories.length}</span>
            <span className="panel-summary-label">Categorías</span>
          </div>
        </div>
        <div className="panel-summary-card">
          <div className="panel-summary-icon">D</div>
          <div className="panel-summary-meta">
            <span className="panel-summary-value">{new Set(schedules.map((s) => s.day_of_week)).size}</span>
            <span className="panel-summary-label">Días</span>
          </div>
        </div>
      </div>

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

      <div className="ui-card" style={{ padding: '16px' }}>
        <div className="view-filter" style={{ marginBottom: '8px' }}>
          <label style={{ fontWeight: 500, fontSize: '13.5px', color: 'var(--sporting-text-muted)' }}>Filtrar por categoría:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="control-select"
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
      </div>

      {error && <p style={{ color: '#dc3545' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredSchedules.length === 0 ? (
          <div className="ui-card" style={{ textAlign: 'center', color: '#666', padding: '30px 20px' }}>
            No hay horarios registrados.
          </div>
        ) : (
          filteredSchedules.map((schedule) => (
            <div key={schedule.id} className="ui-card" style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: getDayColor(schedule.day_of_week), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                  {schedule.day_of_week?.substring(0, 2).toUpperCase() || 'D'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--sporting-text)' }}>{schedule.category_name || `Categoría ${schedule.id_category}`}</div>
                  <div style={{ fontSize: '13px', color: 'var(--sporting-text-muted)' }}>{schedule.day_of_week} · {schedule.start_time} - {schedule.end_time}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="badge-sporting badge-sporting-admin">{schedule.day_of_week}</span>
                <button className="btn-sporting-danger" type="button" onClick={() => handleDelete(schedule.id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SchedulesView