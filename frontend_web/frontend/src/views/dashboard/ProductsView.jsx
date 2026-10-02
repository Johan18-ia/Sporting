// src/views/dashboard/ProductsView.jsx
import React, { useState, useEffect, useMemo } from 'react'
import ProductController from '../../controllers/ProductController'
import AlertMessage from '../common/AlertMessage'
import PageHeader from '../ui/PageHeader'
import Button from '../ui/Button'
import '../../styles/Products.css'

const ProductsView = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [filterCat, setFilterCat] = useState('')
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
    imagen: ''
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

  const categories = useMemo(() => {
    const set = new Set()
    products.forEach((p) => {
      if (p.categoria) set.add(p.categoria)
    })
    return Array.from(set).sort()
  }, [products])

  const filtered = useMemo(() => {
    if (!filterCat) return products
    return products.filter((p) => (p.categoria || '') === filterCat)
  }, [products, filterCat])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const productData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock, 10),
      categoria: formData.categoria,
      imagen: formData.imagen || ''
    }

    ProductController.createProduct(
      productData,
      () => {
        setMessage({ type: 'success', text: 'Producto creado exitosamente' })
        setShowForm(false)
        setFormData({
          nombre: '',
          descripcion: '',
          precio: '',
          stock: '',
          categoria: '',
          imagen: ''
        })
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

  return (
    <div className="prod-page">
      <PageHeader
        title="Productos"
        description="Catálogo de la tienda Sporting Club"
        actions={
          <Button
            onClick={() => {
              setFormData({
                nombre: '',
                descripcion: '',
                precio: '',
                stock: '',
                categoria: '',
                imagen: ''
              })
              setShowForm(!showForm)
            }}
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Producto'}
          </Button>
        }
      />

      {message && (
        <AlertMessage
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      {showForm && (
        <div className="prod-form-card">
          <h3 className="prod-form-title">Nuevo producto</h3>
          <form onSubmit={handleSubmit}>
            <div className="prod-form-grid">
              <div className="ui-field">
                <label>Nombre *</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="ui-field">
                <label>Categoría</label>
                <input
                  type="text"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  placeholder="Ej: Calzado, Uniformes..."
                />
              </div>
              <div className="ui-field">
                <label>Precio ($) *</label>
                <input type="number" name="precio" value={formData.precio} onChange={handleChange} required min="0" step="0.01" />
              </div>
              <div className="ui-field">
                <label>Stock *</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
              </div>
              <div className="ui-field" style={{ gridColumn: '1 / -1' }}>
                <label>URL de imagen</label>
                <input
                  type="url"
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
              <div className="ui-field" style={{ gridColumn: '1 / -1' }}>
                <label>Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </Button>
          </form>
        </div>
      )}

      <div className="prod-filter-row">
        <button
          type="button"
          className={`prod-filter-chip ${filterCat === '' ? 'is-active' : ''}`}
          onClick={() => setFilterCat('')}
        >
          Todas
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={`prod-filter-chip ${filterCat === c ? 'is-active' : ''}`}
            onClick={() => setFilterCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && products.length === 0 && <p className="prod-status">Cargando productos...</p>}
      {error && <p className="prod-status prod-status-error">{error}</p>}

      {!loading && filtered.length === 0 ? (
        <div className="prod-empty">
          <p>No hay productos registrados</p>
        </div>
      ) : (
        <div className="prod-grid">
          {filtered.map((p) => (
            <article key={p.id} className="prod-card">
              <div className="prod-card-image">
                {p.imagen ? (
                  <img src={p.imagen} alt={p.nombre} />
                ) : (
                  <div className="prod-card-placeholder">
                    <span>{(p.nombre || '?').slice(0, 1).toUpperCase()}</span>
                  </div>
                )}
                {p.categoria && <span className="prod-card-badge">{p.categoria}</span>}
              </div>
              <div className="prod-card-body">
                <h3 className="prod-card-name">{p.nombre}</h3>
                {p.descripcion && <p className="prod-card-desc">{p.descripcion}</p>}
                <div className="prod-card-meta">
                  <span className="prod-card-price">
                    ${parseFloat(p.precio || 0).toLocaleString('es-CO')}
                  </span>
                  <span className={`prod-card-stock ${(p.stock || 0) > 0 ? 'in' : 'out'}`}>
                    Stock: {p.stock || 0}
                  </span>
                </div>
                <button
                  type="button"
                  className="prod-card-delete"
                  onClick={() => handleDelete(p.id, p.nombre)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductsView