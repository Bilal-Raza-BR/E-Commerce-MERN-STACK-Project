import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const EmployeeOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/dashboard/recent-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again later.');
      setLoading(false);
      
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      });
    }
  };
  
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/dashboard/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          status: newStatus
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update the order in the local state
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        ));
        
        Swal.fire({
          title: 'Success',
          text: 'Order status updated successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        throw new Error(data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      });
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus === statusFilter);
  
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p>Loading orders...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="dashboard-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={fetchOrders}>Try Again</button>
      </div>
    );
  }
  
  return (
    <div className="employee-orders">
      <div className="orders-header">
        <h2>Manage Orders</h2>
        <div className="orders-filter">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select 
            id="status-filter" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <div className="orders-table-container">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <i className="fas fa-shopping-bag"></i>
            <p>No orders found</p>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.substring(0, 8)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.user?.name || 'Unknown'}</td>
                  <td>{order.items.length} items</td>
                  <td>{formatCurrency(order.totalAmount)}</td>
                  <td>
                    <span className={`status-badge ${order.orderStatus}`}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="order-actions">
                      <select 
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button 
                        className="view-order-btn"
                        onClick={() => {
                          Swal.fire({
                            title: `Order #${order._id.substring(0, 8)}`,
                            html: `
                              <div style="text-align: left;">
                                <p><strong>Customer:</strong> ${order.user?.name || 'Unknown'}</p>
                                <p><strong>Email:</strong> ${order.user?.email || 'Unknown'}</p>
                                <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
                                <p><strong>Status:</strong> ${order.orderStatus}</p>
                                <p><strong>Total:</strong> ${formatCurrency(order.totalAmount)}</p>
                                <hr>
                                <h4>Items:</h4>
                                <ul style="list-style: none; padding: 0;">
                                  ${order.items.map(item => `
                                    <li style="margin-bottom: 10px;">
                                      <div style="display: flex; align-items: center;">
                                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                                        <div>
                                          <div><strong>${item.name}</strong></div>
                                          <div>Qty: ${item.quantity} x $${item.price}</div>
                                        </div>
                                      </div>
                                    </li>
                                  `).join('')}
                                </ul>
                              </div>
                            `,
                            width: 600,
                            showCloseButton: true,
                            showConfirmButton: false
                          });
                        }}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeOrders;
