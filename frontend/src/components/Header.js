import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ayushLogo from '../ayush-logo.png';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const navigate = useNavigate();
  // 1. Check if a login token exists in the browser's local storage.
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    // 2. When logout is clicked, remove the token and redirect to the login page.
    localStorage.removeItem('token');
    navigate('/login');
    // Force a page reload to ensure all components reset their state, including the header.
    window.location.reload();
  };

  let userRole = null;
  // 3. If a token exists, decode it to find the user's role.
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.user.role;
    } catch (e) {
      console.error("Invalid token:", e);
      // If the token is invalid, it's good practice to clear it.
      localStorage.removeItem('token');
    }
  }

  return (
    <header className="header">
      <Link to="/" className="header-brand">
        <img src={ayushLogo} alt="AYUSH Ministry Logo" className="header-logo" />
        <div className="header-title">
          <h1>AYUSH Startup Registration Portal</h1>
          <p>Ministry of AYUSH, Government of India</p>
        </div>
      </Link>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        
        {/* 4. Dynamically display the correct dashboard link based on the user's role. */}
        {userRole === 'startup' && <Link to="/dashboard">My Dashboard</Link>}
        {userRole === 'official' && <Link to="/admin/dashboard">Admin Dashboard</Link>}
        {userRole === 'startup' && <Link to="/status">Status</Link>}
        
        {/* 5. Show a "Logout" button if a user is logged in, otherwise show a "Login" link. */}
        {!token ? (
          <Link to="/login">Login</Link>
        ) : (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        )}
      </nav>
    </header>
  );
};

export default Header;

