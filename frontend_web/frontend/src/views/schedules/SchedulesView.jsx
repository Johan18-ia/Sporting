const SchedulesView = () => (
  <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
    <h1 style={{ marginBottom: '0.5rem' }}>Horarios</h1>
    <p style={{ color: '#666', marginBottom: '1.5rem' }}>
      Consulta y administra los horarios del club, entrenamientos y competencias.
    </p>

    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1rem 1.25rem' }}>
        <strong>Lunes</strong>
        <div style={{ color: '#555', marginTop: '0.5rem' }}>Fútbol formativo · 16:00 - 17:30</div>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1rem 1.25rem' }}>
        <strong>Miércoles</strong>
        <div style={{ color: '#555', marginTop: '0.5rem' }}>Entrenamiento técnico · 17:00 - 18:30</div>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1rem 1.25rem' }}>
        <strong>Sábado</strong>
        <div style={{ color: '#555', marginTop: '0.5rem' }}>Competencia y evaluación · 09:00 - 12:00</div>
      </div>
    </div>
  </div>
)

export default SchedulesView
