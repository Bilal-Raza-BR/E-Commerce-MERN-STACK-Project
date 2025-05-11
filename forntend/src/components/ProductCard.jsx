import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProductCard = ({ product }) => {
  // Get addToCart function from context
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Generate a unique key if _id is not available
  const productId = product._id || `product-${Math.random().toString(36).substr(2, 9)}`;

  // Handle add to cart click
  const handleAddToCart = () => {
    // Check if user is logged in (token exists in localStorage)
    const token = localStorage.getItem('token');

    if (!token) {
      // User is not logged in, show message and redirect to login page
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to add items to your cart',
        icon: 'warning',
        confirmButtonText: 'Go to Login',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    // User is logged in, add to cart
    addToCart(product);

    // Show success message
    Swal.fire({
      title: 'Added to Cart!',
      text: `${product.name} has been added to your cart.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      position: 'top-end',
      toast: true
    });
  };

  return (
    <div className="product-card-container" key={productId}>
      <div className="product-card-content">
        <div className="product-card-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-card-info">
          <h3 className="product-card-name">{product.name}</h3>
          <div className="product-card-price">
            <span>${product.price.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="discount">
                ${(product.price + (product.price * product.discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
          <div className="product-card-rating">
            <div className="stars">
              {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={`fa fa-star ${index < Math.floor(product.rating) ? 'filled' : ''}`}
                ></i>
              ))}
            </div>
          </div>
          <div className="product-category">
            <span>{product.category}</span>
          </div>
        </div>
      </div>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        <i className="fas fa-shopping-cart"></i> Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
