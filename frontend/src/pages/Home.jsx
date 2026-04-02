import React from 'react';
import ProductList from '../components/ProductList';

const Home = () => {
  // Sample product data (in a real app, this would come from an API)
  const featuredProducts = [
    {
      id: 1,
      name: 'The Organic Cotton Crew',
      price: 18,
      colors: ['White', 'Black', 'Navy', 'Gray'],
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 2,
      name: 'The Performance Chino',
      price: 68,
      colors: ['Khaki', 'Black', 'Navy', 'Olive'],
      image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 3,
      name: 'The Day Glove',
      price: 115,
      colors: ['Black', 'White', 'Tan', 'Rose'],
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 4,
      name: 'The Oversized Blazer',
      price: 175,
      colors: ['Black', 'Charcoal', 'Camel'],
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }
  ];

  const newArrivals = [
    {
      id: 5,
      name: 'The Linen Shirt',
      price: 58,
      colors: ['White', 'Blue', 'Striped'],
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 6,
      name: 'The Track Jogger',
      price: 68,
      colors: ['Black', 'Gray', 'Navy'],
      image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 7,
      name: 'The Cashmere Sweater',
      price: 100,
      colors: ['Camel', 'Gray', 'Black', 'Burgundy'],
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 8,
      name: 'The Denim Jacket',
      price: 88,
      colors: ['Light Wash', 'Medium Wash', 'Dark Wash'],
      image: 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }
  ];

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Quality Essentials, Ethically Made</h1>
          <p>Designed to last, priced with transparency.</p>
          <div className="hero-buttons">
            <a href="/women" className="btn-primary">Shop Women</a>
            <a href="/men" className="btn-primary">Shop Men</a>
          </div>
        </div>
        <div className="hero-badge">
          <span>New Season</span>
          <span className="badge-highlight">2025</span>
        </div>
      </div>

      <div className="featured-categories">
        <div className="category-card">
          <div className="category-image-container">
            <img src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Women's Category" />
            <div className="category-overlay"></div>
          </div>
          <h3>Women's Collection</h3>
          <a href="/women" className="btn-secondary">Shop Now</a>
        </div>
        <div className="category-card">
          <div className="category-image-container">
            <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Men's Category" />
            <div className="category-overlay"></div>
          </div>
          <h3>Men's Collection</h3>
          <a href="/men" className="btn-secondary">Shop Now</a>
        </div>
        <div className="category-card">
          <div className="category-image-container">
            <img src="https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Accessories Category" />
            <div className="category-overlay"></div>
          </div>
          <h3>Accessories</h3>
          <a href="/accessories" className="btn-secondary">Coming Soon</a>
        </div>
      </div>

      <ProductList title="Featured Products" products={featuredProducts} />

      <div className="banner">
        <div className="banner-content">
          <h2>Sustainable Fashion</h2>
          <p>We believe in exceptional quality, ethical factories, and radical transparency.</p>
          <button className="btn-primary">Learn More</button>
        </div>
      </div>

      <ProductList title="New Arrivals" products={newArrivals} />

      <div className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-container">
          <div className="testimonial">
            <p>"The quality is outstanding. These pieces will last for years."</p>
            <p className="testimonial-author">- Sarah K.</p>
          </div>
          <div className="testimonial">
            <p>"I love the transparency about where and how my clothes are made."</p>
            <p className="testimonial-author">- Michael T.</p>
          </div>
          <div className="testimonial">
            <p>"Classic styles that never go out of fashion. Worth every penny."</p>
            <p className="testimonial-author">- Emma L.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;