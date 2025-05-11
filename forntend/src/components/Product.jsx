import React from 'react';

const Product = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-content">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">${product.price}</p>
          <p className="product-colors">{product.colors.length} Colors</p>
        </div>
      </div>
      <button className="product-add-to-cart-btn">
        <i className="fas fa-shopping-cart"></i> Add to Cart
      </button>
    </div>
  );
};

export default Product;