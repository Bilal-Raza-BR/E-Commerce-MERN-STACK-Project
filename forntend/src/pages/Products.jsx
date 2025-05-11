import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';

const Products = () => {
  // Sample product data (in a real app, this would come from an API)
  const [products] = useState([
    {
      _id: '1',
      name: 'Premium Cotton T-Shirt',
      price: 29.99,
      discount: 15,
      rating: 4.5,
      reviews: Array(18),
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      _id: '2',
      name: 'Slim Fit Jeans',
      price: 59.99,
      discount: 0,
      rating: 4.2,
      reviews: Array(24),
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      _id: '3',
      name: 'Classic Oxford Shirt',
      price: 49.99,
      discount: 10,
      rating: 4.7,
      reviews: Array(32),
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      _id: '4',
      name: 'Leather Jacket',
      price: 199.99,
      discount: 20,
      rating: 4.8,
      reviews: Array(15),
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      _id: '5',
      name: 'Casual Sneakers',
      price: 79.99,
      discount: 0,
      rating: 4.4,
      reviews: Array(27),
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      _id: '6',
      name: 'Wool Sweater',
      price: 89.99,
      discount: 5,
      rating: 4.3,
      reviews: Array(19),
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ]);

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>All Products</h1>
        <p>Discover our latest collection of high-quality products</p>
      </div>
      
      <div className="products-filters">
        <div className="filter-group">
          <label>Sort by:</label>
          <select>
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Category:</label>
          <select>
            <option>All Categories</option>
            <option>Clothing</option>
            <option>Shoes</option>
            <option>Accessories</option>
          </select>
        </div>
      </div>
      
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
