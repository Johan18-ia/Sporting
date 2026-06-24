// src/views/common/Footer.jsx
import React from 'react'

const Footer = () => {
  const footerStyles = {
    background: '#111111',
    color: '#eeeeee',
    padding: '40px 20px 20px',
    marginTop: 'auto'
  }

  const containerStyles = {
    maxWidth: '1200px',
    margin: '0 auto'
  }

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginBottom: '30px'
  }

  const titleStyles = {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '15px'
  }

  const linkStyles = {
    color: '#cccccc',
    textDecoration: 'none',
    fontSize: '14px',
    display: 'block',
    marginBottom: '8px',
    transition: 'color 0.3s ease'
  }

  const bottomStyles = {
    borderTop: '1px solid #333',
    paddingTop: '20px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#888'
  }

  return (
    <footer style={footerStyles}>
      <div style={containerStyles}>
        <div style={gridStyles}>
          {/* Columna 1: Logo y eslogan */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '32px' }}>⚽</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#8B0000' }}>SPORTING</span>
            </div>
            <p style={{ color: '#aaaaaa', fontStyle: 'italic', fontSize: '14px' }}>
              "Formando campeones para la vida."
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 style={titleStyles}>Enlaces Rápidos</h4>
            <a href="#" style={linkStyles}>Sobre Nosotros</a>
            <a href="#" style={linkStyles}>Categorías</a>
            <a href="#" style={linkStyles}>Inscripciones</a>
            <a href="#" style={linkStyles}>Contacto</a>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 style={titleStyles}>Contáctanos</h4>
            <p style={{ color: '#cccccc', fontSize: '14px', marginBottom: '8px' }}>
              📍 Calle 129 B #95 6 #123, Bogotá
            </p>
            <p style={{ color: '#cccccc', fontSize: '14px', marginBottom: '8px' }}>
              📞 +57 300 123 4567
            </p>
            <p style={{ color: '#cccccc', fontSize: '14px', marginBottom: '8px' }}>
              ✉️ contacto@sporting.com
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div style={bottomStyles}>
          <p>
            &copy; 2024 Sporting Club Deportivo. Todos los derechos reservados. | 
            <a href="#" style={{ color: '#888', textDecoration: 'none', marginLeft: '5px' }}>
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer