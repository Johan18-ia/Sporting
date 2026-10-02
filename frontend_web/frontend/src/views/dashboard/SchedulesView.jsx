// src/views/dashboard/SchedulesView.jsx
// Horarios — diseño alineado al móvil (días + timeline), estándares web
import React, { useState, useEffect, useMemo } from 'react'
import ScheduleModel from '../../models/ScheduleModel'
import CategoryModel from '../../models/CategoryModel'
import AlertMessage from '../common/AlertMessage'
import PageHeader from '../ui/PageHeader'
import Button from '../ui/Button'
import '../../styles/Schedules.css'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const DAY_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const getTodayDayName = () => {
  const map = [6, 0, 1, 2, 3, 4, 5]
  return DAYS[map[new Date().getDay()]]
}

const SchedulesView = () => {
  const [schedules, setSchedules] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState('')
  const [selectedDay, setSelectedDay] = useState(getTodayDayName())
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
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      setFormData({
        id_category: '',
        day_of_week: selectedDay || 'Lunes',
        start_time: '08:00',
        end_time: '10:00'
      })
      if (formData.day_of_week) setSelectedDay(formData.day_of_week)
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

  const filteredByCategory = useMemo(() => {
    return filterCategory
      ? schedules.filter((s) => String(s.id_category) === String(filterCategory))
      : schedules
  }, [schedules, filterCategory])

  const daySchedules = useMemo(() => {
    return filteredByCategory
      .filter((s) => s.day_of_week === selectedDay)
      .slice()
      .sort((a, b) => String(a.start_time).localeCompare(String(b.start_time)))
  }, [filteredByCategory, selectedDay])

  const countByDay = (day) =>
    filteredByCategory.filter((s) => s.day_of_week === day).length

  const catLabel = (s) =>
    s.category_name ||
    categories.find((c) => c.id === s.id_category)?.category_year ||
    categories.find((c) => c.id === s.id_category)?.name_year ||
    `Categoría ${s.id_category}`

  return (
    <div className="sch-page">
      <PageHeader
        title="Horarios de Entrenamiento"
        description="Organiza los entrenamientos por día y categoría"
        actions={
          <Button
            onClick={() => {
              if (showForm) {
                setShowForm(false)
              } else {
                setFormData({
                  id_category: '',
                  day_of_week: selectedDay || 'Lunes',
                  start_time: '08:00',
                  end_time: '10:00'
                })
                setShowForm(true)
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
        <div className="sch-form-card">
          <h3 className="sch-form-title">Asignar horario</h3>
          <form onSubmit={handleSubmit}>
            <div className="sch-form-grid">
              <div className="ui-field">
                <label>Categoría *</label>
                <select
                  name="id_category"
                  value={formData.id_category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category_year || cat.name_year}
                      {cat.description ? ` — ${cat.description}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ui-field">
                <label>Día *</label>
                <div className="sch-day-options">
                  {DAYS.map((d, i) => (
                    <button
                      key={d}
                      type="button"
                      className={`sch-day-opt ${
                        formData.day_of_week === d ? 'is-active' : ''
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, day_of_week: d }))
                      }
                    >
                      {DAY_SHORT[i]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ui-field">
                <label>Hora inicio *</label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ui-field">
                <label>Hora fin *</label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Asignar horario'}
            </Button>
          </form>
        </div>
      )}

      <div className="sch-filter-row">
        <span className="sch-filter-label">Categoría</span>
        <div className="sch-filter-chips">
          <button
            type="button"
            className={`sch-filter-chip ${!filterCategory ? 'is-active' : ''}`}
            onClick={() => setFilterCategory('')}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`sch-filter-chip ${
                String(filterCategory) === String(cat.id) ? 'is-active' : ''
              }`}
              onClick={() =>
                setFilterCategory(
                  String(filterCategory) === String(cat.id) ? '' : String(cat.id)
                )
              }
            >
              {cat.category_year || cat.name_year}
            </button>
          ))}
        </div>
      </div>

      <div className="sch-days-row">
        {DAYS.map((day, i) => {
          const active = selectedDay === day
          const count = countByDay(day)
          return (
            <button
              key={day}
              type="button"
              className={`sch-day-pill ${active ? 'is-active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              <span className="sch-day-pill-short">{DAY_SHORT[i]}</span>
              <span className="sch-day-pill-count">
                {count} {count === 1 ? 'sesión' : 'sesiones'}
              </span>
            </button>
          )
        })}
      </div>

      <div className="sch-timeline-card">
        <div className="sch-timeline-header">
          <h3 className="sch-timeline-title">{selectedDay}</h3>
          <span className="sch-timeline-meta">
            {daySchedules.length} horario
            {daySchedules.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading && schedules.length === 0 ? (
          <p className="sch-empty">Cargando horarios...</p>
        ) : daySchedules.length === 0 ? (
          <div className="sch-empty-box">
            <div className="sch-empty-icon">⏱</div>
            <p className="sch-empty-title">Sin horarios este día</p>
            <p className="sch-empty-text">
              Asigna un entrenamiento para {selectedDay} con el botón superior.
            </p>
          </div>
        ) : (
          <div className="sch-timeline">
            {daySchedules.map((s, index) => {
              const isLast = index === daySchedules.length - 1
              return (
                <div key={s.id} className="sch-timeline-row">
                  <div className="sch-time-col">
                    <span className="sch-time-start">{s.start_time}</span>
                    <span className="sch-time-end">{s.end_time}</span>
                  </div>

                  <div className="sch-line-col">
                    <span className="sch-dot" />
                    {!isLast && <span className="sch-line" />}
                  </div>

                  <div className="sch-event-card">
                    <div className="sch-event-body">
                      <span className="sch-event-cat">{catLabel(s)}</span>
                      <span className="sch-event-range">
                        {s.start_time} — {s.end_time}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="sch-event-delete"
                      onClick={() => handleDelete(s.id)}
                      title="Eliminar horario"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default SchedulesView