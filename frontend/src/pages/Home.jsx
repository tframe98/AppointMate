import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Power Your Business with AppointMate</h1>
        <p>Manage appointments seamlessly and grow your business.</p>
        <button className="cta-button" onClick={() => navigate('/auth')}>
          Get Started for Free
        </button>
      </header>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="step-cards">
          <div className="step-card">
            <h3>1. Create Your Account</h3>
            <p>Sign up, set your availability, and customize your services.</p>
          </div>
          <div className="step-card">
            <h3>2. Connect Your Website</h3>
            <p>Embed our booking widget on your website with ease.</p>
          </div>
          <div className="step-card">
            <h3>3. Manage Appointments</h3>
            <p>Track bookings, view customer details, and get reminders.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;