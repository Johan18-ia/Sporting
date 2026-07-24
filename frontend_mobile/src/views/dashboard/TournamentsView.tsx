// src/views/dashboard/TournamentsView.jsx
import React, { useState, useEffect } from 'react';
import TournamentController from '../../controllers/TournamentController';
import StudentModel from '../../models/StudentModel';
import CategoryModel from '../../models/CategoryModel';
import AlertMessage from '../common/AlertMessage';
import PageHeader from '../UI/PageHeader';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface Tournament { id: number; name: string; category: string; students?: Array<{ id: number; name: string; lastname: string; document: string }> }
interface Student { id: number; name: string; lastname: string; document: string }
interface Category { id: number; name_year: string; description: string }

const TournamentsView = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [newTournament, setNewTournament] = useState({ name: '', category: '' });
  const [enrollment, setEnrollment] = useState({ tournamentId: '', studentId: '' });

  const loadInitialData = async () => {
    setLoading(true);
    const studentsRes = await StudentModel.getAllStudents();
    const categoriesRes = await CategoryModel.getAllCategories();

    if (studentsRes.success) setStudents((studentsRes.data as Student[] | undefined) || []);
    if (categoriesRes.success) setCategories((categoriesRes.data as Category[] | undefined) || []);

    TournamentController.getTournaments(
      (data: Tournament[]) => {
        setTournaments(data);
        setLoading(false);
      },
      (err: string) => {
        setError(err);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleCreateTournament = (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleEnrollStudent = (e: React.FormEvent<HTMLFormElement>) => {
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
    <div>
      <PageHeader
        title="Mis Torneos"
        description="Organice campeonatos e inscriba a los estudiantes de la escuela en sus respectivas competiciones."
      />

      {message && <AlertMessage type="success" message={message} onClose={() => setMessage(null)} />}
      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>

        <Card title="Nuevo Torneo Interno">
          <form onSubmit={handleCreateTournament}>
            <div className="ui-field">
              <label>Nombre del Torneo</label>
              <input
                type="text"
                value={newTournament.name}
                onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                placeholder="Ej: Copa Oro Sporting"
                required
              />
            </div>
            <div className="ui-field">
              <label>Categoría Permitida (Año)</label>
              <select
                value={newTournament.category}
                onChange={(e) => setNewTournament({ ...newTournament, category: e.target.value })}
                required
              >
                <option value="">Seleccione una categoria</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name_year}>{c.description} ({c.name_year})</option>
                ))}
              </select>
            </div>
            <Button title="Crear Torneo Competitivo" onPress={() => {}} />
          </form>
        </Card>

        <Card title="Inscribir Estudiante en Competencia">
          <form onSubmit={handleEnrollStudent}>
            <div className="ui-field">
              <label>Seleccionar Torneo</label>
              <select
                value={enrollment.tournamentId}
                onChange={(e) => setEnrollment({ ...enrollment, tournamentId: e.target.value })}
                required
              >
                <option value="">Seleccione un campeonato</option>
                {tournaments.map(t => (
                  <option key={t.id} value={t.id}>{t.name} - Cat. {t.category}</option>
                ))}
              </select>
            </div>

            <div className="ui-field">
              <label>Seleccionar Estudiante</label>
              <select
                value={enrollment.studentId}
                onChange={(e) => setEnrollment({ ...enrollment, studentId: e.target.value })}
                required
              >
                <option value="">Seleccione el alumno</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} {s.lastname} ({s.document})</option>
                ))}
              </select>
            </div>

            <Button title="Confirmar Inscripcion de Alumno" onPress={() => {}} />
          </form>
        </Card>
      </div>

      <h3 className="ui-card-title" style={{ margin: '24px 0 12px 0' }}>Lista de Encuentros e Inscritos</h3>

      {loading ? (
        <p style={{ color: 'var(--sporting-text-muted)', fontStyle: 'italic' }}>Procesando registros deportivos...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tournaments.map(tournament => (
            <div key={tournament.id} className="ui-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                background: 'var(--sporting-red)', color: 'white', padding: '12px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span style={{ fontWeight: 600, fontSize: '15px' }}>{tournament.name}</span>
                <span className="badge-sporting" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  Categoria: {tournament.category}
                </span>
              </div>
              <div style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--sporting-text-muted)', textTransform: 'uppercase' }}>
                  Jugadores Inscritos para Enfrentamientos
                </h4>
                {(tournament.students || []).length === 0 ? (
                  <p style={{ margin: 0, color: '#999', fontSize: '13px', fontStyle: 'italic' }}>
                    No hay estudiantes inscritos en este fixture todavia.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                    {(tournament.students || []).map((st, i) => (
                      <div key={i} style={{
                        background: 'var(--sporting-light-gray)', padding: '10px',
                        borderRadius: 'var(--sporting-radius)', border: '1px solid var(--sporting-border)', fontSize: '13px'
                      }}>
                        <div style={{ fontWeight: 600, color: 'var(--sporting-text)' }}>{st.name} {st.lastname}</div>
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