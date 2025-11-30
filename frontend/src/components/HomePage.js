import React from 'react';
import { Link } from 'react-router-dom';
// FIX: Corrected the image filename with the .jpg extension
import HeroBackgroundImage from '../hero-background.jpg'; 

const HomePage = () => {
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(46, 25, 143, 0.8), rgba(46, 25, 143, 0.8)), url(${HeroBackgroundImage})`
  };

  return (
    <div className="home-container">
      <section className="hero-section" style={heroStyle}>
        <div className="hero-content">
          <h2>Welcome to the AYUSH Startup Portal</h2>
          <p>Your single gateway to register, track, and grow your AYUSH startup with the support of the Ministry of AYUSH.</p>
          <Link to="/register" className="hero-btn">Register Your Startup</Link>
        </div>
      </section>

   

      <section className="events-section">
        <h3>Events & Announcements</h3>
        <div className="events-grid">
          <div className="event-card">
            <p className="event-date">October 15, 2025</p>
            <h4>Global AYUSH Investment & Innovation Summit</h4>
            {/* FIX: Changed href="#" to a valid path */}
            <a href= "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1819049" className="event-link">Learn More →</a>
          </div>
          <div className="event-card">
            <p className="event-date">November 05, 2025</p>
            <h4>National Ayurveda Day Celebrations & Webinar</h4>
            {/* FIX: Changed href="#" to a valid path */}
            <a href="https://www.ayurvedanama.org/nama-events" className="event-link">Register Now →</a>
          </div>
          <div className="event-card">
            <p className="event-date">December 10, 2025</p>
            <h4>Workshop on GMP for AYUSH Startups</h4>
            {/* FIX: Changed href="#" to a valid path */}
            <a href="https://www.devdiscourse.com/article/health/3693820-strong-governance-intent-can-bridge-regulatory-gaps-rbi-deputy-governor-asserts" className="event-link">View Details →</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

