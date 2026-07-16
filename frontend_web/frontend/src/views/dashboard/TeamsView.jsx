// src/views/dashboard/TeamsView.jsx
import React, { useState, useEffect } from 'react'
import StudentModel from '../../models/StudentModel'
import TeamModel from '../../models/TeamModel'
import AlertMessage from '../common/AlertMessage'
import PageHeader from '../ui/PageHeader'
import Card from '../ui/Card'
import Button from '../ui/Button'


const MIN_MEMBERS = 4

const emptyForm = { name: '', description: '', studentIds: [] }

const TeamsView = () => {
    const [teams, setTeams] = useState([])
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingTeam, setEditingTeam] = useState(null)
    const [formData, setFormData] = useState(emptyForm)
    const [studentSearch, setStudentSearch] = useState('')

    const loadData = async () => {
        setLoading(true)
        const [teamsRes, studentsRes] = await Promise.all([
            TeamModel.getAllTeams(),
            StudentModel.getAllStudents()
        ])
        if (teamsRes.success) setTeams(teamsRes.data)
        if (studentsRes.success) setStudents(studentsRes.data)
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    const studentsById = students.reduce((acc, s) => {
        acc[s.id] = s
        return acc
    }, {})

    const toggleStudent = (id) => {
        setFormData(prev => {
            const isSelected = prev.studentIds.includes(id)
            return {
                ...prev,
                studentIds: isSelected
                    ? prev.studentIds.filter(sid => sid !== id)
                    : [...prev.studentIds, id]
            }
        })
    }

    const openNewForm = () => {
        setEditingTeam(null)
        setFormData(emptyForm)
        setStudentSearch('')
        setShowForm(true)
    }

    const openEditForm = (team) => {
        setEditingTeam(team)
        setFormData({
            name: team.name,
            description: team.description,
            studentIds: [...team.studentIds]
        })
        setStudentSearch('')
        setShowForm(true)
    }

    const closeForm = () => {
        setShowForm(false)
        setEditingTeam(null)
        setFormData(emptyForm)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.studentIds.length < MIN_MEMBERS) {
            setMessage({ type: 'error', text: `Selecciona al menos ${MIN_MEMBERS} estudiantes para el equipo` })
            setTimeout(() => setMessage(null), 3500)
            return
        }

        const payload = {
            name: formData.name,
            description: formData.description,
            studentIds: formData.studentIds
        }

        const result = editingTeam
            ? await TeamModel.updateTeam(editingTeam.id, payload)
            : await TeamModel.createTeam(payload)

        if (result.success) {
            setMessage({ type: 'success', text: editingTeam ? 'Equipo actualizado exitosamente' : 'Equipo creado exitosamente' })
            closeForm()
            loadData()
        } else {
            setMessage({ type: 'error', text: result.message })
        }
        setTimeout(() => setMessage(null), 3500)
    }

    const handleDelete = async (team) => {
        if (window.confirm(`¿Eliminar el equipo "${team.name}"?`)) {
            await TeamModel.deleteTeam(team.id)
            setMessage({ type: 'success', text: 'Equipo eliminado' })
            loadData()
            setTimeout(() => setMessage(null), 3500)
        }
    }

    const filteredStudents = students.filter(s => {
        const term = studentSearch.toLowerCase()
        return (
            s.name?.toLowerCase().includes(term) ||
            s.lastname?.toLowerCase().includes(term) ||
            s.document?.includes(term)
        )
    })

    return (
        <div>
            <PageHeader
                title="Equipos"
                description="Arma equipos con los estudiantes de la escuela (mínimo 4 integrantes por equipo)."
                actions={<Button onClick={openNewForm}>{showForm ? '✕ Cancelar' : '+ Nuevo Equipo'}</Button>}
            />

            {message && (
                <AlertMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
            )}

            {showForm && (
                <Card title={editingTeam ? 'Editar Equipo' : 'Nuevo Equipo'}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 15px' }}>
                            <div className="ui-field">
                                <label>Nombre del Equipo</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Los Halcones"
                                    required
                                />
                            </div>
                            <div className="ui-field">
                                <label>Descripción</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Ej: Equipo de la categoría 2014"
                                />
                            </div>
                        </div>

                        <div className="ui-field">
                            <label>
                                Seleccionar Estudiantes ({formData.studentIds.length} seleccionados — mínimo {MIN_MEMBERS})
                            </label>
                            <input
                                type="text"
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                                placeholder="Buscar por nombre o documento..."
                                style={{ marginBottom: '10px' }}
                            />
                            <div className="team-student-picker">
                                {filteredStudents.length === 0 ? (
                                    <p style={{ color: 'var(--sporting-text-muted)', fontSize: '13.5px', padding: '10px' }}>
                                        No hay estudiantes que coincidan.
                                    </p>
                                ) : (
                                    filteredStudents.map((s) => {
                                        const checked = formData.studentIds.includes(s.id)
                                        return (
                                            <label key={s.id} className={`team-student-item ${checked ? 'is-checked' : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => toggleStudent(s.id)}
                                                />
                                                <span>
                                                    <strong>{s.name} {s.lastname}</strong>
                                                    <small>{s.document}</small>
                                                </span>
                                            </label>
                                        )
                                    })
                                )}
                            </div>
                        </div>

                        <Button type="submit">{editingTeam ? 'Guardar Cambios' : 'Crear Equipo'}</Button>
                    </form>
                </Card>
            )}

            {loading && <p>Cargando equipos...</p>}

            {!loading && (
                teams.length === 0 ? (
                    <p style={{ color: 'var(--sporting-text-muted)', fontStyle: 'italic' }}>
                        Aún no se ha creado ningún equipo.
                    </p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {teams.map((team) => (
                            <div key={team.id} className="ui-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                                    <h3 className="ui-card-title" style={{ margin: 0 }}>{team.name}</h3>
                                    <span className="badge-sporting badge-sporting-admin">
                                        {team.studentIds.length} integrantes
                                    </span>
                                </div>
                                {team.description && (
                                    <p style={{ color: 'var(--sporting-text-muted)', fontSize: '13.5px', margin: '0 0 14px 0' }}>
                                        {team.description}
                                    </p>
                                )}

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                                    {team.studentIds.map((id) => {
                                        const student = studentsById[id]
                                        return (
                                            <span key={id} className="team-member-chip">
                                                {student ? `${student.name} ${student.lastname}` : 'Estudiante no encontrado'}
                                            </span>
                                        )
                                    })}
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Button variant="secondary" onClick={() => openEditForm(team)}>Editar</Button>
                                    <Button variant="danger" onClick={() => handleDelete(team)}>Eliminar</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    )
}

export default TeamsView