import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; 

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const isLoggedIn = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole') || 'Guest';
  // Retrieve the username (default to 'User' if not found)
  const username = localStorage.getItem('username') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username'); // Clear it on logout
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        
        {/* LOGO */}
        <Link to="/" style={styles.logoContainer}>
          <svg 
            width="32" height="32" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: '#6366f1' }} 
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <polygon points="10 7 15 10 10 13"></polygon>
            <line x1="2" y1="21" x2="22" y2="21"></line>
          </svg>
          <h2 style={styles.logoText}>Pulse Video</h2>
        </Link>

        {/* LINKS */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              
              {/* PROFILE DROPDOWN */}
              <div 
                className="profile-menu-container"
                onMouseEnter={() => setShowDropdown(true)} // Open on Hover
                onMouseLeave={() => setShowDropdown(false)} // Close on Leave
              >
                <button className="profile-trigger-btn">
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', 
                    background: '#6366f1', color: 'white', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', fontSize: '12px'
                  }}>
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <span>{username}</span>
                  <span style={{fontSize: '10px', opacity: 0.7}}>▼</span>
                </button>

                {showDropdown && (
                  <div className="profile-dropdown-menu">
                    <div className="dropdown-info">
                      <span className="dropdown-role-label">{userRole.toUpperCase()}</span>
                      <span className="dropdown-user-text" style={{fontSize: '1.1rem'}}>{username}</span>
                    </div>
                    
                    <button className="dropdown-item-btn" onClick={() => navigate('/dashboard')}>
                      My Dashboard
                    </button>
                    
                    <button className="dropdown-item-btn dropdown-logout" onClick={handleLogout}>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  logoContainer: { display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'white' },
  logoText: { margin: 0, fontWeight: '800', fontSize: '1.8rem', letterSpacing: '0.05em' },
  link: { color: '#e5e7eb', textDecoration: 'none', fontSize: '15px', fontWeight: '500', transition: 'color 0.2s' },
};

export default Navbar;