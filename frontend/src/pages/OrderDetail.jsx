import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/OrderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire({
            title: 'Login Required',
            text: 'Please login to view order details',
            icon: 'warning',
            confirmButtonText: 'Go to Login'
          }).then(() => {
            navigate('/login');
          });
          return;
        }
        
        setLoading(true);
        
        // Fetch order from API
        const response = await fetch(`http://localhost:5000/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        
        const data = await response.json();
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, navigate]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };
  
  // Get payment status badge class
  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid':
        return 'payment-paid';
      case 'pending':
        return 'payment-pending';
      case 'failed':
        return 'payment-failed';
      default:
        return '';
    }
  };
  
  // Format payment method
  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'paypal':
        return 'PayPal';
      case 'cash_on_delivery':
        return 'Cash on Delivery';
      default:
        return method;
    }
  };
  
  return (
    <div className="order-detail-page">
      <div className="order-detail-container">
        <div className="order-detail-header">
          <Link to="/orders" className="back-to-orders">
            <i className="fas fa-arrow-left"></i> Back to Orders
          </Link>
          <h1 className="order-detail-title">Order Details</h1>
        </div>
        
        {loading ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading order details...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
          </div>
        ) : order ? (
          <div className="order-detail-content">
            <div className="order-info-section">
              <div className="order-info-card">
                <h2>Order Information</h2>
                <div className="order-info-grid">
                  <div className="info-group">
                    <span className="info-label">Order ID:</span>
                    <span className="info-value">{order._id}</span>
                  </div>
                  <div className="info-group">
                    <span className="info-label">Order Date:</span>
                    <span className="info-value">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="info-group">
                    <span className="info-label">Order Status:</span>
                    <span className={`status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </div>
                  <div className="info-group">
                    <span className="info-label">Payment Method:</span>
                    <span className="info-value">{formatPaymentMethod(order.paymentMethod)}</span>
                  </div>
                  <div className="info-group">
                    <span className="info-label">Payment Status:</span>
                    <span className={`status-badge ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="order-info-card">
                <h2>Shipping Address</h2>
                <div className="address-details">
                  <p className="address-name">{order.shippingAddress.name}</p>
                  <p className="address-line">{order.shippingAddress.address}</p>
                  <p className="address-line">
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  </p>
                  <p className="address-line">{order.shippingAddress.country}</p>
                  <p className="address-phone">
                    <i className="fas fa-phone"></i> {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="order-items-section">
              <h2>Order Items</h2>
              <div className="order-items-list">
                {order.items.map(item => (
                  <div className="order-item" key={item._id}>
                    <div className="order-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="order-item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-category">{item.category}</p>
                      <div className="item-price-qty">
                        <span className="item-price">${item.price.toFixed(2)}</span>
                        <span className="item-quantity">Qty: {item.quantity}</span>
                      </div>
                      {item.discount > 0 && (
                        <p className="item-discount">Discount: {item.discount}%</p>
                      )}
                    </div>
                    <div className="order-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-order">
            <i className="fas fa-exclamation-circle"></i>
            <h2>Order Not Found</h2>
            <p>The order you are looking for does not exist or you don't have permission to view it.</p>
            <Link to="/orders" className="back-btn">Back to Orders</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
