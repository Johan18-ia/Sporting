// src/views/dashboard/SchedulesView.jsx
import React, { useState, useEffect } from 'react'
import ScheduleModel from '../../models/ScheduleModel'
import CategoryModel from '../../models/CategoryModel'
import AlertMessage from '../common/AlertMessage'

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
    marginBottom: '20px'
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

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={{ color: '#333', margin: 0 }}>Horarios de Entrenamiento</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (!showForm) {
              setFormData({ id_category: '', day_of_week: 'Lunes', start_time: '08:00', end_time: '10:00' })
            }
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
          {showForm ? '✕ Cancelar' : '+ Asignar Horario'}
        </button>
      </div>

      {message && (
        <AlertMessage
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Asignar Horario</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Categoría *</label>
              <select
                name="id_category"
                value={formData.id_category}
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
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Día *</label>
              <select
                name="day_of_week"
                value={formData.day_of_week}
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
                {days.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Hora Inicio *</label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
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
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Hora Fin *</label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
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
          </div>
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
              marginTop: '15px',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Guardando...' : 'Asignar Horario'}
          </button>
        </form>
      )}

      <div style={filterStyles}>
        <label style={{ fontWeight: 500 }}>Filtrar por categoría:</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: '8px 15px',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '14px',
            background: 'white'
          }}
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.category_year || cat.name_year}
            </option>
          ))}
        </select>
        <span style={{ color: '#666', fontSize: '14px' }}>
          {filteredSchedules.length} horario(s)
        </span>
      </div>

      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={thStyles}>#</th>
            <th style={thStyles}>Categoría</th>
            <th style={thStyles}>Día</th>
            <th style={thStyles}>Horario</th>
            <th style={thStyles}>Acciones</th>
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
                <td style={tdStyles}>{index + 1}</td>
                <td style={tdStyles}>
                  <span style={{
                    background: '#8B0000',
                    color: 'white',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {s.category_name || `Categoría ${s.id_category}`}
                  </span>
                </td>
                <td style={tdStyles}>
                  <strong>{s.day_of_week}</strong>
                </td>
                <td style={tdStyles}>
                  {s.start_time} - {s.end_time}
                </td>
                <td style={tdStyles}>
                  <button
                    onClick={() => handleDelete(s.id)}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default SchedulesView