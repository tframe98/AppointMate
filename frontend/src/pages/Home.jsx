import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar"; // Import Navbar
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <>
      <Navbar />
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <h1>Effortless Appointment Scheduling</h1>
          <p>Streamline your booking process with our intuitive scheduling platform.</p>
          <button className="hero-button" onClick={() => navigate("/signup")}>
            Get Started
          </button>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Easy Scheduling</h3>
            <p>Allow clients to book appointments effortlessly from your website.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Dashboard Overview</h3>
            <p>Get a quick glance at your upcoming bookings and business performance.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Client Management</h3>
            <p>Keep track of client details and appointment history with ease.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>Customizable Services</h3>
            <p>Define and customize the services you offer with ease.</p>
          </div>
        </section>

        {/* Call to Action (Sign-Up Section) */}
        <section className="cta-section">
          <h2>Start Booking Smarter Today</h2>
          <p>Sign up now and let your clients schedule with ease.</p>
          <button className="cta-button" onClick={() => navigate("/signup")}>
            Sign Up Now
          </button>
        </section>

        {/* Pricing Section */}
        <section className="pricing-section">
          <h2>Choose Your Plan</h2>
          <div className="pricing-container">
            <div className="pricing-card">
              <h3>Basic</h3>
              <p>Perfect for freelancers</p>
              <div className="pricing-price">$9.99/month</div>
              <button className="pricing-button" onClick={() => navigate("/signup")}>
                Get Started
              </button>
            </div>
            <div className="pricing-card">
              <h3>Pro</h3>
              <p>Great for small businesses</p>
              <div className="pricing-price">$19.99/month</div>
              <button className="pricing-button" onClick={() => navigate("/signup")}>
                Get Started
              </button>
            </div>
            <div className="pricing-card">
              <h3>Enterprise</h3>
              <p>For larger teams and enterprises</p>
              <div className="pricing-price">$49.99/month</div>
              <button className="pricing-button" onClick={() => navigate("/signup")}>
                Get Started
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} AppointMate. All Rights Reserved.</p>
          <p><a href="mailto:support@appointmate.com">support@appointmate.com</a></p>
        </footer>
      </div>
    </>
  );
};

export default Home;