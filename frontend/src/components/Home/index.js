import { Component, createRef } from 'react';
import {Link} from 'react-router-dom';
import './index.css';
import { FaHeartbeat, FaStethoscope, FaTooth, FaBrain } from 'react-icons/fa';
import { MdLocalHospital, MdAccessTime, MdPerson } from 'react-icons/md';

/* ---------- SERVICES CARD DATA ---------- */
const servicesData = [
  {
    icon: <FaStethoscope size={40} color="#1c6eb5" />,
    title: 'General Treatment',
    description: 'Complete primary healthcare services for all ages.',
  },
  {
    icon: <FaHeartbeat size={40} color="#e74c3c" />,
    title: 'Cardiology',
    description: 'Advanced heart care with expert cardiologists.',
  },
  {
    icon: <FaBrain size={40} color="#8e44ad" />,
    title: 'Neurology',
    description: 'Diagnosis and treatment of neurological disorders.',
  },
  {
    icon: <FaTooth size={40} color="#27ae60" />,
    title: 'Dental Care',
    description: 'Comprehensive dental and oral health services.',
  },
];

/* ---------- ABOUT FEATURES DATA ---------- */
const aboutFeatures = [
  {
    icon: <MdPerson size={40} color="#f39c12" />,
    title: 'Qualified Doctors',
    text: 'Highly experienced and certified medical professionals.',
  },
  {
    icon: <MdLocalHospital size={40} color="#2980b9" />,
    title: 'Modern Equipment',
    text: 'Latest medical technology for accurate diagnosis.',
  },
  {
    icon: <MdAccessTime size={40} color="#c0392b" />,
    title: '24/7 Emergency',
    text: 'Round-the-clock emergency and critical care services.',
  },
];

/* ---------- SERVICE CARD ---------- */
class ServiceCard extends Component {
  render() {
    const { icon, title, description } = this.props;
    return (
      <div className="service-card">
        <div className="service-icon">{icon}</div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    );
  }
}

/* ---------- ABOUT FEATURE CARD ---------- */
class AboutCard extends Component {
  render() {
    const { icon, title, text } = this.props;
    return (
      <div className="about-card">
        <div className="about-icon">{icon}</div>
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
    );
  }
}

class Home extends Component {
  servicesRef = createRef();
  aboutRef = createRef();
  contactRef = createRef();

  scrollToSection = (ref) => {
    if (!ref.current) return;
    window.scrollTo({
      top: ref.current.offsetTop - 80,
      behavior: 'smooth',
    });
  };

  render() {
    const heroBgImage =
      'https://t4.ftcdn.net/jpg/08/48/68/51/360_F_848685118_p6wvxhWl8ifQNWFVrOE7nkClJ66qV0cR.jpg';

    return (
      <div className="hospital-landing-page">
        {/* ---------- NAVBAR ---------- */}
        <nav className="hospital-nav">
          <div className="nav-container">
            <h1
              className="hospital-logo"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Medi<span>Care</span>
            </h1>

            <ul className="hospital-menu">
              <li onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Home
              </li>
              <li onClick={() => this.scrollToSection(this.servicesRef)}>Services</li>
              <li onClick={() => this.scrollToSection(this.aboutRef)}>About</li>
              <li onClick={() => this.scrollToSection(this.contactRef)}>Contact</li>
            </ul>

            <div className="hospital-actions">
              <Link to="/register">
                <button className="btn-sign">Sign Up</button>
              </Link>

              <Link to="/login">
                <button className="btn-login">Login</button>
              </Link>
            </div>
          </div>
        </nav>

        {/* ---------- HERO ---------- */}
       <section
  className="hero-section"
  style={{
    paddingLeft: '70px',
    backgroundImage: `linear-gradient(rgba(28,110,181,0.3), rgba(28,110,181,0.3)), url(${heroBgImage})`,
  }}
>
  <div className="hero-content">
    <h1>
      Your Health Is <br />
      <span>Our Priority.</span>
    </h1>
    <p>
      Comprehensive healthcare services with modern technology and
      compassionate care.
    </p>

    {/* Changed from button + scroll to Link */}
    <Link to="/login">
      <button className="btn-appointment">
        Book An Appointment →
      </button>
    </Link>
  </div>
</section>

        {/* ---------- SERVICES ---------- */}
        <section className="services-section" ref={this.servicesRef}>
          <h2 className="section-title">Our Medical Services</h2>
          <div className="services-grid">
            {servicesData.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </section>

        {/* ---------- ABOUT ---------- */}
        <section className="about-section" ref={this.aboutRef}>
          <h2 className="section-title">Why Choose MediCare?</h2>
          <p className="about-description">
            We are committed to delivering world-class healthcare services with
            compassion, trust, and innovation.
          </p>

          <div className="about-grid">
            {aboutFeatures.map((item, index) => (
              <AboutCard key={index} {...item} />
            ))}
          </div>
        </section>

        {/* ---------- FOOTER / CONTACT ---------- */}
        <footer className="main-footer" ref={this.contactRef}>
          <div className="footer-content">
            {/* Column 1 */}
            <div className="footer-col">
              <h3>MediCare</h3>
              <p>
                Trusted healthcare provider delivering quality medical services
                with compassion and care.
              </p>
            </div>

            {/* Column 2 */}
            <div className="footer-col">
              <h4>Contact Info</h4>
              <p>📍 123 Healthcare Ave, Chicago, IL 60613</p>
              <p>📞 (773) 555-0123</p>
              <p>✉️ support@medicare.com</p>
            </div>

            {/* Column 3 */}
            <div className="footer-col">
              <h4>Working Hours</h4>
              <p>Mon – Fri: 8:00 AM – 9:00 PM</p>
              <p>Saturday: 9:00 AM – 6:00 PM</p>
              <p>Sunday: Emergency Only</p>
            </div>

            {/* Column 4 */}
            <div className="footer-col">
              <h4>Follow Us</h4>
              <div className="footer-socials">
                <span>📘</span>
                <span>🐦</span>
                <span>📸</span>
                <span>💼</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 MediCare Studios. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    );
  }
}

export default Home;
