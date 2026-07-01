// frontend_web/frontend/src/views/public/CatalogoView.jsx
// ====================================================
// VISTA: CATÁLOGO PÚBLICO (ACCESIBLE PARA TODOS)
// ====================================================
import React, { useState, useEffect } from 'react';
import ProductModel from '../../models/ProductModel';

const CatalogoView = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const result = await ProductModel.getAllProducts();
            if (result.success) {
                setProducts(result.data);
            } else {
                setError('No se pudieron cargar los productos');
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="main-container-publico">Cargando catalogo...</div>;
    if (error) return <div className="main-container-publico" style={{ color: '#dc3545' }}>Error: {error}</div>;

    return (
        <div className="main-container-publico">
            <div className="banner-promocional">
                <h2 className="banner-title">Bienvenido al Catalogo Sporting</h2>
                <p className="banner-text">Encuentra todo lo que necesitas para tu entrenamiento.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {products.length === 0 ? (
                    <p>No hay productos disponibles en este momento.</p>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-placeholder">
                                {product.imagen ? (
                                    <img src={product.imagen} alt={product.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span>Sin imagen</span>
                                )}
                            </div>
                            <div className="product-info-container">
                                <div className="product-text-box">
                                    <h3 className="product-title">{product.nombre}</h3>
                                    <p className="product-description">{product.descripcion || 'Sin descripción'}</p>
                                </div>
                                <div className="product-footer">
                                    <span className="product-price">${product.precio}</span>
                                    <button className="btn-order-whatsapp">
                                        Pedir por WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CatalogoView;