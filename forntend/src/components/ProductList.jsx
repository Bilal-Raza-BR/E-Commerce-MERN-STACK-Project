import React from 'react';
import Product from './Product';

const ProductList = ({ title, products }) => {
  return (
    <div className="product-list-container">
      <h2 className="product-list-title">{title}</h2>
      <div className="product-list">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;