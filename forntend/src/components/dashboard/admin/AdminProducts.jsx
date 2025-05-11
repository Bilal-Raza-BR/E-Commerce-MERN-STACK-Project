import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    discount: '',
    rating: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
      setLoading(false);
      
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      });
    }
  };
  
  const handleInputChange = (e) => {
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
  
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      discount: '',
      rating: '',
      description: '',
      image: null
    });
    setImagePreview(null);
  };
  
  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };
  
  const closeAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };
  
  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      discount: product.discount || '',
      rating: product.rating || '',
      description: product.description || '',
      image: null
    });
    setImagePreview(product.image);
    setShowEditModal(true);
  };
  
  const closeEditModal = () => {
    setShowEditModal(false);
    setCurrentProduct(null);
    resetForm();
  };
  
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in all required fields (name, price, category, image)',
        icon: 'warning'
      });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Create form data for file upload
      const productFormData = new FormData();
      productFormData.append('name', formData.name);
      productFormData.append('price', formData.price);
      productFormData.append('category', formData.category);
      
      if (formData.discount) {
        productFormData.append('discount', formData.discount);
      }
      
      if (formData.rating) {
        productFormData.append('rating', formData.rating);
      }
      
      if (formData.description) {
        productFormData.append('description', formData.description);
      }
      
      productFormData.append('image', formData.image);
      
      const response = await fetch('http://localhost:5000/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: productFormData
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        Swal.fire({
          title: 'Success',
          text: 'Product added successfully',
          icon: 'success'
        });
        
        closeAddModal();
        fetchProducts(); // Refresh product list
      } else {
        throw new Error(data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      });
    }
  };
  
  const handleEditProduct = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.price || !formData.category) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in all required fields (name, price, category)',
        icon: 'warning'
      });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Create form data for file upload
      const productFormData = new FormData();
      productFormData.append('name', formData.name);
      productFormData.append('price', formData.price);
      productFormData.append('category', formData.category);
      
      if (formData.discount) {
        productFormData.append('discount', formData.discount);
      }
      
      if (formData.rating) {
        productFormData.append('rating', formData.rating);
      }
      
      if (formData.description) {
        productFormData.append('description', formData.description);
      }
      
      if (formData.image) {
        productFormData.append('image', formData.image);
      }
      
      const response = await fetch(`http://localhost:5000/admin/products/${currentProduct._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: productFormData
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        Swal.fire({
          title: 'Success',
          text: 'Product updated successfully',
          icon: 'success'
        });
        
        closeEditModal();
        fetchProducts(); // Refresh product list
      } else {
        throw new Error(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      });
    }
  };
  
  const handleDeleteProduct = (productId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          
          const response = await fetch(`http://localhost:5000/admin/products/${productId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Product has been deleted.',
              icon: 'success'
            });
            
            fetchProducts(); // Refresh product list
          } else {
            throw new Error(data.message || 'Failed to delete product');
          }
        } catch (error) {
          console.error('Error deleting product:', error);
          Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
          });
        }
      }
    });
  };
  
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p>Loading products...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="dashboard-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={fetchProducts}>Try Again</button>
      </div>
    );
  }
  
  return (
    <div className="admin-products">
      <div className="products-header">
        <h2>Products Management</h2>
        <button className="add-product-btn" onClick={openAddModal}>
          <i className="fas fa-plus"></i> Add New Product
        </button>
      </div>
      
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-products">No products found</td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product._id}>
                  <td>
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.discount ? `${product.discount}%` : '-'}</td>
                  <td>{product.rating ? product.rating : '-'}</td>
                  <td>
                    <div className="product-actions">
                      <button 
                        className="edit-btn" 
                        onClick={() => openEditModal(product)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Product</h3>
              <button className="close-modal" onClick={closeAddModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label htmlFor="name">Product Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price*</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="discount">Discount (%)</label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    min="1"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
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
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeAddModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Product</h3>
              <button className="close-modal" onClick={closeEditModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleEditProduct}>
              <div className="form-group">
                <label htmlFor="edit-name">Product Name*</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-price">Price*</label>
                  <input
                    type="number"
                    id="edit-price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-category">Category*</label>
                  <select
                    id="edit-category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-discount">Discount (%)</label>
                  <input
                    type="number"
                    id="edit-discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-rating">Rating</label>
                  <input
                    type="number"
                    id="edit-rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="1"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-image">Product Image</label>
                <input
                  type="file"
                  id="edit-image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
