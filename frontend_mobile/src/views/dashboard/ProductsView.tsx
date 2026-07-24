// src/views/dashboard/ProductsView.jsx
import React, { useState, useEffect } from 'react'
import ProductController from '../../controllers/ProductController'
import AlertMessage from '../common/AlertMessage'
import PageHeader from '../UI/PageHeader'
import Card from '../UI/Card'
import Table from '../UI/Table'
import Button from '../UI/Button'

interface Product {
  id?: number
  nombre: string
  descripcion?: string
  precio: string | number
  stock: number | string
  categoria?: string
}

interface ProductFormData {
  nombre: string
  descripcion: string
  precio: string
  stock: string
  categoria: string
  imagen?: string
}

interface MessageState {
  type: 'success' | 'error'
  text: string
}

const ProductsView = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<MessageState | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: ''
  })

  const loadProducts = () => {
    setLoading(true)
    ProductController.getAllProducts(
      (data: Product[]) => {
        setProducts(data)
        setLoading(false)
      },
      (err: string) => {
        setError(err)
        setLoading(false)
      }
    )
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleDelete = (id: number | string, nombre: string) => {
    if (window.confirm(`¿Eliminar el producto "${nombre}"?`)) {
      ProductController.deleteProduct(
        id,
        () => {
          setMessage({ type: 'success', text: 'Producto eliminado' })
          loadProducts()
          setTimeout(() => setMessage(null), 3000)
        },
        (err: string) => {
          setMessage({ type: 'error', text: err })
          setTimeout(() => setMessage(null), 3000)
        }
      )
    }
  }

  // ============================================
  // PRESENTACION 
  // ============================================
  return (
    <div>
      <PageHeader
        title="Mis Productos"
        actions={
          <Button
            onClick={() => {
              setEditingProduct(null)
              setFormData({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '' })
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
        <Card title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 15px' }}>
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
                <label>Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} />
              </div>
            </div>
            <Button onClick={() => {}} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </Button>
          </form>
        </Card>
      )}

      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: '#dc3545' }}>{error}</p>}

      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                No hay productos registrados
              </td>
            </tr>
          ) : (
            products.map((p: Product) => (
              <tr key={p.id}>
                <td>#{p.id}</td>
                <td>
                  <strong>{p.nombre}</strong>
                  <div style={{ fontSize: '12px', color: '#666' }}>{p.descripcion}</div>
                </td>
                <td>
                  <span className="badge-sporting" style={{ background: '#f0f0f0', color: '#555' }}>
                    {p.categoria || 'Sin categoría'}
                  </span>
                </td>
                <td><strong>${parseFloat(String(p.precio)).toLocaleString('es-CO')}</strong></td>
                <td>
                  <span style={{ color: Number(p.stock) > 0 ? '#0ea371' : '#a90202', fontWeight: 600 }}>
                    {p.stock || 0}
                  </span>
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleDelete(p.id ?? 0, p.nombre)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default ProductsView