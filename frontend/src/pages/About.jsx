import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>Our Story</h1>
          <p>Exceptional quality. Ethical factories. Radical Transparency.</p>
        </div>
      </div>

      <div className="about-section">
        <div className="about-container">
          <div className="about-row">
            <div className="about-col">
              <h2>Our Mission</h2>
              <p>
                At Everlane, we believe in exceptional quality, ethical factories, and radical transparency. 
                We're on a mission to create the most beautiful, high-quality essentials at the best possible price, 
                while being transparent about our process and costs.
              </p>
              <p>
                We partner directly with the best factories around the world to create our products. 
                By cutting out the middleman, we're able to offer premium products without the traditional retail markup.
              </p>
            </div>
            <div className="about-col">
              <img 
                src="https://images.unsplash.com/photo-1551446591-142875a901a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Everlane Workshop" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="about-section bg-light">
        <div className="about-container">
          <div className="about-row reverse">
            <div className="about-col">
              <h2>Radical Transparency</h2>
              <p>
                We believe our customers have a right to know how much their clothes cost to make. 
                We reveal the true costs behind all of our products—from materials to labor to transportation.
              </p>
              <p>
                This approach allows us to show you the markup you're actually paying, and it keeps us accountable 
                to always find the best, most ethical factories around the world.
              </p>
            </div>
            <div className="about-col">
              <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Ethical Manufacturing" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="about-section">
        <div className="about-container">
          <div className="about-row">
            <div className="about-col">
              <h2>Sustainable Practices</h2>
              <p>
                We're committed to reducing our environmental impact and creating products that last. 
                From using recycled materials to eliminating virgin plastic from our supply chain, 
                we're constantly working to make our products more sustainable.
              </p>
              <p>
                By 2023, we aim to eliminate all virgin plastic from our supply chain. 
                We've already made significant progress by using recycled materials in our products 
                and packaging.
              </p>
            </div>
            <div className="about-col">
              <img 
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Sustainable Practices" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="about-team">
        <div className="about-container">
          <h2>Our Team</h2>
          <p className="team-intro">
            We're a team of designers, engineers, supply chain experts, and creative thinkers 
            dedicated to building a better way to make and sell clothing.
          </p>
          
          <div className="team-grid">
            <div className="team-member">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Team Member" 
              />
              <h3>Michael Chen</h3>
              <p>Founder & CEO</p>
            </div>
            <div className="team-member">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Team Member" 
              />
              <h3>Sarah Johnson</h3>
              <p>Head of Design</p>
            </div>
            <div className="team-member">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Team Member" 
              />
              <h3>David Williams</h3>
              <p>Supply Chain Director</p>
            </div>
            <div className="team-member">
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Team Member" 
              />
              <h3>Emily Rodriguez</h3>
              <p>Sustainability Lead</p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-cta">
        <div className="about-container">
          <h2>Join Our Journey</h2>
          <p>
            We're building a new way to make and sell clothing. Join us on our mission to 
            create exceptional quality essentials with radical transparency.
          </p>
          <div className="cta-buttons">
            <a href="/products" className="btn-primary">Shop Now</a>
            <a href="/careers" className="btn-secondary">Join Our Team</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
