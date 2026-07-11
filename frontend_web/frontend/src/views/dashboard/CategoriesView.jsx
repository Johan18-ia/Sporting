// src/views/dashboard/CategoriesView.jsx
import React, { useState } from 'react';
import useCategories from '../../hooks/useCategories';
import PageHeader from '../ui/PageHeader';
import Card from '../ui/Card';
import Table from '../ui/Table';
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

            <h3 className="ui-card-title" style={{ marginBottom: '12px' }}>Categorías Registradas</h3>
            {loading && <p>Cargando categorías...</p>}
            {error && <p style={{ color: '#dc3545' }}>{error}</p>}

            {!loading && !error && (
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Año</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id}>
                                <td>{cat.id}</td>
                                <td><strong>{cat.category_year}</strong></td>
                                <td>{cat.description}</td>
                                <td>
                                    <Button variant="danger" onClick={() => handleDelete(cat.id)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                    No hay categorías.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default CategoriesView;