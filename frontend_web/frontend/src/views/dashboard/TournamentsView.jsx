// src/views/dashboard/TournamentsView.jsx
import React, { useState, useEffect } from 'react';
import TournamentController from '../../controllers/TournamentController';
import StudentModel from '../../models/StudentModel';
import CategoryModel from '../../models/CategoryModel';
import AlertMessage from '../common/AlertMessage';

const TournamentsView = () => {
  const [tournaments, setTournaments] = useState([]);
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Estados de formularios
  const [newTournament, setNewTournament] = useState({ name: '', category: '' });
  const [enrollment, setEnrollment] = useState({ tournamentId: '', studentId: '' });

  const loadInitialData = async () => {
    setLoading(true);
    // Carga de estudiantes y categorias desde tus modelos existentes
    const studentsRes = await StudentModel.getAllStudents();
    const categoriesRes = await CategoryModel.getAllCategories();
    
    if (studentsRes.success) setStudents(studentsRes.data);
    if (categoriesRes.success) setCategories(categoriesRes.data);

    // Carga de torneos desde el controlador
    TournamentController.getTournaments(
      (data) => {
        setTournaments(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleCreateTournament = (e) => {
    e.preventDefault();
    TournamentController.create(
      newTournament,
      () => {
        setMessage('Torneo creado exitosamente');
        setNewTournament({ name: '', category: '' });
        loadInitialData();
      },
      (err) => setError(err)
    );
  };

  const handleEnrollStudent = (e) => {
    e.preventDefault();
    const selectedStudent = students.find(s => s.id === parseInt(enrollment.studentId));
    
    if (!selectedStudent) {
      setError('Seleccione un estudiante valido');
      return;
    }

    TournamentController.registerStudent(
      enrollment.tournamentId,
      selectedStudent,
      () => {
        setMessage('Estudiante inscrito exitosamente en el torneo');
        setEnrollment({ tournamentId: '', studentId: '' });
        loadInitialData();
      },
      (err) => setError(err)
    );
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', color: '#333' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#1a1a1a', fontSize: '24px' }}>Mis Torneos</h2>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Organice campeonatos e inscriba a los estudiantes de la escuela en sus respectivas competiciones.
        </p>
      </div>

      {message && <AlertMessage type="success" message={message} onClose={() => setMessage(null)} />}
      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Formulario 1: Crear Torneo */}
        <form onSubmit={handleCreateTournament} style={{ 
          background: '#ffffff', padding: '20px', borderRadius: '10px', 
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eaeaea' 
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#8B0000', fontSize: '16px' }}>Nuevo Torneo Interno</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#555' }}>Nombre del Torneo</label>
              <input
                type="text"
                value={newTournament.name}
                onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                placeholder="Ej: Copa Oro Sporting"
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#555' }}>Categoría Permitida (Año)</label>
              <select
                value={newTournament.category}
                onChange={(e) => setNewTournament({ ...newTournament, category: e.target.value })}
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
              >
                <option value="">Seleccione una categoria</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name_year}>{c.description} ({c.name_year})</option>
                ))}
              </select>
            </div>
          </div>
          
          <button type="submit" style={{ 
            background: '#8B0000', color: 'white', padding: '10px 16px', 
            border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: '600' 
          }}>
            Crear Torneo Competitivo
          </button>
        </form>

        {/* Formulario 2: Añadir Estudiante al Torneo */}
        <form onSubmit={handleEnrollStudent} style={{ 
          background: '#ffffff', padding: '20px', borderRadius: '10px', 
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eaeaea' 
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#8B0000', fontSize: '16px' }}>Inscribir Estudiante en Competencia</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#555' }}>Seleccionar Torneo</label>
              <select
                value={enrollment.tournamentId}
                onChange={(e) => setEnrollment({ ...enrollment, tournamentId: e.target.value })}
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
              >
                <option value="">Seleccione un campeonato</option>
                {tournaments.map(t => (
                  <option key={t.id} value={t.id}>{t.name} - Cat. {t.category}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#555' }}>Seleccionar Estudiante</label>
              <select
                value={enrollment.studentId}
                onChange={(e) => setEnrollment({ ...enrollment, studentId: e.target.value })}
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
              >
                <option value="">Seleccione el alumno</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} {s.lastname} ({s.document})</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" style={{ 
            background: '#8B0000', color: 'white', padding: '10px 16px', 
            border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: '600' 
          }}>
            Confirmar Inscripcion de Alumno
          </button>
        </form>
      </div>

      {/* Lista de Torneos con sus respectivos contrincantes inscritos */}
      <h3 style={{ margin: '0 0 16px 0', color: '#1a1a1a', fontSize: '18px' }}>Lista de Encuentros e Inscritos</h3>
      
      {loading ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>Procesando registros deportivos...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tournaments.map(tournament => (
            <div key={tournament.id} style={{ 
              background: '#ffffff', borderRadius: '10px', border: '1px solid #eaeaea', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' 
            }}>
              <div style={{ background: '#8B0000', color: 'white', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', fontSize: '15px' }}>{tournament.name}</span>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                  Categoria: {tournament.category}
                </span>
              </div>
              <div style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#555', textTransform: 'uppercase' }}>Jugadores Inscritos para Enfrentamientos</h4>
                {tournament.students.length === 0 ? (
                  <p style={{ margin: 0, color: '#999', fontSize: '13px', fontStyle: 'italic' }}> No hay estudiantes inscritos en este fixture todavia.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                    {tournament.students.map((st, i) => (
                      <div key={i} style={{ background: '#f9f9f9', padding: '10px', borderRadius: '6px', border: '1px solid #eee', fontSize: '13px' }}>
                        <div style={{ fontWeight: '600', color: '#333' }}>{st.name} {st.lastname}</div>
                        <div style={{ color: '#777', fontSize: '11px' }}>Doc: {st.document}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentsView;
