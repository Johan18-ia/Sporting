// src/views/dashboard/ReportsView.jsx
// ====================================================
// VISTA: REPORTES
// ----------------------------------------------------
// Genera archivos descargables a partir de los datos que ya
// existen en el sistema, reutilizando los mismos modelos que
// usan UsersView, StudentsView, CategoriesView, etc. — no se
// inventa ninguna llamada nueva a la API.
//
// A proposito NO usa la libreria "xlsx": genera el archivo en
// formato CSV con JavaScript puro (sin instalar nada), y Excel
// lo abre perfectamente con solo hacer doble clic. Esto evita
// depender de una instalacion de npm que venia dando problemas.
// ====================================================
import React, { useState } from 'react'
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
import { IconUsers, IconGraduate, IconTag, IconClock, IconTrophy, IconBag, IconShield } from '../layouts/NavIcons'

// Cada reporte reutiliza el modelo que ya usa la vista correspondiente.
const REPORTS = [
    { id: 'users', label: 'Usuarios', icon: IconUsers, fetcher: () => UserModel.getAllUsers() },
    { id: 'students', label: 'Estudiantes', icon: IconGraduate, fetcher: () => StudentModel.getAllStudents() },
    { id: 'categories', label: 'Categorías', icon: IconTag, fetcher: () => CategoryModel.getAllCategories() },
    { id: 'schedules', label: 'Horarios', icon: IconClock, fetcher: () => ScheduleModel.getAllSchedules() },
    { id: 'tournaments', label: 'Torneos', icon: IconTrophy, fetcher: () => TournamentModel.getAllTournaments() },
    { id: 'products', label: 'Productos', icon: IconBag, fetcher: () => ProductModel.getAllProducts() },
    { id: 'teams', label: 'Equipos', icon: IconShield, fetcher: () => TeamModel.getAllTeams() },
]

// ============================================
// Convierte un array de objetos a texto CSV, sin librerias.
// ============================================
const arrayToCSV = (data) => {
    if (!data || data.length === 0) return ''

    // Columnas: union de todas las llaves que aparezcan en los registros
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

// ============================================
// Descarga el CSV como archivo, sin librerias.
// El BOM (\uFEFF) al inicio hace que Excel muestre bien
// las tildes y la "ñ" en vez de caracteres raros.
// ============================================
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
            } else {
                setMessage({ type: 'error', text: `No se pudo generar el reporte de ${report.label}` })
                setTimeout(() => setMessage(null), 3500)
            }
        } catch (err) {
            setMessage({ type: 'error', text: `Ocurrió un error generando el reporte de ${report.label}` })
            setTimeout(() => setMessage(null), 3500)
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div>
            <PageHeader
                title="Reportes"
                description="Descarga la información del sistema en un archivo compatible con Excel."
            />

            {message && (
                <AlertMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '18px' }}>
                {REPORTS.map((report) => {
                    const Icon = report.icon
                    return (
                        <div key={report.id} className="ui-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div className="stat-card-icon"><Icon /></div>
                                <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--sporting-text)' }}>{report.label}</h3>
                            </div>
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => handleExport(report)}
                                disabled={loadingId !== null}
                            >
                                {loadingId === report.id ? 'Generando...' : 'Descargar Excel'}
                            </Button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ReportsView