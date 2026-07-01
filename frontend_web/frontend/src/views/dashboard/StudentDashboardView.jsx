// frontend_web/frontend/src/views/dashboard/StudentDashboardView.jsx
// ====================================================
// VISTA: DASHBOARD DEL ESTUDIANTE (ROL USER)
// ====================================================
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
// Asumimos que estos modelos existen para obtener datos reales
// Si no existen, puedes simularlos con datos de ejemplo o adaptarlos.
import TournamentModel from '../../models/TournamentModel';
import ScheduleModel from '../../models/ScheduleModel';
// import UserModel from '../../models/UserModel'; // Para obtener detalles del perfil

const StudentDashboardView = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [myTournaments, setMyTournaments] = useState([]);
    const [mySchedules, setMySchedules] = useState([]);
    // const [userProfile, setUserProfile] = useState(null); // Para detalles del perfil

    // Obtener datos del estudiante
    useEffect(() => {
        const fetchStudentData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Obtener torneos en los que está inscrito (necesitarías un endpoint específico)
                // Por ahora, simulamos con TournamentModel.getAllTournaments() y filtramos.
                const tournamentsResult = await TournamentModel.getAllTournaments();
                if (tournamentsResult.success) {
                    // Filtrar torneos donde el usuario actual esté inscrito
                    // Asumiendo que cada torneo tiene un array 'students' con IDs
                    const userTournaments = tournamentsResult.data.filter(t =>
                        t.students && t.students.some(s => s.id === currentUser?.id)
                    );
                    setMyTournaments(userTournaments);
                }

                // 2. Obtener horarios del estudiante (necesitarías un endpoint)
                // Usando ScheduleModel.getAllSchedules() como ejemplo.
                const schedulesResult = await ScheduleModel.getAllSchedules();
                if (schedulesResult.success) {
                    // Filtrar horarios relacionados a la categoría del estudiante
                    // Asumiendo que el usuario tiene un campo category_id
                    const userSchedules = schedulesResult.data.filter(s =>
                        s.id_category === currentUser?.category_id
                    );
                    setMySchedules(userSchedules);
                }

                // 3. Obtener perfil detallado del usuario
                // const userResult = await UserModel.getUserById(currentUser.id);
                // if (userResult.success) setUserProfile(userResult.data);

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

    if (loading) {
        return <div className="workspace-scrollable-box">Cargando informacion del estudiante...</div>;
    }

    if (error) {
        return <div className="workspace-scrollable-box" style={{ color: '#dc3545' }}>Error: {error}</div>;
    }

    // ============================================
    // RENDERIZADO PRINCIPAL
    // ============================================
    return (
        <div className="workspace-scrollable-box animacion-aparecer">
            {/* ===== BANNER DE BIENVENIDA ===== */}
            <div className="dashboard-welcome-banner">
                <h2>Bienvenido, {currentUser?.name || 'Estudiante'}!</h2>
                <p>Este es tu panel de control. Aqui puedes ver tu informacion y actividades.</p>
            </div>

            {/* ===== INFORMACION DEL PERFIL ===== */}
            <div style={{ marginBottom: '30px' }}>
                <div className="section-title-container">
                    <h3>Mi Perfil</h3>
                    <p>Resumen de tu informacion personal y deportiva.</p>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px',
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                }}>
                    <div><strong>Nombre:</strong> {currentUser?.name} {currentUser?.lastname}</div>
                    <div><strong>Email:</strong> {currentUser?.email}</div>
                    <div><strong>Telefono:</strong> {currentUser?.phone || 'No registrado'}</div>
                    <div><strong>Categoria (Año):</strong> {currentUser?.category_id || 'Sin asignar'}</div>
                    <div><strong>Rol:</strong> <span className="badge-sporting badge-sporting-user">Estudiante</span></div>
                </div>
            </div>

            {/* ===== HORARIOS DE ENTRENAMIENTO ===== */}
            <div style={{ marginBottom: '30px' }}>
                <div className="section-title-container">
                    <h3>Mis Horarios de Entrenamiento</h3>
                    <p>Consulta los dias y horas de practica para tu categoria.</p>
                </div>
                {mySchedules.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>Aun no tienes horarios asignados.</p>
                ) : (
                    <div className="horarios-grid-box">
                        {mySchedules.map((schedule, index) => (
                            <div key={schedule.id || index} className="grid-row">
                                <div className="col-desc">
                                    <strong>{schedule.day_of_week}</strong>
                                    <p>{schedule.field_name || 'Cancha Principal'}</p>
                                </div>
                                <div className="col-cat">
                                    <span style={{ fontWeight: 'bold' }}>
                                        {schedule.start_time} - {schedule.end_time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ===== MIS TORNEOS ===== */}
            <div>
                <div className="section-title-container">
                    <h3>Mis Torneos</h3>
                    <p>Lista de torneos en los que participas.</p>
                </div>
                {myTournaments.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>No estas inscrito en ningun torneo actualmente.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {myTournaments.map((tournament) => (
                            <div key={tournament.id} className="torneo-card-estudiante">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <h4 style={{ margin: 0, color: '#8B0000' }}>{tournament.name}</h4>
                                    <span className="badge-estado-torneo">{tournament.status || 'Activo'}</span>
                                </div>
                                <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                                    Categoria: {tournament.category || 'N/A'} | Equipos: {tournament.max_teams || 'N/A'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboardView;