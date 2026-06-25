import React from 'react';
import useProducts from '../../hooks/useProducts';

const CatalogView = () => {
    const { products, loading, error } = useProducts();

    // Estilos rápidos en línea para que se vea como una tienda deportiva ordenada
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        padding: '20px 0'
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid #eee'
    };

    const imageStyle = {
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '10px',
        background: '#f0f0f0'
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>⚽ Catálogo de Implementos Deportivos</h2>
            <p>Lista visual de uniformes, balones y equipamiento disponible para la escuela de microfútbol.</p>

            {loading && <p>Cargando catálogo de productos...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <div style={gridStyle}>
                    {products.map((prod) => (
                        <div key={prod.id} style={cardStyle}>
                            <div>
                                {/* Si la BD trae una URL de imagen la usa, si no, usa una de marcador de posición */}
                                <img 
                                    src={prod.image_url || 'https://placehold.co/300x200?text=Producto+Sin+Imagen'} 
                                    alt={prod.name} 
                                    style={imageStyle} 
                                />
                                <h3 style={{ margin: '10px 0 5px 0', fontSize: '18px', color: '#333' }}>{prod.name}</h3>
                                <p style={{ color: '#666', fontSize: '14px', minHeight: '40px' }}>{prod.description}</p>
                            </div>
                            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2e7d32' }}>
                                    ${Number(prod.price).toLocaleString('es-CO')} COP
                                </span>
                                <span style={{ background: '#e0e0e0', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                    Stock: {prod.stock || 0}
                                </span>
                            </div>
                        </div>
                    ))}
                    
                    {products.length === 0 && (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: '#999' }}>
                            No hay productos registrados en el catálogo en este momento.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CatalogView;