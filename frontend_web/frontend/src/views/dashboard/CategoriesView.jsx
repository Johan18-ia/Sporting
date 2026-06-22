// src/views/dashboard/CategoriesView.jsx
import React, { useState } from 'react';
import useCategories from '../../hooks/useCategories';

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
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Categorías</h2>
            <p>Administra los rangos de años de nacimiento para la escuela de microfútbol.</p>

            <form onSubmit={handleSubmit} style={{ marginBottom: '30px', background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
                <h3>Agregar Categoría</h3>
                <div style={{ marginBottom: '10px' }}>
                    <label>Año de Nacimiento: </label>
                    <input 
                        type="number" 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="Ej: 2014" 
                        required 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Descripción: </label>
                    <input 
                        type="text" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ej: Categoría Benjamín" 
                        required 
                    />
                </div>
                <button type="submit" style={{ background: 'green', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>
                    Guardar
                </button>
            </form>

            <h3>Categorías Registradas</h3>
            {loading && <p>Cargando categorías...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {!loading && !error && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th style={{ padding: '8px' }}>ID</th>
                            <th style={{ padding: '8px' }}>Año</th>
                            <th style={{ padding: '8px' }}>Descripción</th>
                            <th style={{ padding: '8px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id}>
                                <td style={{ padding: '8px' }}>{cat.id}</td>
                                <td style={{ padding: '8px' }}><strong>{cat.name_year}</strong></td>
                                <td style={{ padding: '8px' }}>{cat.description}</td>
                                <td style={{ padding: '8px' }}>
                                    <button 
                                        onClick={() => handleDelete(cat.id)} 
                                        style={{ background: 'red', color: 'white', border: 'none', padding: '3px 8px', cursor: 'pointer' }}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>No hay categorías.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CategoriesView;