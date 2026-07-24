import React, { useState } from 'react';
import useSchedules from '../../hooks/useSchedules';

const SchedulesView = () => {
    const { schedules, categories, loading, error, createSchedule } = useSchedules();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [day, setDay] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCategory || !day || !start || !end) return;

        const res = await createSchedule(selectedCategory, day, start, end);
        if (res.success) {
            alert('Horario asignado con éxito');
            setSelectedCategory('');
            setDay('');
            setStart('');
            setEnd('');
        } else {
            alert(`Error: ${res.message}`);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Horarios de Entrenamiento</h2>
            <p>Asigna los días y horas de práctica para cada categoría de la escuela.</p>

            {/* Formulario */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '30px', background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
                <h3>Asignar Nuevo Horario</h3>
                
                <div style={{ marginBottom: '10px' }}>
                    <label>Seleccionar Categoría (Año): </label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
                        <option value="">-- Seleccione una categoría --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>Año {cat.name_year} - {cat.description}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Día de la semana: </label>
                    <select value={day} onChange={(e) => setDay(e.target.value)} required>
                        <option value="">-- Seleccione el día --</option>
                        <option value="Lunes">Lunes</option>
                        <option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option>
                        <option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option>
                        <option value="Sábado">Sábado</option>
                    </select>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Hora Inicio: </label>
                    <input type="time" value={start} onChange={(e) => setStart(e.target.value)} required />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Hora Fin: </label>
                    <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} required />
                </div>

                <button type="submit" style={{ background: '#4b6cb7', color: 'white', padding: '6px 12px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                    Asignar Horario
                </button>
            </form>

            {/* Tabla de Horarios */}
            <h3>Cronograma de Entrenamientos</h3>
            {loading && <p>Cargando cronograma...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th style={{ padding: '8px' }}>Categoría (Año)</th>
                            <th style={{ padding: '8px' }}>Día</th>
                            <th style={{ padding: '8px' }}>Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map((sch) => (
                            <tr key={sch.id}>
                                {/* Nota: Tu backend debe hacer un JOIN con categorías para mandar el name_year */}
                                <td style={{ padding: '8px' }}><strong>Año {sch.name_year || sch.category_id}</strong></td>
                                <td style={{ padding: '8px' }}>{sch.day_of_week}</td>
                                <td style={{ padding: '8px' }}>{sch.start_time} - {sch.end_time}</td>
                            </tr>
                        ))}
                        {schedules.length === 0 && (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>No hay horarios registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SchedulesView;