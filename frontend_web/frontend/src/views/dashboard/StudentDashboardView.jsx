// frontend_web/frontend/src/views/dashboard/StudentDashboardView.jsx
// ====================================================
// VISTA: DASHBOARD DEL ESTUDIANTE (ROL USER)
// Recibe "activeTab" para mostrar una seccion a la vez,
// igual que el panel de administracion.
// ====================================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import useAuth from '../../hooks/useAuth';
import TournamentModel from '../../models/TournamentModel';
import ScheduleModel from '../../models/ScheduleModel';
import PageHeader from '../ui/PageHeader';
import Card from '../ui/Card';
import DashboardStats from './DashboardStats';
import { IconTrophy, IconClock, IconCheckCircle } from '../layouts/NavIcons';

const StudentDashboardView = ({ activeTab = 'dashboard' }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [myTournaments, setMyTournaments] = useState([]);
    const [mySchedules, setMySchedules] = useState([]);

    if (!currentUser) {
        return (
            <div>
                <PageHeader
                    title="Sesión no disponible"
                    description="La información del estudiante aún no está cargada."
                />
                <Card>
                    <p style={{ color: 'var(--sporting-text-muted)', margin: 0 }}>
                        Intenta recargar la página o volver a iniciar sesión.
                    </p>
                </Card>
            </div>
        );
    }

    const normalizeStudentId = (value) => Number(value ?? 0);

    const isCurrentStudentInTournament = (tournament) => {
        if (!tournament) return false;
        const students = Array.isArray(tournament.students) ? tournament.students : [];
        const currentId = normalizeStudentId(currentUser?.id);

        return students.some((student) => {
            const studentId = normalizeStudentId(student?.id ?? student?.user_id ?? student?.student_id);
            const sameName = (
                student?.name === currentUser?.name &&
                student?.lastname === currentUser?.lastname
            );

            return studentId === currentId || sameName;
        });
    };

    const matchesCategory = (schedule) => {
        if (!schedule) return false;
        const scheduleCategory = schedule.id_category ?? schedule.category_id ?? schedule.categoryId;
        const currentCategory = currentUser?.category_id ?? currentUser?.categoryId;

        if (scheduleCategory !== undefined && currentCategory !== undefined) {
            return Number(scheduleCategory) === Number(currentCategory);
        }

        return true;
    };

    useEffect(() => {
        const fetchStudentData = async () => {
            setLoading(true);
            setError(null);
            try {
                const tournamentsResult = await TournamentModel.getAllTournaments();
                if (tournamentsResult.success) {
                    const userTournaments = (Array.isArray(tournamentsResult.data) ? tournamentsResult.data : []).filter(
                        (tournament) => isCurrentStudentInTournament(tournament)
                    );
                    setMyTournaments(userTournaments);
                }

                const schedulesResult = await ScheduleModel.getAllSchedules();
                if (schedulesResult.success) {
                    const userSchedules = (Array.isArray(schedulesResult.data) ? schedulesResult.data : []).filter(
                        (schedule) => matchesCategory(schedule)
                    );
                    setMySchedules(userSchedules);
                }
            } catch (err) {
                setError('No se pudieron cargar los datos del estudiante');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchStudentData();
        }
    }, [currentUser]);

    const activeTournaments = myTournaments.filter((t) => (t.status || 'Activo') === 'Activo').length;

    if (loading) {
        return <p style={{ color: 'var(--sporting-text-muted)' }}>Cargando información del estudiante...</p>;
    }

    if (error) {
        return <p style={{ color: '#dc3545' }}>Error: {error}</p>;
    }

    // ============================================
    // MI PANEL — resumen general
    // ============================================
    if (activeTab === 'profile') {
        return (
            <div>
                <PageHeader
                    title="Mi Perfil"
                    description="Resumen de tu información personal y deportiva."
                />
                <Card>
                    <div className="ui-account-row">
                        <span className="label">Nombre</span>
                        <span className="value">{currentUser?.name} {currentUser?.lastname}</span>
                    </div>
                    <div className="ui-account-row">
                        <span className="label">Email</span>
                        <span className="value">{currentUser?.email}</span>
                    </div>
                    <div className="ui-account-row">
                        <span className="label">Teléfono</span>
                        <span className="value">{currentUser?.phone || 'No registrado'}</span>
                    </div>
                    <div className="ui-account-row">
                        <span className="label">Categoría (Año)</span>
                        <span className="value">{currentUser?.category_id || 'Sin asignar'}</span>
                    </div>
                    <div className="ui-account-row">
                        <span className="label">Rol</span>
                        <span className="badge-sporting badge-sporting-user">Estudiante</span>
                    </div>
                    <button
                        type="button"
                        className="btn-sporting-secondary"
                        onClick={() => navigate(ROUTES.CHANGE_PASSWORD)}
                        style={{ marginTop: 12, width: '100%' }}
                    >
                        Cambiar contraseña
                    </button>
                </Card>
            </div>
        );
    }

    if (activeTab === 'schedules') {
        return (
            <div>
                <PageHeader
                    title="Mis Horarios de Entrenamiento"
                    description="Consulta los días y horas de práctica para tu categoría."
                />
                <Card>
                    {mySchedules.length === 0 ? (
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <p style={{ color: 'var(--sporting-text-muted)', fontStyle: 'italic', fontSize: '13.5px', margin: 0 }}>
                                Aún no tienes horarios asignados.
                            </p>
                            <span style={{ color: 'var(--sporting-text-muted)', fontSize: '12.5px' }}>
                                Tu categoría actual es {currentUser?.category_id || 'sin asignar'}.
                            </span>
                        </div>
                    ) : (
                        <ul className="ui-summary-list">
                            {mySchedules.map((schedule, index) => (
                                <li key={schedule.id || index}>
                                    <span className="dot" />
                                    <strong>{schedule.day_of_week || 'Día no definido'}</strong>
                                    &nbsp;— {schedule.start_time || '00:00'} a {schedule.end_time || '00:00'}
                                    {schedule.field_name && ` · ${schedule.field_name}`}
                                    {schedule.id_category && ` · Cat. ${schedule.id_category}`}
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>
        );
    }

    if (activeTab === 'tournaments') {
        return (
            <div>
                <PageHeader
                    title="Mis Torneos"
                    description="Lista de torneos en los que participas."
                />
                <Card>
                    {myTournaments.length === 0 ? (
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <p style={{ color: 'var(--sporting-text-muted)', fontStyle: 'italic', fontSize: '13.5px', margin: 0 }}>
                                No estás inscrito en ningún torneo actualmente.
                            </p>
                            <span style={{ color: 'var(--sporting-text-muted)', fontSize: '12.5px' }}>
                                Puedes inscribirte desde la sección de torneos del administrador o desde un torneo disponible.
                            </span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {myTournaments.map((tournament) => (
                                <div key={tournament.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '10px 0', borderBottom: '1px solid var(--sporting-border)', gap: '12px'
                                }}>
                                    <div>
                                        <strong style={{ color: 'var(--sporting-text)' }}>{tournament.name}</strong>
                                        <div style={{ fontSize: '12.5px', color: 'var(--sporting-text-muted)' }}>
                                            Categoría: {tournament.category || 'N/A'} · Participantes: {(tournament.students || []).length}
                                        </div>
                                    </div>
                                    <span className="badge-sporting badge-sporting-admin">
                                        {tournament.status || 'Activo'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        );
    }

    // ============================================
    // MI PANEL (dashboard) — resumen general, por defecto
    // ============================================
    return (
        <div>
            <PageHeader
                title={`Bienvenido, ${currentUser?.name || 'Estudiante'}`}
                description="Este es tu panel de control. Aquí puedes ver tu información y actividades."
            />

            <DashboardStats
                items={[
                    { label: 'Mis Horarios', value: mySchedules.length, icon: IconClock },
                    { label: 'Mis Torneos', value: myTournaments.length, icon: IconTrophy },
                    { label: 'Torneos Activos', value: activeTournaments, icon: IconCheckCircle }
                ]}
            />

            <Card title="Cuenta">
                <div className="ui-account-row">
                    <span className="label">Usuario</span>
                    <span className="value">{currentUser?.email}</span>
                </div>
                <div className="ui-account-row">
                    <span className="label">Rol</span>
                    <span className="badge-sporting badge-sporting-user">Estudiante</span>
                </div>
            </Card>
        </div>
    );
};

export default StudentDashboardView;