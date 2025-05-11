import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/AdminProducts.css';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'men',
    discount: '0',
    rating: '5',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Unauthorized',
        text: 'Please login as admin to access this page',
        icon: 'warning',
        confirmButtonText: 'Go to Login'
      }).then(() => {
        navigate('/admin/login');
      });
    }
    
    // Fetch existing products
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.image) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill all required fields and upload an image',
        icon: 'error'
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Create form data for file upload
      const productFormData = new FormData();
      productFormData.append('name', formData.name);
      productFormData.append('price', formData.price);
      productFormData.append('category', formData.category);
      productFormData.append('discount', formData.discount);
      productFormData.append('rating', formData.rating);
      productFormData.append('image', formData.image);
      
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: productFormData
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        Swal.fire({
          title: 'Success',
          text: 'Product added successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        
        // Reset form
        setFormData({
          name: '',
          price: '',
          category: 'men',
          discount: '0',
          rating: '5',
          image: null
        });
        setImagePreview(null);
        
        // Refresh products list
        fetchProducts();
      } else {
        throw new Error(data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to add product',
        icon: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-products-page">
      <div className="admin-products-header">
        <h1>Product Management</h1>
        <p>Add and manage products for your store</p>
      </div>
      
      <div className="admin-products-container">
        <div className="product-form-container">
          <h2>Add New Product</h2>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label htmlFor="name">Product Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Price*</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category*</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="discount">Discount (%)</label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="Enter discount percentage"
                min="0"
                max="100"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="Enter rating"
                min="1"
                max="5"
                step="0.1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Product Image*</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                required
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Adding Product...' : 'Add Product'}
            </button>
          </form>
        </div>
        
        <div className="products-list-container">
          <h2>Existing Products</h2>
          {loading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <p>No products found. Add your first product!</p>
            </div>
          ) : (
            <div className="products-list">
              {products.map(product => (
                <div key={product._id} className="product-item">
                  <div className="product-item-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-item-details">
                    <h3>{product.name}</h3>
                    <p className="product-item-price">${product.price.toFixed(2)}</p>
                    <p className="product-item-category">{product.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
