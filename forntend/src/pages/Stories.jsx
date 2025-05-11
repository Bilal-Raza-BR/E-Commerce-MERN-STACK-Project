import React from 'react';
import { Link } from 'react-router-dom';

const Stories = () => {
  // Sample stories data
  const stories = [
    {
      id: 1,
      title: "The Making of Our Sustainable Denim",
      excerpt: "How we created jeans with 60% less water and no harmful chemicals.",
      image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      category: "Sustainability",
      date: "May 15, 2023"
    },
    {
      id: 2,
      title: "Meet the Artisans Behind Our Leather Goods",
      excerpt: "A visit to our partner workshop in Florence, Italy where traditional craftsmanship meets modern design.",
      image: "https://images.unsplash.com/photo-1531997410-43dab9f760ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      category: "Factories",
      date: "April 3, 2023"
    },
    {
      id: 3,
      title: "From Plastic Bottles to Performance Wear",
      excerpt: "The innovative process behind our recycled polyester collection.",
      image: "https://images.unsplash.com/photo-1602990721338-9cbb5b983c4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      category: "Innovation",
      date: "March 22, 2023"
    },
    {
      id: 4,
      title: "The True Cost of Fashion",
      excerpt: "Breaking down the real costs behind your favorite garments.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      category: "Transparency",
      date: "February 18, 2023"
    },
    {
      id: 5,
      title: "Designing for Longevity",
      excerpt: "How we create timeless pieces that transcend seasonal trends.",
      image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      category: "Design",
      date: "January 30, 2023"
    },
    {
      id: 6,
      title: "Our Journey to Carbon Neutrality",
      excerpt: "The steps we're taking to offset our carbon footprint and achieve net-zero emissions.",
      image: "https://images.unsplash.com/photo-1569180880150-df4eed93c90b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      category: "Sustainability",
      date: "December 12, 2022"
    }
  ];

  // Categories for filter
  const categories = ["All", "Sustainability", "Factories", "Innovation", "Transparency", "Design"];

  return (
    <div className="stories-page">
      <div className="stories-hero">
        <div className="stories-hero-content">
          <h1>Everlane Stories</h1>
          <p>Discover the stories behind our products, people, and practices.</p>
        </div>
      </div>

      <div className="stories-container">
        <div className="stories-filter">
          <div className="filter-label">Filter by:</div>
          <div className="filter-options">
            {categories.map((category, index) => (
              <button key={index} className={`filter-btn ${category === 'All' ? 'active' : ''}`}>
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="featured-story">
          <div className="featured-story-image">
            <img src={stories[0].image} alt={stories[0].title} />
            <div className="story-category">{stories[0].category}</div>
          </div>
          <div className="featured-story-content">
            <div className="story-date">{stories[0].date}</div>
            <h2>{stories[0].title}</h2>
            <p>{stories[0].excerpt}</p>
            <Link to={`/stories/${stories[0].id}`} className="read-more">
              Read the full story <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>

        <div className="stories-grid">
          {stories.slice(1).map(story => (
            <div className="story-card" key={story.id}>
              <div className="story-image">
                <img src={story.image} alt={story.title} />
                <div className="story-category">{story.category}</div>
              </div>
              <div className="story-content">
                <div className="story-date">{story.date}</div>
                <h3>{story.title}</h3>
                <p>{story.excerpt}</p>
                <Link to={`/stories/${story.id}`} className="read-more">
                  Read more <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="stories-pagination">
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <button className="pagination-btn next">
            Next <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="newsletter-signup">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter to receive the latest stories and updates.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email address" />
              <button className="btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stories;
