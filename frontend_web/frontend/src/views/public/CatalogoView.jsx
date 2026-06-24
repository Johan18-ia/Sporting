// src/views/public/CatalogoView.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductController from '../../controllers/ProductController'

const CatalogoView = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    setLoading(true)
    // Obtener productos sin autenticación
    ProductController.getAllProducts(
      (data) => {
        setProducts(data)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
  }

  // Estilos
  const containerStyles = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  }

  const bannerStyles = {
    background: 'linear-gradient(135deg, #8B0000 0%, #FF4B2B 100%)',
    color: 'white',
    padding: '60px 40px',
    borderRadius: '16px',
    textAlign: 'center',
    marginBottom: '40px'
  }

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px'
  }

  const cardStyles = {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
  }

  const imagePlaceholderStyles = (index) => ({
    height: '200px',
    background: `hsl(${(index * 50) % 360}, 60%, 90%)`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '48px'
  })

  const infoStyles = {
    padding: '15px'
  }

  const titleStyles = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 5px 0'
  }

  const descStyles = {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 10px 0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  }

  const footerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10px',
    borderTop: '1px solid #eee'
  }

  const priceStyles = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#8B0000'
  }

  const buttonStyles = {
    background: '#25D366',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px'
  }

  const handleWhatsApp = (product) => {
    const message = `Hola, me interesa el producto: ${product.nombre} - $${parseFloat(product.precio).toLocaleString('es-CO')}`
    const url = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div style={containerStyles}>
      {/* Banner */}
      <div style={bannerStyles}>
        <h1 style={{ fontSize: '36px', margin: '0 0 10px 0' }}>⚽ Sporting Club</h1>
        <p style={{ fontSize: '18px', margin: 0, opacity: 0.9 }}>
          Equípate con la mejor calidad en productos deportivos
        </p>
        <p style={{ fontSize: '14px', marginTop: '10px', opacity: 0.8 }}>
          ¡Inscríbete con tu equipo y obtén un 20% de descuento en uniformes!
        </p>
      </div>

      {/* Título */}
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        🛒 Nuestros Productos
      </h2>

      {/* Grid de productos */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Cargando productos...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red' }}>Error al cargar productos</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No hay productos disponibles</p>
      ) : (
        <div style={gridStyles}>
          {products.map((product, index) => (
            <div key={product.id} style={cardStyles}>
              <div style={imagePlaceholderStyles(index)}>
                🏅
              </div>
              <div style={infoStyles}>
                <h3 style={titleStyles}>{product.nombre}</h3>
                <p style={descStyles}>{product.descripcion || 'Sin descripción'}</p>
                <div style={footerStyles}>
                  <span style={priceStyles}>
                    ${parseFloat(product.precio).toLocaleString('es-CO')}
                  </span>
                  <button
                    onClick={() => handleWhatsApp(product)}
                    style={buttonStyles}
                  >
                    💬 Pedir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CatalogoView