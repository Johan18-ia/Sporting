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
        <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', color: '#333' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 8px 0', color: '#1a1a1a', fontSize: '24px' }}>Gestión de Categorías</h2>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                    Administra los rangos de años de nacimiento para la escuela de microfútbol.
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ 
                marginBottom: '32px', 
                background: '#ffffff', 
                padding: '20px', 
                borderRadius: '10px', 
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: '1px solid #eaeaea'
            }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#8B0000', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                     Agregar Nueva Categoría
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '6px', color: '#555' }}>Año de Nacimiento</label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            placeholder="Ej: 2014"
                            required
                            style={{
                                padding: '10px 12px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '6px', color: '#555' }}>Descripción de la Categoría</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ej: Categoría Benjamín"
                            required
                            style={{
                                padding: '10px 12px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" style={{ 
                        background: '#8B0000', 
                        color: 'white', 
                        padding: '10px 20px', 
                        border: 'none', 
                        borderRadius: '6px',
                        fontWeight: '500',
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(139, 0, 0, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        Guardar Categoría
                    </button>
                </div>
            </form>

            <h3 style={{ margin: '0 0 16px 0', color: '#1a1a1a', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 Categorías Registradas
            </h3>
            
            {loading && <p style={{ color: '#666', fontStyle: 'italic' }}>Cargando categorías...</p>}
            {error && <p style={{ color: '#dc3545', background: '#fdf2f2', padding: '10px', borderRadius: '6px', border: '1px solid #fde2e2' }}>{error}</p>}
            
            {!loading && !error && (
                <div style={{ background: '#ffffff', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #eaeaea' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ background: '#8B0000', color: '#ffffff' }}>
                                <th style={{ padding: '12px 16px', fontWeight: '600', width: '80px' }}>ID</th>
                                <th style={{ padding: '12px 16px', fontWeight: '600', width: '150px' }}>Año</th>
                                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Descripción</th>
                                <th style={{ padding: '12px 16px', fontWeight: '600', width: '120px', textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat, index) => (
                                <tr key={cat.id} style={{ 
                                    background: index % 2 === 0 ? '#ffffff' : '#fcfcfc',
                                    borderBottom: '1px solid #eee',
                                    transition: 'background-color 0.2s'
                                }}>
                                    <td style={{ padding: '12px 16px', color: '#777' }}>#{cat.id}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ 
                                            background: '#8B0000', 
                                            color: 'white', 
                                            padding: '4px 8px', 
                                            borderRadius: '4px', 
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {cat.name_year}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#333' }}>{cat.description}</td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        <button 
                                            onClick={() => handleDelete(cat.id)} 
                                            style={{ 
                                                background: '#8B0000', 
                                                color: 'white', 
                                                border: 'none', 
                                                padding: '6px 12px', 
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                boxShadow: '0 2px 4px rgba(220, 53, 69, 0.15)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#888', fontStyle: 'italic' }}>
                                        No hay categorías registradas en este momento.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CategoriesView;