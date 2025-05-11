import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/Products.css';

const Men = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Fetch men's products from MongoDB through our API
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // This will fetch data from MongoDB that was seeded by seedProduct.js
        const response = await fetch('http://localhost:5000/api/products/men');

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        console.log('Men products from MongoDB:', data);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Sort products based on selected option
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default: // newest
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Men's Collection</h1>
        <p>Discover our latest collection of high-quality men's essentials</p>
      </div>

      <div className="products-filters">
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="newest">Newest</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <i className="fas fa-box-open"></i>
          <p>No products found. Check back soon!</p>
        </div>
      ) : (
        <div className="products-grid">
          {sortedProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Men;
