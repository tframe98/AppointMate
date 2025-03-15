import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; 
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <section className="hero-section">
          <h1>Effortless Appointment Scheduling</h1>
          <p>Streamline your booking process with our intuitive scheduling platform.</p>
          <button className="hero-button" onClick={() => handleNavigation("/signup")} aria-label="Sign up for AppointMate">
            Get Started
          </button>
        </section>

        <section className="features-section">
          <div className="features-container">
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
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <div className="cta-text">
              <h2>Start Booking Smarter Today</h2>
              <p>Sign up now and let your clients schedule with ease.</p>
              <ul className="cta-list">
                <li>✅ Instant Booking - Clients can book in just a few clicks.</li>
                <li>✅ Automated Reminders - Reduce no-shows effortlessly.</li>
                <li>✅ Client Management - Keep track of your client history.</li>
                <li>✅ Custom Schedules - Set availability and prevent overbooking.</li>
              </ul>
              <button className="cta-button" onClick={() => handleNavigation("/signup")} aria-label="Sign up now">
                Sign Up Now
              </button>
            </div>
            <div className="cta-image">
              <img src="./imgs/man.png" alt="Booking App Preview" />
            </div>
          </div>
        </section>

        <section className="pricing-section">
          <h2>Choose Your Plan</h2>
          <div className="pricing-container">
            <div className="pricing-card">
              <h3>Basic</h3>
              <p>Perfect for freelancers</p>
              <div className="pricing-price">$9.99/month</div>
              <button className="pricing-button" onClick={() => handleNavigation("/signup")} aria-label="Sign up for Basic plan">
                Get Started
              </button>
            </div>
            <div className="pricing-card">
              <h3>Pro</h3>
              <p>Great for small businesses</p>
              <div className="pricing-price">$19.99/month</div>
              <button className="pricing-button" onClick={() => handleNavigation("/signup")} aria-label="Sign up for Pro plan">
                Get Started
              </button>
            </div>
            <div className="pricing-card">
              <h3>Enterprise</h3>
              <p>For larger teams and enterprises</p>
              <div className="pricing-price">$49.99/month</div>
              <button className="pricing-button" onClick={() => handleNavigation("/signup")} aria-label="Sign up for Enterprise plan">
                Get Started
              </button>
            </div>
          </div>
        </section>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} AppointMate. All Rights Reserved.</p>
          <p>
            <a href="mailto:support@appointmate.com" rel="noopener noreferrer">
              support@appointmate.com
            </a>
          </p>
        </footer>
      </div>
    </>
  );
};

export default Home;