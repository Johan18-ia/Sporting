import React, { useState, useEffect } from 'react';
import ProductModel from '../../models/ProductModel';
import '../../styles/sporting-theme.css';
import '../../styles/PublicHome.css';
import img1 from '../../assets/img1.png';
import img2 from '../../assets/img2.png';

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

const FEATURES = [
    {  
        title: 'Entrenadores Expertos',
        description: 'Profesores con experiencia en formación deportiva infantil y juvenil te acompañan en cada sesión.',
    },
    { 
        title: 'Torneos Constantes',
        description: 'Participa en campeonatos internos organizados por categoría para poner a prueba tu progreso.',
    },
    {
        title: 'Horarios Flexibles',
        description: 'Entrena en el horario que mejor se adapte a tu categoría, organizados durante toda la semana.',
    },
];

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

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="public-home">
            {/* ===================== HERO ===================== */}
            <section className="public-hero-v2">
                <div className="hero-v2-container">
                    <div className="hero-v2-text">
                        <span className="public-section-eyebrow on-dark">— Escuela de Microfútbol —</span>
                        <h1>Formando Campeones, Dentro y Fuera de la Cancha</h1>
                        <p>
                            Únete a una escuela deportiva enfocada en la disciplina, el trabajo en
                            equipo y el crecimiento de cada estudiante.
                        </p>
                        <div className="hero-v2-actions">
                            <button className="hero-v2-btn primary" onClick={() => scrollTo('catalogo')}>
                                Ver Catálogo
                            </button>
                            <button className="hero-v2-btn secondary" onClick={() => scrollTo('sobre-nosotros')}>
                                ▶ Conócenos
                            </button>
                        </div>
                    </div>
                    <div className="hero-v2-image">
                        <AboutImage src={img1} alt="Entrenamiento en la escuela Sporting Club" />
                    </div>
                </div>
            </section>

            {/* ===================== POR QUE ELEGIRNOS ===================== */}
            <section className="public-features">
                <div className="public-section-header">
                    <span className="public-section-eyebrow">Por qué elegirnos</span>
                    <h2>¿Por Qué Unirte a Sporting?</h2>
                    <p>Descubre los beneficios de formar parte de una comunidad enfocada en el desarrollo deportivo integral.</p>
                </div>

                <div className="features-grid">
                    {FEATURES.map((feature) => (
                        <div key={feature.title} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===================== SOBRE NOSOTROS ===================== */}
            <section id="sobre-nosotros" className="public-about-v2">
                <div className="about-v2-image">
                    <AboutImage src={img2} alt="Estudiantes de Sporting Club" />
                </div>
                <div className="about-v2-text">
                    <span className="public-section-eyebrow">Quiénes somos</span>
                    <h2>La Próxima Generación del Microfútbol <span className="accent-underline">Empieza Aquí</span></h2>
                    <p>
                        Sporting Club es una escuela de microfútbol enfocada en la formación técnica,
                        física y en valores de niños y jóvenes. Contamos con categorías por año de
                        nacimiento, horarios de entrenamiento organizados y torneos internos para que
                        cada estudiante compita y crezca dentro del club.
                    </p>
                    <p>
                        Trabajo en equipo, disciplina y respeto son la base de cada sesión de
                        entrenamiento, dentro y fuera de la cancha.
                    </p>
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