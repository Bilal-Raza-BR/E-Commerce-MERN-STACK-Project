import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  
  const [dashboardData, setDashboardData] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Product form state
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'men',
    discount: '0',
    rating: '5',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Not Logged In!',
        text: 'Please login to access the dashboard',
        icon: 'warning',
        confirmButtonText: 'Go to Login'
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    // Decode JWT token to get user data
    try {
      // Split the token into parts
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      // Decode the payload part (second part)
      const payload = JSON.parse(atob(tokenParts[1]));

      // Fetch user data from server using the email from token
      fetchUserData(payload.email);
    } catch (error) {
      console.error('Error decoding token:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Could not verify your login. Please login again.',
        icon: 'error',
        confirmButtonText: 'Go to Login'
      }).then(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });
    }
  }, [navigate]);

  const fetchUserData = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/user?email=${email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();

      // Check if user has admin or employee role
      if (data.role !== 'admin' && data.role !== 'employee') {
        Swal.fire({
          title: 'Access Denied',
          text: 'You do not have permission to access the dashboard',
          icon: 'error',
          confirmButtonText: 'Go to Home'
        }).then(() => {
          navigate('/');
        });
        return;
      }

      setUserData(data);
      setLoading(false);

      // Fetch initial data based on active tab
      if (activeTab === 'overview') {
        fetchDashboardStats();
      } else if (activeTab === 'customers') {
        fetchCustomers();
      } else if (activeTab === 'orders') {
        fetchOrders();
      } else if (activeTab === 'products' && data.role === 'admin') {
        fetchProducts();
      } else if (activeTab === 'employees' && data.role === 'admin') {
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load user data. Please try again later.',
        icon: 'error',
        confirmButtonText: 'Go to Home'
      }).then(() => {
        navigate('/');
      });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // Fetch data based on active tab
    if (tab === 'overview') {
      fetchDashboardStats();
    } else if (tab === 'customers') {
      fetchCustomers();
    } else if (tab === 'orders') {
      fetchOrders();
    } else if (tab === 'products' && userData.role === 'admin') {
      fetchProducts();
    } else if (tab === 'employees' && userData.role === 'admin') {
      fetchEmployees();
    }
  };

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      setDataLoading(true);
      const token = localStorage.getItem('token');

      console.log('Fetching dashboard stats for role:', userData.role);

      const endpoint = userData.role === 'admin'
        ? 'http://localhost:5000/admin/stats'
        : 'http://localhost:5000/dashboard/employee-stats';

      console.log('Using endpoint:', endpoint);

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', response.status, errorText);
        throw new Error(`Failed to fetch dashboard stats: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Dashboard data received:', data);
      setDashboardData(data);
      setDataLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);

      // Retry once after a short delay
      setTimeout(async () => {
        try {
          console.log('Retrying dashboard stats fetch...');
          const token = localStorage.getItem('token');

          const endpoint = userData.role === 'admin'
            ? 'http://localhost:5000/admin/stats'
            : 'http://localhost:5000/dashboard/employee-stats';

          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch dashboard stats on retry');
          }

          const data = await response.json();
          console.log('Dashboard data received on retry:', data);
          setDashboardData(data);
          setDataLoading(false);
        } catch (retryError) {
          console.error('Error on retry:', retryError);
          Swal.fire({
            title: 'Error',
            text: 'Failed to load dashboard data. Please try refreshing the page.',
            icon: 'error'
          });
          setDataLoading(false);
        }
      }, 2000); // Retry after 2 seconds
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setDataLoading(true);
      const token = localStorage.getItem('token');

      const endpoint = userData.role === 'admin'
        ? 'http://localhost:5000/admin/users'
        : 'http://localhost:5000/dashboard/customers';

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      setCustomers(data);
      setDataLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load customers data',
        icon: 'error'
      });
      setDataLoading(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setDataLoading(true);
      const token = localStorage.getItem('token');

      const endpoint = userData.role === 'admin'
        ? 'http://localhost:5000/admin/orders'
        : 'http://localhost:5000/dashboard/recent-orders';

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
      setDataLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load orders data',
        icon: 'error'
      });
      setDataLoading(false);
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete this order. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDataLoading(true);
          const token = localStorage.getItem('token');

          const response = await fetch(`http://localhost:5000/dashboard/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete order');
          }

          const data = await response.json();

          if (data.success) {
            // Remove the deleted order from the state
            setOrders(orders.filter(order => order._id !== orderId));

            Swal.fire(
              'Deleted!',
              'Order has been deleted successfully.',
              'success'
            );
          } else {
            throw new Error(data.message || 'Failed to delete order');
          }
        } catch (error) {
          console.error('Error deleting order:', error);
          Swal.fire(
            'Error!',
            error.message || 'Failed to delete order',
            'error'
          );
        } finally {
          setDataLoading(false);
        }
      }
    });
  };

  // Fetch products (admin only)
  const fetchProducts = async () => {
    try {
      setDataLoading(true);
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
      setDataLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load products data',
        icon: 'error'
      });
      setDataLoading(false);
    }
  };

  // Delete product (admin only)
  const handleDeleteProduct = async (productId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete this product. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDataLoading(true);
          const token = localStorage.getItem('token');

          const response = await fetch(`http://localhost:5000/admin/products/${productId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete product');
          }

          const data = await response.json();

          if (data.success) {
            // Remove the deleted product from the state
            setProducts(products.filter(product => product._id !== productId));

            Swal.fire(
              'Deleted!',
              'Product has been deleted successfully.',
              'success'
            );
          } else {
            throw new Error(data.message || 'Failed to delete product');
          }
        } catch (error) {
          console.error('Error deleting product:', error);
          Swal.fire(
            'Error!',
            error.message || 'Failed to delete product',
            'error'
          );
        } finally {
          setDataLoading(false);
        }
      }
    });
  };

  // Fetch employees (admin only)
  const fetchEmployees = async () => {
    try {
      setDataLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/admin/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }

      const data = await response.json();
      setEmployees(data);
      setDataLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load employees data',
        icon: 'error'
      });
      setDataLoading(false);
    }
  };

  // Delete employee (admin only)
  const handleDeleteEmployee = async (employeeId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete this employee. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDataLoading(true);
          const token = localStorage.getItem('token');

          const response = await fetch(`http://localhost:5000/admin/employees/${employeeId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete employee');
          }

          const data = await response.json();

          if (data.success) {
            // Remove the deleted employee from the state
            setEmployees(employees.filter(employee => employee._id !== employeeId));

            Swal.fire(
              'Deleted!',
              'Employee has been deleted successfully.',
              'success'
            );
          } else {
            throw new Error(data.message || 'Failed to delete employee');
          }
        } catch (error) {
          console.error('Error deleting employee:', error);
          Swal.fire(
            'Error!',
            error.message || 'Failed to delete employee',
            'error'
          );
        } finally {
          setDataLoading(false);
        }
      }
    });
  };

  // Handle product form input change
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm({
      ...productForm,
      [name]: value
    });
  };

  // Handle product image change
  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductForm({
        ...productForm,
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

  // Reset product form
  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      category: 'men',
      discount: '0',
      rating: '5',
      description: '',
      image: null
    });
    setImagePreview(null);
  };

  // Handle edit product button click
  const handleEditClick = (product) => {
    // Set edit mode
    setIsEditMode(true);
    setCurrentProductId(product._id);

    // Populate form with product data
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      discount: product.discount ? product.discount.toString() : '0',
      rating: product.rating ? product.rating.toString() : '5',
      description: product.description || '',
      image: null
    });

    // Set image preview
    setImagePreview(product.image);

    // Show modal
    setShowProductModal(true);
  };

  // Update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    // Validate form
    if (!productForm.name || !productForm.price || !productForm.category) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in all required fields (name, price, category)',
        icon: 'warning'
      });
      return;
    }

    try {
      setDataLoading(true);

      // Create form data for file upload
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('discount', productForm.discount || '0');
      formData.append('rating', productForm.rating || '5');

      if (productForm.description) {
        formData.append('description', productForm.description);
      }

      // Only append image if a new one was selected
      if (productForm.image instanceof File) {
        formData.append('image', productForm.image);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/admin/products/${currentProductId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        console.log('Response text:', responseText);
        throw new Error('Server returned invalid JSON response');
      }

      if (response.ok && data.success) {
        Swal.fire({
          title: 'Success',
          text: 'Product updated successfully',
          icon: 'success'
        });

        // Close modal and reset form
        setShowProductModal(false);
        resetProductForm();
        setIsEditMode(false);
        setCurrentProductId(null);

        // Refresh products list
        fetchProducts();
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
    } finally {
      setDataLoading(false);
    }
  };

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Validate form
    if (!productForm.name || !productForm.price || !productForm.category || !productForm.image) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in all required fields (name, price, category, image)',
        icon: 'warning'
      });
      return;
    }

    try {
      setDataLoading(true);

      // First, test if the Cloudinary configuration is working
      console.log('Testing Cloudinary configuration...');
      try {
        const testResponse = await fetch('http://localhost:5000/api/test-cloudinary');
        const testData = await testResponse.json();
        console.log('Cloudinary test response:', testData);
      } catch (error) {
        console.error('Error testing Cloudinary:', error);
      }

      // Create form data for file upload
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('discount', productForm.discount || '0');
      formData.append('rating', productForm.rating || '5');

      if (productForm.description) {
        formData.append('description', productForm.description);
      }

      // Check if image is a File object
      if (!(productForm.image instanceof File)) {
        throw new Error('The image is not a valid File object');
      }

      console.log('Image file details:', {
        name: productForm.image.name,
        type: productForm.image.type,
        size: productForm.image.size
      });

      formData.append('image', productForm.image);

      // Log the form data being sent
      console.log('Sending form data:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Check if image is properly attached
      const imageFile = formData.get('image');
      console.log('Image file:', imageFile);

      if (!imageFile) {
        throw new Error('No image file attached to form data');
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Get response as text first for debugging
      const responseText = await response.text();
      console.log('Response text:', responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing JSON:', e);

        // If response is HTML (likely an error page), show a more helpful error
        if (responseText.includes('<!DOCTYPE html>')) {
          throw new Error('Server returned HTML instead of JSON. The server might be down or experiencing issues.');
        } else {
          throw new Error('Server returned invalid JSON response: ' + responseText.substring(0, 100));
        }
      }

      if (response.ok && data.success) {
        Swal.fire({
          title: 'Success',
          text: 'Product added successfully',
          icon: 'success'
        });

        // Close modal and reset form
        setShowProductModal(false);
        resetProductForm();

        // Refresh products list
        fetchProducts();
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
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <a href="/" className="logo">
            <i className="fas fa-store"></i>
            <span>E-Commerce</span>
          </a>
        </div>

        <div className="sidebar-menu">
          <h3>Main</h3>
          <ul>
            <li
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => handleTabChange('overview')}
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Overview</span>
            </li>

            <li
              className={activeTab === 'orders' ? 'active' : ''}
              onClick={() => handleTabChange('orders')}
            >
              <i className="fas fa-shopping-cart"></i>
              <span>Orders</span>
            </li>

            <li
              className={activeTab === 'customers' ? 'active' : ''}
              onClick={() => handleTabChange('customers')}
            >
              <i className="fas fa-users"></i>
              <span>Customers</span>
            </li>
          </ul>

          {userData.role === 'admin' && (
            <>
              <h3>Admin</h3>
              <ul>
                <li
                  className={activeTab === 'products' ? 'active' : ''}
                  onClick={() => handleTabChange('products')}
                >
                  <i className="fas fa-box"></i>
                  <span>Products</span>
                </li>

                <li
                  className={activeTab === 'employees' ? 'active' : ''}
                  onClick={() => handleTabChange('employees')}
                >
                  <i className="fas fa-user-tie"></i>
                  <span>Employees</span>
                </li>

                <li
                  className={activeTab === 'settings' ? 'active' : ''}
                  onClick={() => handleTabChange('settings')}
                >
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </li>
              </ul>
            </>
          )}

          <h3>Account</h3>
          <ul>
            <li
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => handleTabChange('profile')}
            >
              <i className="fas fa-user"></i>
              <span>Profile</span>
            </li>

            <li onClick={() => {
              localStorage.removeItem('token');
              window.dispatchEvent(new Event('loginStatusChanged'));
              navigate('/login');
            }}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <a href="/" className="back-to-site">
            <i className="fas fa-arrow-left"></i>
            <span>Back to Website</span>
          </a>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span className="user-name">{userData.name}</span>
            <span className="user-role">{userData.role}</span>
          </div>
        </div>

        <div className="dashboard-main">
          {activeTab === 'overview' ? (
            dataLoading ? (
              <div className="dashboard-loading">
                <div className="spinner">
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
                <p>Loading dashboard data...</p>
              </div>
            ) : dashboardData ? (
            <div className="dashboard-overview">
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon customers">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-details">
                    <h3>{dashboardData.totalCustomers || 0}</h3>
                    <p>Total Customers</p>
                  </div>
                </div>

                {userData.role === 'admin' && (
                  <div className="stat-card">
                    <div className="stat-icon employees">
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <div className="stat-details">
                      <h3>{dashboardData.totalEmployees || 0}</h3>
                      <p>Total Employees</p>
                    </div>
                  </div>
                )}

                <div className="stat-card">
                  <div className="stat-icon orders">
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                  <div className="stat-details">
                    <h3>{dashboardData.totalOrders || 0}</h3>
                    <p>Total Orders</p>
                  </div>
                </div>

                {userData.role === 'admin' && (
                  <div className="stat-card">
                    <div className="stat-icon revenue">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="stat-details">
                      <h3>${dashboardData.totalRevenue ? dashboardData.totalRevenue.toFixed(2) : '0.00'}</h3>
                      <p>Total Revenue</p>
                    </div>
                  </div>
                )}
              </div>

              {dashboardData.recentOrders && dashboardData.recentOrders.length > 0 && (
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>Recent Orders</h3>
                    <button className="view-all" onClick={() => handleTabChange('orders')}>
                      View All
                    </button>
                  </div>
                  <div className="recent-orders">
                    <table>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentOrders.map(order => (
                          <tr key={order._id}>
                            <td>#{order._id.substring(0, 8)}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>
                              <span className={`status-badge ${order.orderStatus}`}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                              </span>
                            </td>
                            <td>${order.totalAmount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            ) : (
              <div className="no-data-message">
                <i className="fas fa-chart-bar"></i>
                <p>No dashboard data available</p>
              </div>
            )
          ) : activeTab === 'customers' ? (
            <div className="dashboard-customers">
              {dataLoading ? (
                <div className="dashboard-loading">
                  <div className="spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                  </div>
                  <p>Loading customers...</p>
                </div>
              ) : customers.length === 0 ? (
                <div className="no-data-message">
                  <i className="fas fa-users"></i>
                  <p>No customers found</p>
                </div>
              ) : (
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>Customer List</h3>
                  </div>
                  <div className="customers-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Contact</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map(customer => (
                          <tr key={customer._id}>
                            <td>
                              <div className="customer-name">
                                <div className="customer-avatar">
                                  {customer.name ? customer.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span>{customer.name || 'Unknown'}</span>
                              </div>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.contact || 'N/A'}</td>
                            <td>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'orders' ? (
            <div className="dashboard-orders">
              {dataLoading ? (
                <div className="dashboard-loading">
                  <div className="spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                  </div>
                  <p>Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="no-data-message">
                  <i className="fas fa-shopping-cart"></i>
                  <p>No orders found</p>
                </div>
              ) : (
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>Order List</h3>
                  </div>
                  <div className="orders-table">
                  <table>
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
                      {orders.map(order => (
                        <tr key={order._id}>
                          <td>#{order._id.substring(0, 8)}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="customer-info">
                              <div className="customer-name">
                                <div className="customer-avatar">
                                  {order.user?.name ? order.user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="customer-details">
                                  <span className="name">{order.user?.name || 'Unknown'}</span>
                                  <span className="email">{order.user?.email || 'No email'}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="order-items-preview">
                              <span className="items-count">{order.items?.length || 0} items</span>
                              {order.items && order.items.length > 0 && (
                                <div className="items-tooltip">
                                  {order.items.slice(0, 3).map((item, index) => (
                                    <div key={index} className="tooltip-item">
                                      <span className="item-name">{item.name}</span>
                                      <span className="item-qty">x{item.quantity}</span>
                                    </div>
                                  ))}
                                  {order.items.length > 3 && (
                                    <div className="tooltip-more">
                                      +{order.items.length - 3} more items
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>${order.totalAmount?.toFixed(2) || '0.00'}</td>
                          <td>
                            <span className={`status-badge ${order.orderStatus}`}>
                              {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="view-btn"
                                onClick={() => {
                                  // Create a custom modal for order details
                                  const orderModal = document.createElement('div');
                                  orderModal.className = 'custom-modal';

                                  // Create modal content
                                  orderModal.innerHTML = `
                                    <div class="custom-modal-overlay"></div>
                                    <div class="custom-modal-container">
                                      <div class="custom-modal-header">
                                        <h2>Order #${order._id.substring(0, 8)}</h2>
                                        <button class="custom-modal-close">&times;</button>
                                      </div>
                                      <div class="custom-modal-body">
                                        <div class="order-details-grid">
                                          <div class="order-detail-card">
                                            <h3>Customer Information</h3>
                                            <div class="detail-item">
                                              <span class="detail-label">Name:</span>
                                              <span class="detail-value">${order.user?.name || 'Unknown'}</span>
                                            </div>
                                            <div class="detail-item">
                                              <span class="detail-label">Email:</span>
                                              <span class="detail-value">${order.user?.email || 'Unknown'}</span>
                                            </div>
                                            <div class="detail-item">
                                              <span class="detail-label">Contact:</span>
                                              <span class="detail-value">${order.user?.contact || 'N/A'}</span>
                                            </div>
                                          </div>

                                          <div class="order-detail-card">
                                            <h3>Order Information</h3>
                                            <div class="detail-item">
                                              <span class="detail-label">Order ID:</span>
                                              <span class="detail-value id">${order._id}</span>
                                            </div>
                                            <div class="detail-item">
                                              <span class="detail-label">Date:</span>
                                              <span class="detail-value">${new Date(order.createdAt).toLocaleString()}</span>
                                            </div>
                                            <div class="detail-item">
                                              <span class="detail-label">Status:</span>
                                              <span class="detail-value">
                                                <span class="status-badge ${order.orderStatus}">
                                                  ${order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                                </span>
                                              </span>
                                            </div>
                                            <div class="detail-item">
                                              <span class="detail-label">Payment:</span>
                                              <span class="detail-value">${order.paymentMethod ? order.paymentMethod.replace('_', ' ').toUpperCase() : 'N/A'}</span>
                                            </div>
                                          </div>
                                        </div>

                                        ${order.shippingAddress ? `
                                          <div class="order-detail-card">
                                            <h3>Shipping Address</h3>
                                            <div class="address-grid">
                                              <div>
                                                <div class="detail-item">
                                                  <span class="detail-label">Name:</span>
                                                  <span class="detail-value">${order.shippingAddress.name}</span>
                                                </div>
                                                <div class="detail-item">
                                                  <span class="detail-label">Phone:</span>
                                                  <span class="detail-value">${order.shippingAddress.phone}</span>
                                                </div>
                                              </div>
                                              <div>
                                                <div class="detail-item">
                                                  <span class="detail-label">Address:</span>
                                                  <span class="detail-value">${order.shippingAddress.address}</span>
                                                </div>
                                                <div class="detail-item">
                                                  <span class="detail-label">City:</span>
                                                  <span class="detail-value">${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</span>
                                                </div>
                                                <div class="detail-item">
                                                  <span class="detail-label">Country:</span>
                                                  <span class="detail-value">${order.shippingAddress.country}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ` : ''}

                                        <div class="order-detail-card">
                                          <h3>Order Summary</h3>
                                          <div class="summary-item">
                                            <span>Subtotal</span>
                                            <span>$${order.totalAmount?.toFixed(2) || '0.00'}</span>
                                          </div>
                                          <div class="summary-item">
                                            <span>Shipping</span>
                                            <span>$0.00</span>
                                          </div>
                                          <div class="summary-item total">
                                            <span>Total</span>
                                            <span>$${order.totalAmount?.toFixed(2) || '0.00'}</span>
                                          </div>
                                        </div>

                                        <div class="order-detail-card">
                                          <h3>Order Items (${order.items?.length || 0})</h3>
                                          <div class="order-items-table">
                                            <table>
                                              <thead>
                                                <tr>
                                                  <th>Item</th>
                                                  <th>Quantity</th>
                                                  <th>Price</th>
                                                  <th>Total</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                ${order.items?.map(item => `
                                                  <tr>
                                                    <td>
                                                      <div class="item-info">
                                                        <img src="${item.image}" alt="${item.name}">
                                                        <div>
                                                          <div class="item-name">${item.name}</div>
                                                          <div class="item-category">${item.category || ''}</div>
                                                        </div>
                                                      </div>
                                                    </td>
                                                    <td>${item.quantity}</td>
                                                    <td>$${item.price?.toFixed(2) || '0.00'}</td>
                                                    <td>$${(item.quantity * item.price)?.toFixed(2) || '0.00'}</td>
                                                  </tr>
                                                `).join('') || ''}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  `;

                                  // Add modal to body
                                  document.body.appendChild(orderModal);

                                  // Add event listener to close button
                                  const closeButton = orderModal.querySelector('.custom-modal-close');
                                  closeButton.addEventListener('click', () => {
                                    document.body.removeChild(orderModal);
                                  });

                                  // Add event listener to overlay for closing
                                  const overlay = orderModal.querySelector('.custom-modal-overlay');
                                  overlay.addEventListener('click', () => {
                                    document.body.removeChild(orderModal);
                                  });

                                  // Prevent closing when clicking on the modal content
                                  const modalContainer = orderModal.querySelector('.custom-modal-container');
                                  modalContainer.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                  });
                                }}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteOrder(order._id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              )}
            </div>
          ) : activeTab === 'products' && userData.role === 'admin' ? (
            <div className="dashboard-products">
              <div className="products-header">
                <h2>Products Management</h2>
                <button className="add-product-btn" onClick={() => setShowProductModal(true)}>
                  <i className="fas fa-plus"></i> Add New Product
                </button>
              </div>

              {dataLoading ? (
                <div className="dashboard-loading">
                  <div className="spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                  </div>
                  <p>Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="no-data-message">
                  <i className="fas fa-box"></i>
                  <p>No products found</p>
                  <button className="add-btn" onClick={() => setShowProductModal(true)}>
                    Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map(product => (
                    <div className="product-card" key={product._id}>
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="product-details">
                        <h3>{product.name}</h3>
                        <p className="product-category">{product.category}</p>
                        <div className="product-price-row">
                          <span className="product-price">${product.price.toFixed(2)}</span>
                          {product.discount > 0 && (
                            <span className="product-discount">-{product.discount}%</span>
                          )}
                        </div>
                      </div>
                      <div className="product-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditClick(product)}
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
                    </div>
                  ))}
                </div>
              )}

              {/* Product Modal (Add/Edit) */}
              {showProductModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h3>{isEditMode ? 'Edit Product' : 'Add New Product'}</h3>
                      <button className="close-modal" onClick={() => {
                        setShowProductModal(false);
                        resetProductForm();
                        setIsEditMode(false);
                        setCurrentProductId(null);
                      }}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <form onSubmit={isEditMode ? handleUpdateProduct : handleAddProduct}>
                      <div className="form-group">
                        <label htmlFor="name">Product Name*</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={productForm.name}
                          onChange={handleProductInputChange}
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
                            value={productForm.price}
                            onChange={handleProductInputChange}
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
                            value={productForm.category}
                            onChange={handleProductInputChange}
                            required
                          >
                            <option value="men">Men</option>
                            <option value="women">Women</option>
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
                            value={productForm.discount}
                            onChange={handleProductInputChange}
                            min="0"
                            max="100"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="rating">Rating (1-5)</label>
                          <input
                            type="number"
                            id="rating"
                            name="rating"
                            value={productForm.rating}
                            onChange={handleProductInputChange}
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
                          value={productForm.description}
                          onChange={handleProductInputChange}
                          rows="3"
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label htmlFor="image">Product Image{isEditMode ? '' : '*'}</label>
                        <input
                          type="file"
                          id="image"
                          name="image"
                          onChange={handleProductImageChange}
                          accept="image/*"
                          required={!isEditMode}
                        />
                        {imagePreview && (
                          <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                          </div>
                        )}
                      </div>

                      <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={() => {
                          setShowProductModal(false);
                          resetProductForm();
                          setIsEditMode(false);
                          setCurrentProductId(null);
                        }}>
                          Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={dataLoading}>
                          {dataLoading
                            ? (isEditMode ? 'Updating...' : 'Adding...')
                            : (isEditMode ? 'Update Product' : 'Add Product')
                          }
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'employees' && userData.role === 'admin' ? (
            <div className="dashboard-employees">
              <div className="employees-header">
                <h2>Employees Management</h2>
              </div>

              {dataLoading ? (
                <div className="dashboard-loading">
                  <div className="spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                  </div>
                  <p>Loading employees...</p>
                </div>
              ) : employees.length === 0 ? (
                <div className="no-data-message">
                  <i className="fas fa-user-tie"></i>
                  <p>No employees found</p>
                </div>
              ) : (
                <div className="employees-table-container">
                  <table className="employees-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Joined</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map(employee => (
                        <tr key={employee._id}>
                          <td>
                            <div className="employee-name">
                              <div className="employee-avatar">
                                {employee.name ? employee.name.charAt(0).toUpperCase() : 'E'}
                              </div>
                              <span>{employee.name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td>{employee.email}</td>
                          <td>{employee.contact || 'N/A'}</td>
                          <td>{employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}</td>
                          <td>
                            <span className="status-badge active">Active</span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="view-btn"
                                onClick={() => {
                                  // Create a custom modal for employee details
                                  const employeeModal = document.createElement('div');
                                  employeeModal.className = 'custom-modal';

                                  // Create modal content
                                  employeeModal.innerHTML = `
                                    <div class="custom-modal-overlay"></div>
                                    <div class="custom-modal-container employee-modal">
                                      <div class="custom-modal-header">
                                        <h2>${employee.name || 'Employee Details'}</h2>
                                        <button class="custom-modal-close">&times;</button>
                                      </div>
                                      <div class="custom-modal-body">
                                        <div class="employee-profile-header">
                                          <div class="employee-avatar">
                                            ${employee.name ? employee.name.charAt(0).toUpperCase() : 'E'}
                                          </div>
                                          <div class="employee-title">
                                            <h3>${employee.name || 'Unknown'}</h3>
                                            <span class="role-badge">${employee.role}</span>
                                          </div>
                                        </div>

                                        <div class="order-detail-card">
                                          <h3>Contact Information</h3>
                                          <div class="detail-item">
                                            <span class="detail-label">Email:</span>
                                            <span class="detail-value">${employee.email}</span>
                                          </div>
                                          <div class="detail-item">
                                            <span class="detail-label">Phone:</span>
                                            <span class="detail-value">${employee.contact || 'N/A'}</span>
                                          </div>
                                        </div>

                                        <div class="order-detail-card">
                                          <h3>Account Information</h3>
                                          <div class="detail-item">
                                            <span class="detail-label">Employee ID:</span>
                                            <span class="detail-value id">${employee._id}</span>
                                          </div>
                                          <div class="detail-item">
                                            <span class="detail-label">Joined Date:</span>
                                            <span class="detail-value">${employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}</span>
                                          </div>
                                          <div class="detail-item">
                                            <span class="detail-label">Status:</span>
                                            <span class="detail-value">
                                              <span class="status-badge active">Active</span>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  `;

                                  // Add modal to body
                                  document.body.appendChild(employeeModal);

                                  // Add event listener to close button
                                  const closeButton = employeeModal.querySelector('.custom-modal-close');
                                  closeButton.addEventListener('click', () => {
                                    document.body.removeChild(employeeModal);
                                  });

                                  // Add event listener to overlay for closing
                                  const overlay = employeeModal.querySelector('.custom-modal-overlay');
                                  overlay.addEventListener('click', () => {
                                    document.body.removeChild(employeeModal);
                                  });

                                  // Prevent closing when clicking on the modal content
                                  const modalContainer = employeeModal.querySelector('.custom-modal-container');
                                  modalContainer.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                  });
                                }}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteEmployee(employee._id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeTab === 'settings' ? (
            <div className="dashboard-settings">
              <h2>Settings</h2>

              <div className="settings-section">
                <h3>General Settings</h3>
                <div className="settings-option">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <div className="option-text">
                    <p>Dark Mode</p>
                    <span>Switch between light and dark theme</span>
                  </div>
                </div>

                <div className="settings-option">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <div className="option-text">
                    <p>Email Notifications</p>
                    <span>Receive email notifications for new orders</span>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Security Settings</h3>
                <div className="settings-action">
                  <button className="settings-btn">
                    <i className="fas fa-key"></i> Change Password
                  </button>
                </div>

                <div className="settings-action">
                  <button className="settings-btn">
                    <i className="fas fa-shield-alt"></i> Two-Factor Authentication
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'profile' ? (
            <div className="dashboard-profile">
              <div className="profile-header">
                <div className="profile-avatar">
                  <div className="avatar-circle large">
                    <span className="avatar-initials">
                      {userData?.name ? userData.name.charAt(0).toUpperCase() : userData?.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="profile-info">
                  <h2>{userData?.name || 'User'}</h2>
                  <p>{userData?.email}</p>
                  <span className="role-badge">{userData?.role}</span>
                </div>
              </div>

              <div className="profile-details">
                <div className="profile-section">
                  <h3>Personal Information</h3>
                  <div className="profile-info-grid">
                    <div className="info-item">
                      <div className="info-label">
                        <i className="fas fa-user"></i>
                        <span>Name</span>
                      </div>
                      <div className="info-value">{userData?.name || 'Not set'}</div>
                    </div>

                    <div className="info-item">
                      <div className="info-label">
                        <i className="fas fa-envelope"></i>
                        <span>Email</span>
                      </div>
                      <div className="info-value">{userData?.email}</div>
                    </div>

                    <div className="info-item">
                      <div className="info-label">
                        <i className="fas fa-phone"></i>
                        <span>Contact</span>
                      </div>
                      <div className="info-value">{userData?.contact || 'Not set'}</div>
                    </div>

                    <div className="info-item">
                      <div className="info-label">
                        <i className="fas fa-user-tag"></i>
                        <span>Role</span>
                      </div>
                      <div className="info-value">{userData?.role}</div>
                    </div>
                  </div>
                </div>

                {/* <div className="profile-stats-cards">
                  <div className="profile-stat-card">
                    <div className="stat-icon orders">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="stat-content">
                      <h4>Orders</h4>
                      <p>12</p>
                    </div>
                  </div>

                  <div className="profile-stat-card">
                    <div className="stat-icon wishlist">
                      <i className="fas fa-heart"></i>
                    </div>
                    <div className="stat-content">
                      <h4>Wishlist</h4>
                      <p>5</p>
                    </div>
                  </div>

                  <div className="profile-stat-card">
                    <div className="stat-icon reviews">
                      <i className="fas fa-star"></i>
                    </div>
                    <div className="stat-content">
                      <h4>Reviews</h4>
                      <p>8</p>
                    </div>
                  </div>
                </div> */}

                <div className="profile-actions">
                  <button className="edit-profile-btn">
                    <i className="fas fa-edit"></i> Edit Profile
                  </button>
                  <button className="change-password-btn">
                    <i className="fas fa-key"></i> Change Password
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="dashboard-placeholder">
              <i className="fas fa-cogs"></i>
              <h2>Welcome to the Dashboard</h2>
              <p>Select a tab from the sidebar to view different data.</p>
              <p>Your role: <strong>{userData.role}</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
