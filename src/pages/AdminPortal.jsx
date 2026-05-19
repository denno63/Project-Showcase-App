import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductContext from '../context/Products/ProductContext'
import Navbar from '../components/Navbar'

function AdminPortal() {
  const [products, setProducts] = useContext(ProductContext)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formValues, setFormValues] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    image: '',
  })

  async function handleDelete(product) {
    if (!window.confirm(`Are you sure you want to delete ${product.title}?`)) {
      return
    }

    setProducts((prevProducts) => prevProducts.filter((item) => item.id !== product.id))

    try {
      const response = await fetch(`https://fakestoreapi.com/products/${product.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      await response.json()
      alert('Product deleted successfully!')
    } catch (error) {
      console.error('Failed to delete product:', error)
      setProducts((prevProducts) =>
        prevProducts.some((item) => item.id === product.id)
          ? prevProducts
          : [...prevProducts, product]
      )
      alert('Could not delete product. Please try again.')
    }
  }

  function handleEdit(product) {
    setEditingProduct(product)
    setFormValues({
      title: product.title || '',
      price: product.price?.toString() || '',
      category: product.category || '',
      description: product.description || '',
      stock: product.stock?.toString() || '',
      image: product.image || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  async function editProduct(e) {
    e.preventDefault()

    if (!editingProduct) {
      return
    }

    try {
      const updatedProduct = {
        ...editingProduct,
        title: formValues.title,
        price: parseFloat(formValues.price) || 0,
        category: formValues.category,
        description: formValues.description,
        stock: parseInt(formValues.stock, 10) || 0,
        image: formValues.image
      }

      const response = await fetch(`https://fakestoreapi.com/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      const finalProduct = {
        ...editingProduct,
        ...data,
        stock: updatedProduct.stock,
        category: updatedProduct.category,
        description: updatedProduct.description,
        image: updatedProduct.image
      }

      setProducts(products.map((product) =>
        product.id === editingProduct.id ? finalProduct : product
      ))
      setEditingProduct(null)
      alert('Product updated successfully!')
    } catch (error) {
      console.error('Failed to update product:', error)
      alert('Could not update product. Please try again.')
    }
  }

  function handleCancelEdit() {
    setEditingProduct(null)
  }

  function getStock(product) {
    return Number.isFinite(Number(product.stock)) ? Number(product.stock) : 12
  }

  function getStockStatus(product) {
    const stock = getStock(product)

    if (stock === 0) {
      return 'Out of Stock'
    }

    if (stock <= 10) {
      return 'Low Stock'
    }

    return 'Ready to Ship'
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(Number(price) || 0)
  }

  return (
    <>
      <Navbar />
      <main className="admin-page">
        <section className="admin-header">
          <div>
            <span className="eyebrow">Inventory studio</span>
            <h1>Admin Portal</h1>
            <p>Review product availability, update details, and keep the collection presentation polished.</p>
          </div>

          <Link to="/AddProduct" className="button button-primary">
            Add Product
          </Link>
        </section>

        <section className="admin-overview" aria-label="Inventory summary">
          <div>
            <span>{products.length}</span>
            <p>Total products</p>
          </div>
          <div>
            <span>{products.filter((product) => getStock(product) <= 10).length}</span>
            <p>Need attention</p>
          </div>
          <div>
            <span>{products.filter((product) => getStock(product) > 10).length}</span>
            <p>Ready to ship</p>
          </div>
        </section>

        {editingProduct && (
          <section className="admin-edit-panel">
            <div className="admin-section-heading">
              <div>
                <span className="eyebrow">Editing</span>
                <h2>{editingProduct.title}</h2>
              </div>
              <button type="button" className="button button-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>

            <form onSubmit={editProduct} className="admin-form">
              <label>
                <span>Title</span>
                <input
                  type="text"
                  name="title"
                  value={formValues.title}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Price</span>
                <input
                  type="number"
                  name="price"
                  value={formValues.price}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Category</span>
                <input
                  type="text"
                  name="category"
                  value={formValues.category}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Stock</span>
                <input
                  type="number"
                  name="stock"
                  value={formValues.stock}
                  onChange={handleChange}
                />
              </label>

              <label className="admin-form-wide">
                <span>Description</span>
                <textarea
                  name="description"
                  value={formValues.description}
                  onChange={handleChange}
                  rows="4"
                />
              </label>

              <label className="admin-form-wide">
                <span>Image URL</span>
                <input
                  type="text"
                  name="image"
                  value={formValues.image}
                  onChange={handleChange}
                />
              </label>

              <div className="admin-form-actions">
                <button type="submit" className="button button-primary">
                  Save Changes
                </button>
                <button type="button" onClick={handleCancelEdit} className="button button-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="admin-inventory">
          <div className="admin-section-heading">
            <div>
              <span className="eyebrow">Collection control</span>
              <h2>Inventory</h2>
            </div>
            <p>{products.length} products currently listed</p>
          </div>

          <ul className="admin-grid">
            {products.map((product) => {
              const stock = getStock(product)
              const status = getStockStatus(product)

              return (
                <li key={product.id} className="admin-product-card">
                  <div className="admin-product-media">
                    <span className={`stock-pill ${stock === 0 ? 'stock-out' : stock <= 10 ? 'stock-low' : 'stock-ready'}`}>
                      {status}
                    </span>
                    <img src={product?.image} alt={product?.title} />
                  </div>

                  <div className="admin-product-body">
                    <div className="product-card-kicker">
                      <span>{product?.category || 'Uncategorized'}</span>
                      <span>{product?.brand || 'Curated'}</span>
                    </div>

                    <h3>{product?.title}</h3>
                    <p>{product?.description}</p>

                    <div className="admin-product-meta">
                      <div>
                        <span className="meta-label">Stock</span>
                        <strong>{stock} units</strong>
                      </div>
                      <div>
                        <span className="meta-label">Price</span>
                        <strong>{formatPrice(product?.price)}</strong>
                      </div>
                    </div>

                    <div className="admin-card-actions">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="button button-secondary"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="button button-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </main>
    </>
  )
}

export default AdminPortal
