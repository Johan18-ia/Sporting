// src/views/dashboard/ReportsView.jsx
import React, { useState, useEffect, useMemo } from 'react'
import StudentModel from '../../models/StudentModel'
import CategoryModel from '../../models/CategoryModel'
import ScheduleModel from '../../models/ScheduleModel'
import TournamentModel from '../../models/TournamentModel'
import ProductModel from '../../models/ProductModel'
import UserModel from '../../models/UserModel'
import TeamModel from '../../models/TeamModel'
import PageHeader from '../ui/PageHeader'
import Button from '../ui/Button'
import AlertMessage from '../common/AlertMessage'
import {
  IconUsers, IconGraduate, IconTag, IconClock,
  IconTrophy, IconBag, IconShield
} from '../layouts/NavIcons'
import '../../styles/Reports.css'

const REPORTS = [
  { id: 'users', label: 'Usuarios', color: '#8B0000', icon: IconUsers, fetcher: () => UserModel.getAllUsers() },
  { id: 'students', label: 'Estudiantes', color: '#A52A2A', icon: IconGraduate, fetcher: () => StudentModel.getAllStudents() },
  { id: 'categories', label: 'Categorías', color: '#B22222', icon: IconTag, fetcher: () => CategoryModel.getAllCategories() },
  { id: 'schedules', label: 'Horarios', color: '#C41E3A', icon: IconClock, fetcher: () => ScheduleModel.getAllSchedules() },
  { id: 'tournaments', label: 'Torneos', color: '#8B4513', icon: IconTrophy, fetcher: () => TournamentModel.getAllTournaments() },
  { id: 'products', label: 'Productos', color: '#A0522D', icon: IconBag, fetcher: () => ProductModel.getAllProducts() },
  { id: 'teams', label: 'Equipos', color: '#6B2D2D', icon: IconShield, fetcher: () => TeamModel.getAllTeams() }
]

const arrayToCSV = (data) => {
  if (!data || data.length === 0) return ''
  const headers = Array.from(
    data.reduce((set, row) => {
      Object.keys(row || {}).forEach((key) => set.add(key))
      return set
    }, new Set())
  )
  const escapeCell = (value) => {
    if (value === null || value === undefined) return ''
    const str = typeof value === 'object' ? JSON.stringify(value) : String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }
  const headerRow = headers.map(escapeCell).join(',')
  const dataRows = data.map((row) => headers.map((h) => escapeCell(row[h])).join(','))
  return [headerRow, ...dataRows].join('\n')
}

const downloadCSV = (data, filename) => {
  const csv = arrayToCSV(data)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const todayStamp = () => new Date().toISOString().slice(0, 10)

const ReportsView = () => {
  const [loadingId, setLoadingId] = useState(null)
  const [message, setMessage] = useState(null)
  const [counts, setCounts] = useState({})
  const [loadingStats, setLoadingStats] = useState(true)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true)
      try {
        const results = await Promise.allSettled(REPORTS.map((r) => r.fetcher()))
        const next = {}
        results.forEach((res, i) => {
          const id = REPORTS[i].id
          if (res.status === 'fulfilled' && res.value?.success) {
            next[id] = Array.isArray(res.value.data) ? res.value.data.length : 0
          } else {
            next[id] = 0
          }
        })
        setCounts(next)
      } catch { /* */ } finally {
        setLoadingStats(false)
      }
    }
    loadStats()
  }, [])

  const totalRecords = useMemo(
    () => Object.values(counts).reduce((a, b) => a + b, 0),
    [counts]
  )
  const maxCount = useMemo(() => Math.max(...Object.values(counts), 1), [counts])

  const handleExport = async (report) => {
    setLoadingId(report.id)
    try {
      const result = await report.fetcher()
      if (result.success) {
        if (!result.data || result.data.length === 0) {
          setMessage({ type: 'error', text: `No hay datos de ${report.label} para exportar todavía` })
          setTimeout(() => setMessage(null), 3500)
          return
        }
        downloadCSV(result.data, `${report.label}_Sporting_${todayStamp()}.csv`)
        setMessage({ type: 'success', text: `Reporte de ${report.label} descargado` })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: `No se pudo generar el reporte de ${report.label}` })
        setTimeout(() => setMessage(null), 3500)
      }
    } catch {
      setMessage({ type: 'error', text: `Ocurrió un error generando el reporte de ${report.label}` })
      setTimeout(() => setMessage(null), 3500)
    } finally {
      setLoadingId(null)
    }
  }

  const selected = REPORTS.find((r) => r.id === selectedId) || null
  const selectedCount = selected ? counts[selected.id] || 0 : 0
  const selectedPct = totalRecords > 0 ? Math.round((selectedCount / totalRecords) * 100) : 0

  if (selected) {
    const Icon = selected.icon
    return (
      <div className="rep-page">
        <PageHeader
          title={selected.label}
          description="Detalle del reporte y descarga"
          actions={
            <Button variant="secondary" onClick={() => setSelectedId(null)}>
              ← Volver
            </Button>
          }
        />
        {message && (
          <AlertMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
        )}

        <div className="rep-chart-card">
          <div className="rep-chart-head">
            <div className="rep-chart-icon" style={{ background: `${selected.color}18`, color: selected.color }}>
              <Icon />
            </div>
            <div>
              <h3 className="rep-chart-title">Distribución en el sistema</h3>
              <p className="rep-chart-sub">
                {selectedCount} registro{selectedCount !== 1 ? 's' : ''} · {selectedPct}% del total
              </p>
            </div>
          </div>

          <div className="rep-bars">
            {REPORTS.map((r) => {
              const c = counts[r.id] || 0
              const pct = Math.round((c / maxCount) * 100)
              const share = totalRecords > 0 ? Math.round((c / totalRecords) * 100) : 0
              return (
                <div key={r.id} className={`rep-bar-row ${r.id === selected.id ? 'is-active' : ''}`}>
                  <div className="rep-bar-label">
                    <span className="rep-bar-dot" style={{ background: r.color }} />
                    {r.label}
                  </div>
                  <div className="rep-bar-track">
                    <div className="rep-bar-fill" style={{ width: `${pct}%`, background: r.color }} />
                  </div>
                  <div className="rep-bar-value">
                    <strong>{loadingStats ? '—' : c}</strong>
                    <span>{share}%</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="rep-dist-track">
            {REPORTS.map((r) => {
              const c = counts[r.id] || 0
              if (!totalRecords || c === 0) return null
              return (
                <div
                  key={r.id}
                  className="rep-dist-seg"
                  style={{ width: `${(c / totalRecords) * 100}%`, background: r.color }}
                  title={`${r.label}: ${c}`}
                />
              )
            })}
          </div>
        </div>

        <div className="rep-stats-row">
          <div className="rep-stat-box">
            <span className="rep-stat-value">{selectedCount}</span>
            <span className="rep-stat-label">Total {selected.label.toLowerCase()}</span>
          </div>
          <div className="rep-stat-box">
            <span className="rep-stat-value">{selectedPct}%</span>
            <span className="rep-stat-label">Del sistema</span>
          </div>
          <div className="rep-stat-box">
            <span className="rep-stat-value">{totalRecords}</span>
            <span className="rep-stat-label">Registros globales</span>
          </div>
        </div>

        <div className="rep-download-wrap">
          <Button onClick={() => handleExport(selected)} disabled={loadingId !== null}>
            {loadingId === selected.id ? 'Generando...' : 'Descargar Excel (CSV)'}
          </Button>
          <p className="rep-download-hint">Archivo CSV compatible con Excel y Hojas de cálculo.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rep-page">
      <PageHeader
        title="Reportes"
        description="Selecciona un módulo para ver su gráfica y descargar el Excel"
      />
      {message && (
        <AlertMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
      )}

      <div className="rep-list-panel">
        <h3 className="rep-list-panel-title">Exportar por módulo</h3>
        <div className="rep-list-grid">
          {REPORTS.map((report) => {
            const Icon = report.icon
            const count = counts[report.id] ?? 0
            return (
              <button
                key={report.id}
                type="button"
                className="rep-list-item"
                onClick={() => setSelectedId(report.id)}
              >
                <span
                  className="rep-list-icon"
                  style={{ background: `${report.color}22`, color: report.color }}
                >
                  <Icon />
                </span>
                <span className="rep-list-info">
                  <span className="rep-list-label">{report.label}</span>
                  <span className="rep-list-count">
                    {loadingStats ? '…' : `${count} registro${count !== 1 ? 's' : ''}`}
                  </span>
                </span>
                <span className="rep-list-chevron">›</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ReportsView