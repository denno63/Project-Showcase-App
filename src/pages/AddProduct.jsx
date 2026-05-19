import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import ProductContext from '../context/Products/ProductContext'

function AddProduct() {
  const navigate = useNavigate()
  const [, setProducts] = useContext(ProductContext)
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    rating: '',
    image: '',
    description: '',
  })

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const response = await fetch('https://fakestoreapi.com/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const newProduct = await response.json()
      setProducts((prevProducts) => [...prevProducts, newProduct])
      await Swal.fire({
        icon: 'success',
        title: 'Product added',
        text: 'Your product was created successfully.',
        confirmButtonText: 'Awesome',
      })
      setFormData({
        title: '',
        price: '',
        category: '',
        brand: '',
        stock: '',
        rating: '',
        image: '',
        description: '',
        status: '',
        sku: '',
        discount: ''
      })
      navigate('/Admin')
    } catch (error) {
      console.error('Add product failed:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Add failed',
        text: 'Could not add product. Please try again.',
        confirmButtonText: 'Okay',
      })
    }
  }

  return (
    <div className="add-product-page">
      <div className="add-product-card">
        <h2 className="add-product-title">Add New Product</h2>
        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="add-product-field">
            <label className="add-product-label">Title</label>
            <input name="title" placeholder="e.g. Nike Air Max" value={formData.title} onChange={handleChange} className="add-product-input" />
          </div>

          <div className="add-product-field">
            <label className="add-product-label">Price</label>
            <input name="price" placeholder="e.g. 120" value={formData.price} onChange={handleChange} className="add-product-input" />
          </div>

          <div className="add-product-field">
            <label className="add-product-label">Category</label>
            <input name="category" placeholder="e.g. Shoes" value={formData.category} onChange={handleChange} className="add-product-input" />
          </div>

          {/* <div className="add-product-field">
            <label className="add-product-label">Brand</label>
            <input name="brand" placeholder="e.g. Nike" value={formData.brand} onChange={handleChange} className="add-product-input" />
          </div> */}

          <div className="add-product-field">
            <label className="add-product-label">Stock</label>
            <input name="stock" placeholder="e.g. 14" value={formData.stock} onChange={handleChange} className="add-product-input" />
          </div>

          <div className="add-product-field">
            <label className="add-product-label">Rating</label>
            <input name="rating" placeholder="e.g. 4.8" value={formData.rating} onChange={handleChange} className="add-product-input" />
          </div>

          <div className="add-product-field">
            <label className="add-product-label">Image URL</label>
            <input name="image" placeholder="e.g. https://picsum.photos/500/300" value={formData.image} onChange={handleChange} className="add-product-input" />
          </div>

          <div className="add-product-field">
            <label className="add-product-label">Description</label>
            <input name="description" placeholder="e.g. Premium running sneakers" value={formData.description} onChange={handleChange} className="add-product-input" />
          </div>

          {/* <div className="add-product-field">
            <label className="add-product-label">Status</label>
            <input name="status" placeholder="e.g. active" value={formData.status} onChange={handleChange} className="add-product-input" />
          </div>

          <div className="add-product-field">
            <label className="add-product-label">SKU</label>
            <input name="sku" placeholder="e.g. NK-AM-001" value={formData.sku} onChange={handleChange} className="add-product-input" />
          </div>

          <div className="add-product-field">
            <label className="add-product-label">Discount</label>
            <input name="discount" placeholder="e.g. 10" value={formData.discount} onChange={handleChange} className="add-product-input" />
          </div> */}

          <button type="submit" className="button button-primary add-product-submit">Add Product</button>
        </form>
      </div>
    </div>
  )
}

export default AddProduct