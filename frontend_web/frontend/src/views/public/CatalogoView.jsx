// frontend_web/frontend/src/views/public/CatalogoView.jsx
// ====================================================
// VISTA: PAGINA DE INICIO PUBLICA (Hero + Sobre Nosotros + Catalogo)
// Accesible sin necesidad de iniciar sesion.
// ====================================================
import React, { useState, useEffect } from 'react';
import ProductModel from '../../models/ProductModel';
import '../../styles/sporting-theme.css';
import '../../styles/PublicHome.css';

// ============================================
// Imagenes de la seccion "Sobre Nosotros".
// Coloca tus archivos en: src/assets/about-1.jpg y src/assets/about-2.jpg
// Si todavia no existen, se muestra un espacio reservado en su lugar
// (no rompe la compilacion ni la pagina).
// ============================================
const ABOUT_IMAGES = [
    { src: '/assets/about-1.jpg', alt: 'Entrenamiento en la escuela Sporting Club' },
    { src: '/assets/about-2.jpg', alt: 'Estudiantes de Sporting Club' },
];

const AboutImage = ({ src, alt }) => {
    const [failed, setFailed] = useState(false);
    if (failed) {
        return (
            <div className="about-image-placeholder">
                <span>Agrega tu imagen aquí</span>
            </div>
        );
    }
    return <img src={src} alt={alt} className="about-image" onError={() => setFailed(true)} />;
};

const CatalogoView = () => {
    // ============================================
    // LOGICA DE DATOS SIN CAMBIOS
    // ============================================
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

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="public-home">
            {/* ===================== HERO ===================== */}
            <section className="public-hero">
                <div className="public-hero-content">
                    <h1>Sporting Club</h1>
                    <p>Formando campeones dentro y fuera de la cancha.</p>
                    <div className="public-hero-actions">
                        <button className="public-hero-btn primary" onClick={() => scrollTo('catalogo')}>
                            Ver Catálogo
                        </button>
                        <button className="public-hero-btn secondary" onClick={() => scrollTo('sobre-nosotros')}>
                            Conócenos
                        </button>
                    </div>
                </div>
            </section>

            {/* ===================== SOBRE NOSOTROS ===================== */}
            <section id="sobre-nosotros" className="public-about">
                <div className="public-section-header">
                    <span className="public-section-eyebrow">Nuestra escuela</span>
                    <h2>Sobre Nosotros</h2>
                    <p>
                        Sporting Club es una escuela de microfútbol enfocada en la formación técnica,
                        física y en valores de niños y jóvenes. Contamos con categorías por año de
                        nacimiento, horarios de entrenamiento organizados y torneos internos para que
                        cada estudiante compita y crezca dentro del club.
                    </p>
                </div>

                <div className="public-about-grid">
                    <AboutImage src={ABOUT_IMAGES[0].src} alt={ABOUT_IMAGES[0].alt} />
                    <div className="public-about-text">
                        <h3>Nuestra metodología</h3>
                        <p>
                            Cada categoría entrena con planes adaptados a su edad, acompañados por
                            profesores con experiencia en formación deportiva infantil y juvenil.
                        </p>
                        <h3>Nuestros valores</h3>
                        <p>
                            Trabajo en equipo, disciplina y respeto son la base de cada sesión de
                            entrenamiento, dentro y fuera de la cancha.
                        </p>
                    </div>
                    <AboutImage src={ABOUT_IMAGES[1].src} alt={ABOUT_IMAGES[1].alt} />
                </div>
            </section>

            {/* ===================== CATALOGO ===================== */}
            <section id="catalogo" className="public-catalog">
                <div className="public-section-header">
                    <span className="public-section-eyebrow">Tienda oficial</span>
                    <h2>Catálogo</h2>
                    <p>Encuentra todo lo que necesitas para tu entrenamiento.</p>
                </div>

                {loading && <p className="public-catalog-status">Cargando catálogo...</p>}
                {error && <p className="public-catalog-status public-catalog-error">{error}</p>}

                {!loading && !error && (
                    products.length === 0 ? (
                        <p className="public-catalog-status">No hay productos disponibles en este momento.</p>
                    ) : (
                        <div className="catalog-grid">
                            {products.map((product) => (
                                <div key={product.id} className="catalog-card">
                                    <div className="catalog-card-image">
                                        {product.imagen ? (
                                            <img src={product.imagen} alt={product.nombre} />
                                        ) : (
                                            <span className="catalog-card-noimage">{product.nombre}</span>
                                        )}
                                    </div>
                                    <div className="catalog-card-body">
                                        <h3>{product.nombre}</h3>
                                        <p>{product.descripcion || 'Sin descripción'}</p>
                                        <div className="catalog-card-footer">
                                            <span className="catalog-card-price">${product.precio}</span>
                                            <button className="catalog-card-btn">
                                                Pedir por WhatsApp
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </section>
        </div>
    );
};

export default CatalogoView;