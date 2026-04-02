import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import '../styles/Cart.css';

const Cart = () => {
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login page without showing alert
      navigate('/login');
    }
  }, [navigate]);

  // Get cart data and functions from context
  const {
    cartItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  // Calculate subtotal (same as totalPrice from context)
  const subtotal = totalPrice;

  // Shipping cost (free over $100)
  const shipping = subtotal >= 100 ? 0 : 5.99;

  // Tax (estimated at 8%)
  const tax = subtotal * 0.08;

  // Total
  const total = subtotal + shipping + tax;



  // Handle clear cart
  const handleClearCart = () => {
    Swal.fire({
      title: 'Clear Cart?',
      text: 'Are you sure you want to remove all items from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear cart',
      cancelButtonText: 'No, keep items'
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire('Cart Cleared', 'Your cart has been emptied.', 'success');
      }
    });
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <i className="fas fa-shopping-cart empty-cart-icon"></i>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-header">
                <div className="cart-header-product">Product</div>
                <div className="cart-header-price">Price</div>
                <div className="cart-header-quantity">Quantity</div>
                <div className="cart-header-total">Total</div>
              </div>

              {cartItems.map(item => (
                <div className="cart-item" key={item._id}>
                  <div className="cart-item-product">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-meta">Category: {item.category}</p>
                      {item.discount > 0 && (
                        <p className="cart-item-meta">Discount: {item.discount}%</p>
                      )}
                      <button
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <i className="fas fa-trash-alt"></i> Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-price">${item.price.toFixed(2)}</div>

                  <div className="cart-item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>

                  <div className="cart-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="summary-row">
                <span>Estimated Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="promo-code">
                <input type="text" placeholder="Enter promo code" />
                <button className="btn-secondary">Apply</button>
              </div>

              <button
                className="checkout-btn"
                onClick={() => navigate('/checkout')}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>

              <button className="clear-cart-btn" onClick={handleClearCart}>
                Clear Cart
              </button>

              <div className="continue-shopping">
                <Link to="/">
                  <i className="fas fa-arrow-left"></i> Continue Shopping
                </Link>
              </div>

              <div className="payment-methods">
                <p>We accept:</p>
                <div className="payment-icons">
                  <i className="fab fa-cc-visa"></i>
                  <i className="fab fa-cc-mastercard"></i>
                  <i className="fab fa-cc-amex"></i>
                  <i className="fab fa-cc-paypal"></i>
                  <i className="fab fa-cc-apple-pay"></i>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
