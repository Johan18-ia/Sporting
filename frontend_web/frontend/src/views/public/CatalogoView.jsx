// src/views/public/CatalogoView.jsx
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ProductController from '../../controllers/ProductController'

// Espacio optimizado para la importación real de tu logo físico en minúsculas
import logoSporting from '../../assets/logo.png'

const CatalogoView = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const location = useLocation()

  // Detecta si la vista está incrustada dentro del panel de administración
  const isInsideDashboard = location.pathname.includes('dashboard')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    setLoading(true)
    setError(null)
    
    // Consulta directa y exclusiva a la Base de Datos
    ProductController.getAllProducts(
      (data) => {
        setProducts(data || [])
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
  }

  const handleWhatsApp = (product) => {
    const message = `Hola Sporting Club, me interesa el producto: ${product.nombre} con valor de $${parseFloat(product.precio).toLocaleString('es-CO')}.`
    const url = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  // ==================== ESTILOS PROFESIONALES IN-LINE ====================
  const navStyles = {
    width: '100%',
    background: 'linear-gradient(90deg, #8B0000 0%, #B22222 100%)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    padding: '0 20px'
  }

  const navContainerStyles = {
    maxWidth: '1200px',
    margin: '0 auto',
    height: '60px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  const mainContainerStyles = {
    maxWidth: '1200px',
    margin: isInsideDashboard ? '10px auto' : '40px auto',
    padding: '0 20px',
    fontFamily: '"Segoe UI", Roboto, sans-serif'
  }

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '25px',
    paddingBottom: '30px'
  }

  const cardStyles = {
    background: 'white',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #f0f0f0'
  }

  return (
    <div style={{ background: isInsideDashboard ? 'transparent' : '#fcfcfc', minHeight: '100vh', margin: 0 }}>
      
      {/* EL NAVBAR SUPERIOR SOLO EXISTE SI NO ESTAMOS DENTRO DEL DASHBOARD */}
      {!isInsideDashboard && (
        <nav style={navStyles}>
          <div style={navContainerStyles}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <img 
                src={logoSporting} 
                alt="Sporting Logo" 
                style={{ height: '70px', width: 'auto', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.style.display = 'none'; // Resguardo por si el archivo no existe todavía
                }}
              />
            </Link>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Catálogo</Link>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '600', background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '6px' }}>Iniciar Sesión</Link>
            </div>
          </div>
        </nav>
      )}

      {/* CUERPO DEL CONTENEDOR */}
      <div style={mainContainerStyles}>
        
        {/* Banner exterior - Solo visible en modo público */}
        {!isInsideDashboard && (
          <div style={{ background: 'linear-gradient(135deg, #8B0000 0%, #FF4B2B 100%)', color: 'white', padding: '40px 30px', borderRadius: '16px', textAlign: 'center', marginBottom: '40px', boxShadow: '0 6px 20px rgba(139, 0, 0, 0.2)' }}>
            <h1 style={{ fontSize: '36px', margin: '0 0 10px 0', fontWeight: '800' }}>SPORTING</h1>
            <p style={{ fontSize: '16px', margin: 0, opacity: 0.9 }}>Equípate con la mejor calidad en productos deportivos oficiales</p>
          </div>
        )}

        {/* Título de la sección */}
        <div style={{ marginBottom: '30px', textAlign: isInsideDashboard ? 'left' : 'center' }}>
          <h2 style={{ color: '#222', fontSize: '24px', fontWeight: '700', margin: '0 0 6px 0' }}>
            {isInsideDashboard ? 'Catálogo de Artículos' : 'Nuestros Productos'}
          </h2>
          <div style={{ width: '50px', height: '4px', background: '#8B0000', margin: isInsideDashboard ? '0' : '0 auto', borderRadius: '2px' }}></div>
        </div>

        {/* Renderizado de la base de datos */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Cargando catálogo...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', color: '#D32F2F' }}>Error al conectar con el servidor de productos</p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>No hay productos registrados en la base de datos actualmente.</p>
        ) : (
          <div style={gridStyles}>
            {products.map((product, index) => (
              <div 
                key={product.id} 
                style={cardStyles}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)'
                }}
              >
                {/* Cuadro de previsualización visual estándar para cualquier artículo */}
                <div style={{
                  height: '160px',
                  background: `linear-gradient(135deg, hsl(${(index * 75) % 360}, 60%, 85%) 0%, hsl(${(index * 75) % 360}, 60%, 75%) 100%)`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '50px'
                }}>
                  
                </div>
                
                {/* Información de la BD */}
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#222', margin: '0 0 6px 0' }}>{product.nombre}</h3>
                  <p style={{ fontSize: '13px', color: '#666', margin: '0 0 14px 0', lineHeight: '1.4', flexGrow: 1 }}>{product.descripcion || 'Sin descripción disponible.'}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f5f5f5' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#8B0000' }}>
                      ${parseFloat(product.precio || 0).toLocaleString('es-CO')}
                    </span>
                    <button
                      onClick={() => handleWhatsApp(product)}
                      style={{ background: '#25D366', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                    >
                      Pedido
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CatalogoView