// src/views/dashboard/ProductsView.jsx
import React, { useState, useEffect } from 'react'
import ProductController from '../../controllers/ProductController'
import AlertMessage from '../common/AlertMessage'

const ProductsView = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: ''
  })

  const loadProducts = () => {
    setLoading(true)
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

  useEffect(() => {
    loadProducts()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const productData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      categoria: formData.categoria,
      imagen: formData.imagen || ''
    }

    ProductController.createProduct(
      productData,
      () => {
        setMessage({ type: 'success', text: 'Producto creado exitosamente' })
        setShowForm(false)
        setFormData({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '' })
        loadProducts()
        setLoading(false)
        setTimeout(() => setMessage(null), 3000)
      },
      (err) => {
        setMessage({ type: 'error', text: err })
        setLoading(false)
        setTimeout(() => setMessage(null), 3000)
      }
    )
  }

  const handleDelete = (id, nombre) => {
    if (window.confirm(`¿Eliminar el producto "${nombre}"?`)) {
      ProductController.deleteProduct(
        id,
        () => {
          setMessage({ type: 'success', text: 'Producto eliminado' })
          loadProducts()
          setTimeout(() => setMessage(null), 3000)
        },
        (err) => {
          setMessage({ type: 'error', text: err })
          setTimeout(() => setMessage(null), 3000)
        }
      )
    }
  }

  const containerStyles = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  }

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px'
  }

  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  }

  const thStyles = {
    background: '#8B0000',
    color: 'white',
    padding: '12px 15px',
    textAlign: 'left',
    fontWeight: 600
  }

  const tdStyles = {
    padding: '12px 15px',
    borderBottom: '1px solid #e1e5e9'
  }

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={{ color: '#333', margin: 0 }}> Mis Productos</h2>
        <button
          onClick={() => {
            setEditingProduct(null)
            setFormData({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '' })
            setShowForm(!showForm)
          }}
          style={{
            background: '#8B0000',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          {showForm ? '✕ Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {message && (
        <AlertMessage
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Categoría</label>
              <input
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                placeholder="Ej: Calzado, Uniformes..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Precio ($) *</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#8B0000',
              color: 'white',
              border: 'none',
              padding: '10px 30px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              marginTop: '15px',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </form>
      )}

      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={thStyles}>ID</th>
            <th style={thStyles}>Producto</th>
            <th style={thStyles}>Categoría</th>
            <th style={thStyles}>Precio</th>
            <th style={thStyles}>Stock</th>
            <th style={thStyles}>ㅤㅤ</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                No hay productos registrados
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td style={tdStyles}>#{p.id}</td>
                <td style={tdStyles}>
                  <strong>{p.nombre}</strong>
                  <div style={{ fontSize: '12px', color: '#666' }}>{p.descripcion}</div>
                </td>
                <td style={tdStyles}>
                  <span style={{
                    background: '#f0f0f0',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {p.categoria || 'Sin categoría'}
                  </span>
                </td>
                <td style={tdStyles}>
                  <strong>${parseFloat(p.precio).toLocaleString('es-CO')}</strong>
                </td>
                <td style={tdStyles}>
                  <span style={{
                    color: p.stock > 0 ? '#0ea371' : '#a90202',
                    fontWeight: 600
                  }}>
                    {p.stock || 0}
                  </span>
                </td>
                <td style={tdStyles}>
                  <button
                    onClick={() => handleDelete(p.id, p.nombre)}
                    style={{
                      background: '#a90202',
                      color: 'white',
                      border: 'none',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ProductsView