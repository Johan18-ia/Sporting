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
        icon: '⏱',
        title: 'Horarios claros',
        description: 'Organiza entrenamientos por categoría de forma visual y rápida.',
    },
    {
        icon: '🎓',
        title: 'Gestión de estudiantes',
        description: 'Controla fichas, categorías y el día a día de tus alumnos.',
    },
    {
        icon: '🏆',
        title: 'Equipos y torneos',
        description: 'Arma planteles y campeonatos internos con calendarios simples.',
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
                    <div className="hero-v2-text anim-fade-up">
                        <span className="public-section-eyebrow on-dark">Escuelas de microfútbol</span>
                        <h1>¡Forma tus campeones ahora!</h1>
                        <p>
                            Gestiona horarios, estudiantes, equipos y torneos en un solo lugar.
                        </p>
                        <div className="hero-v2-actions">
                            <button className="hero-v2-btn primary" onClick={() => scrollTo('catalogo')}>
                                Ver catálogo
                            </button>
                            <button className="hero-v2-btn secondary" onClick={() => scrollTo('sobre-nosotros')}>
                                Conócenos
                            </button>
                        </div>
                    </div>
                    <div className="hero-v2-image anim-fade-up delay-1">
                        <AboutImage src={img1} alt="Entrenamiento en la escuela Sporting Club" />
                    </div>
                </div>
            </section>

            {/* ===================== POR QUE ELEGIRNOS ===================== */}
            <section className="public-features">
                <div className="public-section-header anim-fade-up">
                    <span className="public-section-eyebrow">Por qué Sporting</span>
                    <h2>Todo lo que tu escuela necesita</h2>
                    <p>
                        Una plataforma pensada para que te enfoques en formar atletas, no en planillas.
                    </p>
                </div>

                <div className="features-grid">
                    {FEATURES.map((feature, index) => (
                        <div
                            key={feature.title}
                            className={`feature-card anim-fade-up delay-${index + 1}`}
                        >
                            <div className="feature-icon" aria-hidden="true">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===================== SOBRE NOSOTROS ===================== */}
            <section id="sobre-nosotros" className="public-about-v2">
                <div className="about-v2-image anim-fade-up">
                    <AboutImage src={img2} alt="Estudiantes de Sporting Club" />
                </div>
                <div className="about-v2-text anim-fade-up delay-1">
                    <span className="public-section-eyebrow">Quiénes somos</span>
                    <h2>
                        La próxima generación del microfútbol{' '}
                        <span className="accent-underline">empieza aquí</span>
                    </h2>
                    <p>
                        Sporting centraliza la administración de tu club: estudiantes por categoría,
                        horarios de entrenamiento, equipos, torneos y un catálogo digital para
                        padres y alumnos.
                    </p>
                    <p>
                        Disciplina, compañerismo y juego limpio, dentro y fuera de la cancha.
                    </p>
                </div>
            </section>

            {/* ===================== CATALOGO ===================== */}
            <section id="catalogo" className="public-catalog">
                <div className="public-section-header anim-fade-up">
                    <span className="public-section-eyebrow">Tienda oficial</span>
                    <h2>Catálogo</h2>
                    <p>Uniformes, inscripciones y todo lo que necesitas para entrenar.</p>
                </div>

                {loading && <p className="public-catalog-status">Cargando catálogo...</p>}
                {error && <p className="public-catalog-status public-catalog-error">{error}</p>}

                {!loading && !error && (
                    products.length === 0 ? (
                        <p className="public-catalog-status">No hay productos disponibles en este momento.</p>
                    ) : (
                        <div className="catalog-grid">
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className={`catalog-card anim-fade-up delay-${Math.min(index % 3 + 1, 3)}`}
                                >
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
                                            <button type="button" className="catalog-card-btn">
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
