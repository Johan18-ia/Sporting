// src/views/dashboard/TournamentsView.jsx
import React, { useState, useEffect } from 'react'
import AlertMessage from '../common/AlertMessage'
import TournamentModel from '../../models/TournamentModel'

const TournamentsView = () => {
  const [tournaments, setTournaments] = useState([])
  const [teams, setTeams] = useState([
    { id: 1, nombre: 'Águilas FC', integrantes: ['Carlos P.', 'Andrés L.'] },
    { id: 2, nombre: 'Leones de Oro', integrantes: ['Juan G.', 'Mateo D.'] }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [showTournamentForm, setShowTournamentForm] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [tournamentForm, setTournamentForm] = useState({
    nombre: '',
    fecha: '',
    estado: 'Inscripciones Abiertas',
    enfrentamientos: []
  })
  const [teamForm, setTeamForm] = useState({
    nombre: '',
    integrantes: []
  })

  useEffect(() => {
    loadTournaments()
  }, [])

  const loadTournaments = async () => {
    setLoading(true)
    const result = await TournamentModel.getAllTournaments()
    if (result.success) {
      setTournaments(result.data)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleTournamentChange = (e) => {
    const { name, value } = e.target
    setTournamentForm(prev => ({ ...prev, [name]: value }))
  }

  const handleTournamentSubmit = (e) => {
    e.preventDefault()
    if (!tournamentForm.nombre || !tournamentForm.fecha) {
      setMessage({ type: 'error', text: 'Nombre y fecha son requeridos' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    const newTournament = {
      id: Date.now(),
      ...tournamentForm,
      enfrentamientos: tournamentForm.enfrentamientos || []
    }

    setTournaments([...tournaments, newTournament])
    setMessage({ type: 'success', text: 'Torneo creado exitosamente' })
    setShowTournamentForm(false)
    setTournamentForm({ nombre: '', fecha: '', estado: 'Inscripciones Abiertas', enfrentamientos: [] })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleTeamSubmit = (e) => {
    e.preventDefault()
    if (!teamForm.nombre) {
      setMessage({ type: 'error', text: 'Nombre del equipo es requerido' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    const newTeam = {
      id: Date.now(),
      ...teamForm
    }

    setTeams([...teams, newTeam])
    setMessage({ type: 'success', text: 'Equipo creado exitosamente' })
    setShowTeamForm(false)
    setTeamForm({ nombre: '', integrantes: [] })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDeleteTournament = (id, nombre) => {
    if (window.confirm(`¿Eliminar el torneo "${nombre}"?`)) {
      setTournaments(tournaments.filter(t => t.id !== id))
      setMessage({ type: 'success', text: 'Torneo eliminado' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDeleteTeam = (id, nombre) => {
    if (window.confirm(`¿Eliminar el equipo "${nombre}"?`)) {
      setTeams(teams.filter(t => t.id !== id))
      setMessage({ type: 'success', text: 'Equipo eliminado' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const containerStyles = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  }

  const sectionStyles = {
    marginBottom: '40px'
  }

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px'
  }

  const cardStyles = {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    marginBottom: '15px'
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

  const statusBadgeStyles = (status) => ({
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    background: status === 'Activo' ? '#10b981' :
                status === 'Inscripciones Abiertas' ? '#f59e0b' :
                status === 'Finalizado' ? '#6b7280' : '#3b82f6',
    color: 'white'
  })

  return (
    <div style={containerStyles}>
      {message && (
        <AlertMessage
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      {/* SECCIÓN TORNEOS */}
      <div style={sectionStyles}>
        <div style={headerStyles}>
          <h2 style={{ color: '#333', margin: 0 }}>🏆 Gestión de Torneos</h2>
          <button
            onClick={() => setShowTournamentForm(!showTournamentForm)}
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
            {showTournamentForm ? '✕ Cancelar' : '+ Crear Torneo'}
          </button>
        </div>

        {showTournamentForm && (
          <form onSubmit={handleTournamentSubmit} style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Nuevo Torneo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={tournamentForm.nombre}
                  onChange={handleTournamentChange}
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
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Fecha *</label>
                <input
                  type="text"
                  name="fecha"
                  value={tournamentForm.fecha}
                  onChange={handleTournamentChange}
                  placeholder="Ej: 15 de Mayo 2025"
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
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Estado</label>
                <select
                  name="estado"
                  value={tournamentForm.estado}
                  onChange={handleTournamentChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}
                >
                  <option value="Inscripciones Abiertas">Inscripciones Abiertas</option>
                  <option value="Activo">Activo</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'end' }}>
                <button
                  type="submit"
                  style={{
                    background: '#8B0000',
                    color: 'white',
                    border: 'none',
                    padding: '10px 30px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    width: '100%'
                  }}
                >
                  Crear Torneo
                </button>
              </div>
            </div>
          </form>
        )}

        <table style={tableStyles}>
          <thead>
            <tr>
              <th style={thStyles}>ID</th>
              <th style={thStyles}>Torneo</th>
              <th style={thStyles}>Fecha</th>
              <th style={thStyles}>Estado</th>
              <th style={thStyles}>Enfrentamientos</th>
              <th style={thStyles}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                  No hay torneos creados
                </td>
              </tr>
            ) : (
              tournaments.map((t) => (
                <tr key={t.id}>
                  <td style={tdStyles}>#{t.id}</td>
                  <td style={tdStyles}>
                    <strong>{t.nombre}</strong>
                  </td>
                  <td style={tdStyles}>{t.fecha}</td>
                  <td style={tdStyles}>
                    <span style={statusBadgeStyles(t.estado)}>
                      {t.estado}
                    </span>
                  </td>
                  <td style={tdStyles}>
                    {t.enfrentamientos && t.enfrentamientos.length > 0 ? (
                      t.enfrentamientos.map((enf, idx) => (
                        <div key={idx} style={{ fontSize: '13px' }}>
                          {enf.eq1} 🆚 {enf.eq2}
                        </div>
                      ))
                    ) : (
                      <span style={{ color: '#999' }}>Sin enfrentamientos</span>
                    )}
                  </td>
                  <td style={tdStyles}>
                    <button
                      onClick={() => handleDeleteTournament(t.id, t.nombre)}
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

      {/* SECCIÓN EQUIPOS */}
      <div style={sectionStyles}>
        <div style={headerStyles}>
          <h2 style={{ color: '#333', margin: 0 }}>⚽ Gestión de Equipos</h2>
          <button
            onClick={() => setShowTeamForm(!showTeamForm)}
            style={{
              background: '#2E7D32',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {showTeamForm ? '✕ Cancelar' : '+ Crear Equipo'}
          </button>
        </div>

        {showTeamForm && (
          <form onSubmit={handleTeamSubmit} style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Nuevo Equipo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Nombre del Equipo *</label>
                <input
                  type="text"
                  value={teamForm.nombre}
                  onChange={(e) => setTeamForm({ ...teamForm, nombre: e.target.value })}
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
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Integrantes</label>
                <input
                  type="text"
                  placeholder="Ej: Carlos P., Andrés L."
                  value={teamForm.integrantes.join(', ')}
                  onChange={(e) => setTeamForm({
                    ...teamForm,
                    integrantes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
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
              style={{
                background: '#2E7D32',
                color: 'white',
                border: 'none',
                padding: '10px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                marginTop: '15px'
              }}
            >
              Crear Equipo
            </button>
          </form>
        )}

        <table style={tableStyles}>
          <thead>
            <tr>
              <th style={thStyles}>ID</th>
              <th style={thStyles}>Equipo</th>
              <th style={thStyles}>Integrantes</th>
              <th style={thStyles}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                  No hay equipos creados
                </td>
              </tr>
            ) : (
              teams.map((t) => (
                <tr key={t.id}>
                  <td style={tdStyles}>#{t.id}</td>
                  <td style={tdStyles}>
                    <strong>{t.nombre}</strong>
                  </td>
                  <td style={tdStyles}>
                    {t.integrantes.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {t.integrantes.map((i, idx) => (
                          <span key={idx} style={{
                            background: '#f0f0f0',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}>
                            {i}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#999' }}>Sin integrantes</span>
                    )}
                  </td>
                  <td style={tdStyles}>
                    <button
                      onClick={() => handleDeleteTeam(t.id, t.nombre)}
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
    </div>
  )
}

export default TournamentsView