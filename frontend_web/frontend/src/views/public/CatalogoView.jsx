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
        title: 'Asignación de horarios sin complicaciones',
        description: 'Organiza las jornadas de entrenamiento de cada categoría de forma visual y rápida, optimizando tus espacios y la disponibilidad de tus profesores.',
    },
    { 
        title: 'Gestiona tus estudiantes',
        description: 'Mantén un control más cómodo de tus alumnos.',
    },
    {
        title: 'Creación de equipos y torneos',
        description: 'Configura tus planteles por niveles o edades, y organiza ligas o campeonatos internos con calendarios automatizados para mantener la motivación al máximo.',
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
                        <span className="public-section-eyebrow on-dark">— Gestión de Escuelas de Microfútbol —</span>
                        <h1>¡Forma tus campeones ahora!</h1>
                        <p>
                            Únete a Sporting y forma parte de una comunidad que inspira esfuerzo, compañerismo y el deseo de alcanzar una meta.
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
                    <p>En Sporting entendemos que tu prioridad es el desarrollo de tus atletas. Por eso, te ofrecemos una plataforma integral diseñada para simplificar el día a día de tu escuela deportiva, permitiéndote gestionar todo en un solo lugar de manera ágil y profesional.</p>
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
                 Sporting es la plataforma integral de gestión deportiva diseñada para transformar, simplificar y automatizar por completo la administración de escuelas y clubes. Nuestro software centraliza las herramientas clave del día a día para que entrenadores, coordinadores y directivos puedan dejar atrás las complejas hojas de cálculo y enfocar toda su energía en la formación técnica, física y en valores de sus deportistas. Con el aplicativo, el control de tu institución se vuelve ágil y eficiente; te permite registrar y organizar de manera impecable a tus estudiantes por categorías según su año de nacimiento, manteniendo un historial y fichas técnicas siempre al día, al mismo tiempo que simplifica la planificación de entrenamientos semanales mediante un sistema interactivo de asignación de horarios. Para mantener la competitividad y la motivación al máximo, la plataforma te otorga total autonomía para estructurar planteles, crear equipos y configurar torneos internos de forma directa, permitiéndote decidir exactamente qué enfrentamientos se jugarán en cada jornada. Adicionalmente, Sporting impulsa la proyección comercial de tu club mediante un catálogo digital exclusivo donde los padres de familia y alumnos pueden consultar y adquirir fácilmente tu oferta de servicios, inscripciones, mensualidades, uniformes o cursos de temporada, unificando la administración y la experiencia de usuario en una sola herramienta moderna, fluida y sumamente profesional.
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