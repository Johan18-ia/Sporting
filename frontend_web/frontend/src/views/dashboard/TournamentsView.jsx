// src/views/dashboard/TournamentsView.jsx
import React, { useState, useEffect } from 'react';
import TournamentController from '../../controllers/TournamentController';
import StudentModel from '../../models/StudentModel';
import CategoryModel from '../../models/CategoryModel';
import AlertMessage from '../common/AlertMessage';
import PageHeader from '../ui/PageHeader';
import Card from '../ui/Card';
import Button from '../ui/Button';

const TournamentsView = () => {
  const [tournaments, setTournaments] = useState([]);
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [newTournament, setNewTournament] = useState({ name: '', category: '' });
  const [enrollment, setEnrollment] = useState({ tournamentId: '', studentId: '' });

  const loadInitialData = async () => {
    setLoading(true);
    const studentsRes = await StudentModel.getAllStudents();
    const categoriesRes = await CategoryModel.getAllCategories();

    if (studentsRes.success) setStudents(studentsRes.data);
    if (categoriesRes.success) setCategories(categoriesRes.data);

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

  const activeTournaments = tournaments.filter((t) => (t.status || 'Activo') === 'Activo').length;

  return (
    <div>
      <PageHeader
        title="Mis Torneos"
        description="Organice campeonatos e inscriba a los estudiantes de la escuela en sus respectivas competiciones."
      />

      <div className="panel-summary-grid">
        <div className="panel-summary-card">
          <div className="panel-summary-icon">T</div>
          <div className="panel-summary-meta">
            <span className="panel-summary-value">{tournaments.length}</span>
            <span className="panel-summary-label">Torneos</span>
          </div>
        </div>
        <div className="panel-summary-card">
          <div className="panel-summary-icon">A</div>
          <div className="panel-summary-meta">
            <span className="panel-summary-value">{activeTournaments}</span>
            <span className="panel-summary-label">Activos</span>
          </div>
        </div>
        <div className="panel-summary-card">
          <div className="panel-summary-icon">C</div>
          <div className="panel-summary-meta">
            <span className="panel-summary-value">{categories.length}</span>
            <span className="panel-summary-label">Categorías</span>
          </div>
        </div>
      </div>

      {message && <AlertMessage type="success" message={message} onClose={() => setMessage(null)} />}
      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
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
            <Button type="submit" fullWidth>Crear Torneo Competitivo</Button>
          </form>
        </Card>

        <Card title="Inscribir Estudiante">
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

            <Button type="submit" fullWidth>Confirmar Inscripción</Button>
          </form>
        </Card>
      </div>

      <h3 className="ui-card-title" style={{ margin: '24px 0 12px 0' }}>Participantes y encuentros</h3>

      {loading ? (
        <p style={{ color: 'var(--sporting-text-muted)', fontStyle: 'italic' }}>Procesando registros deportivos...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tournaments.map(tournament => (
            <div key={tournament.id} className="ui-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                background: 'var(--sporting-red)', color: 'white', padding: '12px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px'
              }}>
                <span style={{ fontWeight: 600, fontSize: '15px' }}>{tournament.name}</span>
                <span className="badge-sporting" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  {tournament.category || 'Sin categoría'}
                </span>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--sporting-text-muted)', textTransform: 'uppercase' }}>
                    Participantes
                  </h4>
                  <span className="pill pill-success">{(tournament.students || []).length} inscritos</span>
                </div>
                {(tournament.students || []).length === 0 ? (
                  <p style={{ margin: 0, color: '#999', fontSize: '13px', fontStyle: 'italic' }}>
                    No hay estudiantes inscritos en este fixture todavía.
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