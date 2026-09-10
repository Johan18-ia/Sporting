// src/views/dashboard/CategoriesView.jsx
import React, { useState } from 'react';
import useCategories from '../../hooks/useCategories';
import PageHeader from '../ui/PageHeader';
import Card from '../ui/Card';
import Button from '../ui/Button';

const CategoriesView = () => {
    const { categories, loading, error, createCategory, deleteCategory } = useCategories();
    const [year, setYear] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!year || !description) return;

        const res = await createCategory(year, description);
        if (res.success) {
            alert('Categoría creada exitosamente');
            setYear('');
            setDescription('');
        } else {
            alert(`Error: ${res.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            const res = await deleteCategory(id);
            if (!res.success) {
                alert(`Error al eliminar: ${res.message}`);
            }
        }
    };

    return (
        <div>
            <PageHeader
                title="Gestión de Categorías"
                description="Administra los rangos de años de nacimiento para la escuela de microfútbol."
            />

            <div className="panel-summary-grid">
                <div className="panel-summary-card">
                    <div className="panel-summary-icon">C</div>
                    <div className="panel-summary-meta">
                        <span className="panel-summary-value">{categories.length}</span>
                        <span className="panel-summary-label">Categorías</span>
                    </div>
                </div>
                <div className="panel-summary-card">
                    <div className="panel-summary-icon">A</div>
                    <div className="panel-summary-meta">
                        <span className="panel-summary-value">{new Set(categories.map((cat) => cat.category_year)).size}</span>
                        <span className="panel-summary-label">Años</span>
                    </div>
                </div>
            </div>

            <Card title="Agregar Categoría">
                <form onSubmit={handleSubmit}>
                    <div className="ui-field">
                        <label>Año de Nacimiento</label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            placeholder="Ej: 2014"
                            required
                        />
                    </div>
                    <div className="ui-field">
                        <label>Descripción</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ej: Categoría Benjamín"
                            required
                        />
                    </div>
                    <Button type="submit">Guardar</Button>
                </form>
            </Card>

            <h3 className="ui-card-title" style={{ marginBottom: '12px' }}>Categorías registradas</h3>
            {loading && <p>Cargando categorías...</p>}
            {error && <p style={{ color: '#dc3545' }}>{error}</p>}

            {!loading && !error && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {categories.length === 0 ? (
                        <div className="ui-card" style={{ textAlign: 'center', color: '#666', padding: '30px 20px' }}>
                            No hay categorías registradas.
                        </div>
                    ) : (
                        categories.map((cat) => (
                            <div key={cat.id} className="ui-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                <div>
                                    <div style={{ fontWeight: 700, color: 'var(--sporting-text)', fontSize: '15px' }}>{cat.category_year}</div>
                                    <div style={{ color: 'var(--sporting-text-muted)', fontSize: '13px', marginTop: '4px' }}>{cat.description}</div>
                                </div>
                                <button className="btn-sporting-danger" type="button" onClick={() => handleDelete(cat.id)}>
                                    Eliminar
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoriesView;