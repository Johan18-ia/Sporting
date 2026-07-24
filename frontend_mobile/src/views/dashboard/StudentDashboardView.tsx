// frontend_web/frontend/src/views/dashboard/StudentDashboardView.jsx
// ====================================================
// VISTA: DASHBOARD DEL ESTUDIANTE (ROL USER)
// Recibe "activeTab" para mostrar una seccion a la vez,
// igual que el panel de administracion.
// ====================================================
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import TournamentModel from '../../models/TournamentModel';
import ScheduleModel from '../../models/ScheduleModel';
import PageHeader from '../UI/PageHeader';
import Card from '../UI/Card';
import DashboardStats from './DashboardStats';
import { IconTrophy, IconClock, IconCheckCircle } from '../layouts/NavIcons';

interface TournamentItem { id: number; name: string; category?: string; max_teams?: number; status?: string; students?: Array<{ id?: number }> }
interface ScheduleItem { id?: number; day_of_week?: string; start_time?: string; end_time?: string; field_name?: string; id_category?: number }
interface UserProfile { id?: number; name?: string; lastname?: string; email?: string; phone?: string; category_id?: number; role?: string }

const StudentDashboardView = ({ activeTab = 'dashboard' }: { activeTab?: string }) => {
    // ============================================
    // LOGICA DE DATOS SIN CAMBIOS (se carga una sola vez,
    // se reutiliza en todas las secciones/pestañas)
    // ============================================
    const { currentUser } = useAuth() as { currentUser: UserProfile | null };
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [myTournaments, setMyTournaments] = useState<TournamentItem[]>([]);
    const [mySchedules, setMySchedules] = useState<ScheduleItem[]>([]);

    useEffect(() => {
        const fetchStudentData = async () => {
            setLoading(true);
            setError(null);
            try {
                const tournamentsResult = await TournamentModel.getAllTournaments();
                if (tournamentsResult.success && tournamentsResult.data) {
                    const userTournaments = tournamentsResult.data.filter((t: TournamentItem) =>
                        t.students && t.students.some((s) => s.id === currentUser?.id)
                    );
                    setMyTournaments(userTournaments);
                }

                const schedulesResult = await ScheduleModel.getAllSchedules();
                if (schedulesResult.success && schedulesResult.data) {
                    const userSchedules = schedulesResult.data.filter((s: ScheduleItem) =>
                        s.id_category === currentUser?.category_id
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

    const activeTournaments = myTournaments.filter(t => (t.status || 'Activo') === 'Activo').length;

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
                        <p style={{ color: 'var(--sporting-text-muted)', fontStyle: 'italic', fontSize: '13.5px' }}>
                            Aún no tienes horarios asignados.
                        </p>
                    ) : (
                        <ul className="ui-summary-list">
                            {mySchedules.map((schedule, index) => (
                                <li key={schedule.id || index}>
                                    <span className="dot" />
                                    <strong>{schedule.day_of_week}</strong>
                                    &nbsp;— {schedule.start_time} a {schedule.end_time}
                                    {schedule.field_name && ` · ${schedule.field_name}`}
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
                        <p style={{ color: 'var(--sporting-text-muted)', fontStyle: 'italic', fontSize: '13.5px' }}>
                            No estás inscrito en ningún torneo actualmente.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {myTournaments.map((tournament) => (
                                <div key={tournament.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '10px 0', borderBottom: '1px solid var(--sporting-border)'
                                }}>
                                    <div>
                                        <strong style={{ color: 'var(--sporting-text)' }}>{tournament.name}</strong>
                                        <div style={{ fontSize: '12.5px', color: 'var(--sporting-text-muted)' }}>
                                            Categoría: {tournament.category || 'N/A'} · Equipos: {tournament.max_teams || 'N/A'}
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