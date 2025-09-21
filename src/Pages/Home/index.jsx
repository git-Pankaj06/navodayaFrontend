import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Bar } from 'react-chartjs-2';
import 'leaflet/dist/leaflet.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Location data
const locationData = {
  countries: [
    { id: 'in', name: 'India' },
    { id: 'us', name: 'United States' },
    { id: 'uk', name: 'United Kingdom' },
    { id: 'ca', name: 'Canada' },
    { id: 'au', name: 'Australia' },
    { id: 'ae', name: 'United Arab Emirates' },
    { id: 'sg', name: 'Singapore' },
  ],
  states: [
    { id: 'dl', name: 'Delhi', country: 'in' },
    { id: 'mh', name: 'Maharashtra', country: 'in' },
    { id: 'ka', name: 'Karnataka', country: 'in' },
    { id: 'tn', name: 'Tamil Nadu', country: 'in' },
    { id: 'up', name: 'Uttar Pradesh', country: 'in' },
    { id: 'tg', name: 'Telangana', country: 'in' },
    { id: 'kl', name: 'Kerala', country: 'in' },
    { id: 'gj', name: 'Gujarat', country: 'in' },
    { id: 'rj', name: 'Rajasthan', country: 'in' },
    { id: 'wb', name: 'West Bengal', country: 'in' },
    { id: 'ny', name: 'New York', country: 'us' },
    { id: 'ca', name: 'California', country: 'us' },
    { id: 'tx', name: 'Texas', country: 'us' },
    { id: 'fl', name: 'Florida', country: 'us' },
    { id: 'il', name: 'Illinois', country: 'us' },
    { id: 'ln', name: 'London', country: 'uk' },
    { id: 'wm', name: 'West Midlands', country: 'uk' },
    { id: 'gm', name: 'Greater Manchester', country: 'uk' },
    { id: 'on', name: 'Ontario', country: 'ca' },
    { id: 'qc', name: 'Quebec', country: 'ca' },
    { id: 'bc', name: 'British Columbia', country: 'ca' },
    { id: 'ns', name: 'New South Wales', country: 'au' },
    { id: 'vc', name: 'Victoria', country: 'au' },
    { id: 'qa', name: 'Queensland', country: 'au' },
    { id: 'dz', name: 'Dubai', country: 'ae' },
    { id: 'ab', name: 'Abu Dhabi', country: 'ae' },
    { id: 'ce', name: 'Central', country: 'sg' },
  ],
  cities: [
    { id: 'new_delhi', name: 'New Delhi', state: 'dl' },
    { id: 'mumbai', name: 'Mumbai', state: 'mh' },
    { id: 'pune', name: 'Pune', state: 'mh' },
    { id: 'bangalore', name: 'Bangalore', state: 'ka' },
    { id: 'chennai', name: 'Chennai', state: 'tn' },
    { id: 'lucknow', name: 'Lucknow', state: 'up' },
    { id: 'hyderabad', name: 'Hyderabad', state: 'tg' },
    { id: 'kochi', name: 'Kochi', state: 'kl' },
    { id: 'ahmedabad', name: 'Ahmedabad', state: 'gj' },
    { id: 'jaipur', name: 'Jaipur', state: 'rj' },
    { id: 'kolkata', name: 'Kolkata', state: 'wb' },
    { id: 'new_york_city', name: 'New York City', state: 'ny' },
    { id: 'buffalo', name: 'Buffalo', state: 'ny' },
    { id: 'los_angeles', name: 'Los Angeles', state: 'ca' },
    { id: 'san_francisco', name: 'San Francisco', state: 'ca' },
    { id: 'houston', name: 'Houston', state: 'tx' },
    { id: 'dallas', name: 'Dallas', state: 'tx' },
    { id: 'miami', name: 'Miami', state: 'fl' },
    { id: 'orlando', name: 'Orlando', state: 'fl' },
    { id: 'chicago', name: 'Chicago', state: 'il' },
    { id: 'london', name: 'London', state: 'ln' },
    { id: 'birmingham', name: 'Birmingham', state: 'wm' },
    { id: 'manchester', name: 'Manchester', state: 'gm' },
    { id: 'toronto', name: 'Toronto', state: 'on' },
    { id: 'ottawa', name: 'Ottawa', state: 'on' },
    { id: 'montreal', name: 'Montreal', state: 'qc' },
    { id: 'vancouver', name: 'Vancouver', state: 'bc' },
    { id: 'sydney', name: 'Sydney', state: 'ns' },
    { id: 'melbourne', name: 'Melbourne', state: 'vc' },
    { id: 'brisbane', name: 'Brisbane', state: 'qa' },
    { id: 'dubai', name: 'Dubai', state: 'dz' },
    { id: 'abu_dhabi', name: 'Abu Dhabi', state: 'ab' },
    { id: 'singapore', name: 'Singapore', state: 'ce' },
  ]
};

const Home = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [stats, setStats] = useState({
    totalAlumni: 15327,
    countries: 27,
    schools: 661,
    active: 3892
  });
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    country: '',
    state: '',
    city: '',
    mobile: '',
    school: '',
    passingYear: '',
    memory: ''
  });
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  // Update filtered states when country changes
  useEffect(() => {
    if (formData.country) {
      const states = locationData.states.filter(state => state.country === formData.country);
      setFilteredStates(states);
      setFormData(prev => ({ ...prev, state: '', city: '' }));
    } else {
      setFilteredStates([]);
      setFilteredCities([]);
    }
  }, [formData.country]);

  // Update filtered cities when state changes
  useEffect(() => {
    if (formData.state) {
      const cities = locationData.cities.filter(city => city.state === formData.state);
      setFilteredCities(cities);
      setFormData(prev => ({ ...prev, city: '' }));
    } else {
      setFilteredCities([]);
    }
  }, [formData.state]);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalAlumni: prev.totalAlumni + 1,
        countries: prev.countries,
        schools: prev.schools,
        active: prev.active + Math.round(Math.random() * 2)
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const alumniLocations = [
    {lat: 28.6139, lng: 77.2090, name: "New Delhi", count: 1250},
    {lat: 19.0760, lng: 72.8777, name: "Mumbai", count: 980},
    {lat: 12.9716, lng: 77.5946, name: "Bengaluru", count: 875},
    {lat: 13.0827, lng: 80.2707, name: "Chennai", count: 756},
    {lat: 17.3850, lng: 78.4867, name: "Hyderabad", count: 689},
    {lat: 22.5726, lng: 88.3639, name: "Kolkata", count: 645},
    {lat: 26.9124, lng: 75.7873, name: "Jaipur", count: 523},
    {lat: 40.7128, lng: -74.0060, name: "New York", count: 342},
    {lat: 51.5074, lng: -0.1278, name: "London", count: 287},
    {lat: 37.7749, lng: -122.4194, name: "San Francisco", count: 231},
    {lat: 1.3521, lng: 103.8198, name: "Singapore", count: 198},
    {lat: 25.276987, lng: 55.296249, name: "Dubai", count: 176}
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','July','Aug','Sep','Oct','Nov','Dec'],
    datasets: [
      {
        label: 'New Alumni Registrations',
        data: [65, 59, 80, 81, 56, 72,46,89,55,89,23,106],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Alumni Registration Growth',
      },
    },
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJoinClick = () => {
    setShowJoinForm(true);
    scrollToSection('join');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for joining the Navodaya Alumni Community! We will contact you soon.');
    setFormData({
      name: '',
      fatherName: '',
      country: '',
      state: '',
      city: '',
      mobile: '',
      school: '',
      passingYear: '',
      memory: ''
    });
    setShowJoinForm(false);
  };

  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-text">Navodaya Alumni</div>
        </div>
        
        <ul className="nav-links">
          {['home', 'features', 'map', 'query', 'about', 'join'].map(section => (
            <li key={section}>
              <a 
                href={`#${section}`} 
                className={activeSection === section ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(section);
                }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            </li>
          ))}
        </ul>
        
        <div className="auth-buttons">
          <button className="login-btn">Login</button>
          <button className="register-btn" onClick={handleJoinClick}>Join Community</button>
        </div>
        
        <div className="menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <h1>Connecting Navodayans Worldwide</h1>
        <p>A unified platform for Jawahar Navodaya Vidyalaya alumni to connect, collaborate, and support each other across the globe.</p>
        <a href="#join" className="cta-button" onClick={(e) => { e.preventDefault(); handleJoinClick(); }}>Join Our Community</a>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-title">
          <h2>Platform Features</h2>
          <p>Discover how our platform helps you reconnect with fellow Navodayans</p>
        </div>
        
        <div className="features-grid">
          {[
            {icon: 'map-marked-alt', title: 'Alumni Heat Map', desc: 'Visualize the global distribution of Navodaya alumni with our interactive heat map.'},
            {icon: 'chart-line', title: 'Community Statistics', desc: 'Track community growth with real-time statistics on alumni engagement.'},
            {icon: 'hands-helping', title: 'Query Board', desc: 'Seek and offer help through our AI-powered query system.'},
            {icon: 'network-wired', title: 'Networking', desc: 'Build professional connections and explore career opportunities.'}
          ].map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <i className={`fas fa-${feature.icon}`}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section" id="map">
        <div className="section-title">
          <h2>Alumni Distribution Map</h2>
          <p>Explore the global presence of Navodaya alumni with our interactive heat map</p>
        </div>
        
        <div className="map-container">
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {alumniLocations.map((location, index) => (
              <CircleMarker
                key={index}
                center={[location.lat, location.lng]}
                radius={Math.log(location.count) * 3}
                fillColor="#1a73e8"
                color="#0d47a1"
                weight={1}
                opacity={1}
                fillOpacity={0.7}
              >
                <Popup>
                  <strong>{location.name}</strong><br />
                  Alumni: {location.count}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        
        <div className="stats-container">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="stat-box">
              <div className="stat-number">{value.toLocaleString()}</div>
              <div className="stat-label">
                {key === 'totalAlumni' && 'Total Alumni'}
                {key === 'countries' && 'Countries'}
                {key === 'schools' && 'Schools'}
                {key === 'active' && 'Active Members'}
              </div>
            </div>
          ))}
        </div>

        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </section>

      {/* Join Community Form Section */}
      <section className="join-section" id="join">
        <div className="section-title">
          <h2>Join Navodaya Alumni Community</h2>
          <p>Become part of our growing network of Navodayans across the globe</p>
        </div>
        
        <div className="form-container">
          <form className="join-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fatherName">Father's Name</label>
                <input 
                  type="text" 
                  id="fatherName" 
                  name="fatherName" 
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  placeholder="Enter your father's name" 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country">Current Country *</label>
                <select 
                  id="country" 
                  name="country" 
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Country</option>
                  {locationData.countries.map(country => (
                    <option key={country.id} value={country.id}>{country.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="state">Current State *</label>
                <select 
                  id="state" 
                  name="state" 
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.country}
                >
                  <option value="">Select State</option>
                  {filteredStates.map(state => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
                {!formData.country && (
                  <div className="field-note">Please select a country first</div>
                )}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Current City *</label>
                <select 
                  id="city" 
                  name="city" 
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.state}
                >
                  <option value="">Select City</option>
                  {filteredCities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
                {!formData.state && (
                  <div className="field-note">Please select a state first</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input 
                  type="tel" 
                  id="mobile" 
                  name="mobile" 
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter your mobile number" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="school">Navodaya School *</label>
                <select 
                  id="school" 
                  name="school" 
                  value={formData.school}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Your School</option>
                  <option value="JNV Almora">JNV Almora, Uttarakhand</option>
                  <option value="JNV Banda">JNV Banda, Uttar Pradesh</option>
                  <option value="JNV Chittoor">JNV Chittoor, Andhra Pradesh</option>
                  <option value="JNV Dhanbad">JNV Dhanbad, Jharkhand</option>
                  <option value="JNV Ernakulam">JNV Ernakulam, Kerala</option>
                  <option value="JNV Faridabad">JNV Faridabad, Haryana</option>
                  <option value="JNV Guntur">JNV Guntur, Andhra Pradesh</option>
                  <option value="JNV Hisar">JNV Hisar, Haryana</option>
                  <option value="Other">Other Navodaya School</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="passingYear">Passing Year *</label>
                <select 
                  id="passingYear" 
                  name="passingYear" 
                  value={formData.passingYear}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Year</option>
                  {Array.from({length: 35}, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="memory">Favorite Memory at Navodaya</label>
              <textarea 
                id="memory" 
                name="memory" 
                value={formData.memory}
                onChange={handleInputChange}
                placeholder="Share your favorite memory from your Navodaya days..." 
                rows="4"
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn">Join Now</button>
          </form>
        </div>
      </section>

      {/* Query Board Section */}
      <section className="query-board" id="query">
        <div className="section-title">
          <h2>Alumni Query Board</h2>
          <p>Seek help, offer support, and connect with fellow Navodayans</p>
        </div>
        
        <div className="query-container">
          <h3>Post Your Query</h3>
          <form className="query-form">
            <div className="form-group">
              <label htmlFor="queryType">Query Type</label>
              <select id="queryType">
                <option value="">Select a category</option>
                <option value="career">Career Advice</option>
                <option value="education">Higher Education</option>
                <option value="relocation">Relocation Help</option>
                <option value="mentorship">Mentorship</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="queryTitle">Title</label>
              <input type="text" id="queryTitle" placeholder="Brief title of your query" />
            </div>
            
            <div className="form-group">
              <label htmlFor="queryDescription">Description</label>
              <textarea id="queryDescription" placeholder="Describe your query in detail"></textarea>
            </div>
            
            <button type="submit" className="submit-btn">Submit Query</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer id="about">
        <div className="footer-content">
          <div className="footer-logo">Navodaya Alumni Community</div>
          
          <ul className="footer-links">
            {['home', 'features', 'map', 'join', 'query', 'about', 'privacy', 'terms'].map(link => (
              <li key={link}>
                <a href={`#${link}`}>{link.charAt(0).toUpperCase() + link.slice(1)}</a>
              </li>
            ))}
          </ul>
          
          <div className="social-icons">
            {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map(social => (
              <a key={social} href="#">
                <i className={`fab fa-${social}`}></i>
              </a>
            ))}
          </div>
          
          <div className="copyright">
            &copy; 2023 Navodaya Alumni Community. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Poppins', sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8f9fa;
        }
        
        /* Navbar Styles */
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 5%;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        .navbar.scrolled {
          padding: 0.8rem 5%;
        }
        
        .logo {
          display: flex;
          align-items: center;
        }
        
        .logo img {
          height: 40px;
          margin-right: 10px;
        }
        
        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a73e8;
        }
        
        .nav-links {
          display: flex;
          list-style: none;
        }
        
        .nav-links li {
          margin: 0 15px;
        }
        
        .nav-links a {
          text-decoration: none;
          color: #444;
          font-weight: 500;
          font-size: 1rem;
          transition: color 0.3s;
          position: relative;
          padding: 6px 0;
        }
        
        .nav-links a.active {
          color: #1a73e8;
        }
        
        .nav-links a.active:after {
          width: 100%;
        }
        
        .nav-links a:after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: #1a73e8;
          transition: width 0.3s;
        }
        
        .nav-links a:hover:after {
          width: 100%;
        }
        
        .nav-links a:hover {
          color: #1a73e8;
        }
        
        .auth-buttons {
          display: flex;
          align-items: center;
        }
        
        .login-btn, .register-btn {
          padding: 8px 20px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .login-btn {
          color: #1a73e8;
          background: transparent;
          border: 1px solid #1a73e8;
          margin-right: 10px;
        }
        
        .login-btn:hover {
          background: #1a73e8;
          color: white;
        }
        
        .register-btn {
          background: #1a73e8;
          color: white;
          border: 1px solid #1a73e8;
        }
        
        .register-btn:hover {
          background: #0d5bba;
        }
        
        .menu-toggle {
          display: none;
          flex-direction: column;
          cursor: pointer;
        }
        
        .menu-toggle span {
          width: 25px;
          height: 3px;
          background: #1a73e8;
          margin: 2px 0;
          border-radius: 2px;
          transition: all 0.3s;
        }
        
        /* Hero Section */
        .hero {
          padding: 8rem 5% 5rem;
          background: linear-gradient(120deg, #1a73e8 0%, #6c5ce7 100%);
          color: white;
          text-align: center;
        }
        
        .hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        
        .hero p {
          font-size: 1.2rem;
          max-width: 800px;
          margin: 0 auto 2rem;
        }
        
        .cta-button {
          display: inline-block;
          padding: 12px 30px;
          background: white;
          color: #1a73e8;
          border-radius: 30px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }
        
        /* Section Styles */
        section {
          padding: 5rem 5%;
        }
        
        .section-title {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .section-title h2 {
          font-size: 2.5rem;
          color: #1a73e8;
          margin-bottom: 1rem;
        }
        
        .section-title p {
          color: #666;
          max-width: 700px;
          margin: 0 auto;
        }
        
        /* Features Section */
        .features {
          background: white;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .feature-card {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 2rem;
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          font-size: 2.5rem;
          color: #1a73e8;
          margin-bottom: 1rem;
        }
        
        .feature-card h3 {
          margin-bottom: 1rem;
          color: #333;
        }
        
        /* Map Section */
        .map-section {
          background: #f8f9fa;
        }
        
        .map-container {
          height: 500px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
        }
        
        .stats-container {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          margin-top: 3rem;
          gap: 1rem;
        }
        
        .stat-box {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          text-align: center;
          min-width: 200px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a73e8;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          color: #666;
          font-weight: 500;
        }
        
        .chart-container {
          margin-top: 3rem;
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        /* Join Form Section */
        .join-section {
          background: white;
        }
        
        .form-container {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 2rem;
          margin: 0 auto;
          max-width: 800px;
        }
        
        .join-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #444;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .field-note {
          font-size: 0.8rem;
          color: #666;
          margin-top: 0.3rem;
          font-style: italic;
        }
        
        /* Query Board Section */
        .query-board {
          background: white;
        }
        
        .query-container {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .query-form {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        .submit-btn {
          background: #1a73e8;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s;
          font-size: 1rem;
          margin-top: 1rem;
        }
        
        .submit-btn:hover {
          background: #0d5bba;
        }
        
        /* Footer */
        footer {
          background: #1a237e;
          color: white;
          padding: 3rem 5%;
          text-align: center;
        }
        
        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .footer-logo {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .footer-links {
          display: flex;
          list-style: none;
          margin: 1.5rem 0;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .footer-links li {
          margin: 0 15px;
        }
        
        .footer-links a {
          color: white;
          text-decoration: none;
          transition: color 0.3s;
        }
        
        .footer-links a:hover {
          color: #8ab4f8;
        }
        
        .social-icons {
          margin: 1.5rem 0;
        }
        
        .social-icons a {
          color: white;
          font-size: 1.5rem;
          margin: 0 10px;
          transition: color 0.3s;
        }
        
        .social-icons a:hover {
          color: #8ab4f8;
        }
        
        .copyright {
          margin-top: 1.5rem;
          color: #ccc;
          font-size: 0.9rem;
        }
        
        /* Responsive Styles */
        @media (max-width: 992px) {
          .nav-links {
            display: none;
          }
          
          .menu-toggle {
            display: flex;
          }
          
          .hero h1 {
            font-size: 2.5rem;
          }
          
          .stats-container {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          
          .stat-box {
            width: 100%;
            max-width: 300px;
            margin-bottom: 1rem;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2rem;
          }
          
          .hero p {
            font-size: 1rem;
            padding: 0 1rem;
          }
          
          .section-title h2 {
            font-size: 2rem;
          }
          
          .feature-card {
            padding: 1.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .navbar {
            padding: 1rem 5%;
          }
          
          .logo-text {
            font-size: 1.2rem;
          }
          
          .auth-buttons {
            display: none;
          }
          
          .hero {
            padding: 6rem 5% 3rem;
          }
          
          section {
            padding: 3rem 5%;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;