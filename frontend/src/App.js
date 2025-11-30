import React, { useState, useEffect } from 'react'; // <-- Import hooks
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import StatusPage from './components/StatusPage';
import MyApplicationPage from './components/MyApplicationPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import AdminDashboardPage from './components/AdminDashboardPage';
import './App.css';

// 1. Import the new Chatbot component
import Chatbot from './components/Chatbot'; 
// 2. Import jwtDecode to check token
// Make sure you ran: npm install jwt-decode
import { jwtDecode } from 'jwt-decode';

function App() {
  // 3. Add state to check if user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 4. Function to check if token is valid
  const checkAuthToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode token to check expiry
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
        } else {
          // Token expired
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (err) {
        // Invalid token
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  // 5. Check token on initial load
  useEffect(() => {
    checkAuthToken();
  }, []);
  
  // 6. This function can be called by LoginPage and RegisterPage
  const handleLogin = () => {
    checkAuthToken(); // Check token and set auth state
  };

  // 7. This function can be called by Header
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    setIsAuthenticated(false);
  };

  // 8. Listen for storage changes (login/logout in other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuthToken();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  return (
    <Router>
      <div className="app-container">
        {/* 9. Pass auth state and logout function to Header */}
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        
        <main className="main-content">
          <Routes>
            {/* User-facing Routes */}
            <Route path="/" element={<HomePage />} />
            
            {/* 10. Pass the handleLogin function to LoginPage */}
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            
            {/* 11. Pass the handleLogin function to RegisterPage */}
            <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
            
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/my-application" element={<MyApplicationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Admin Route */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Routes>
        </main>
        
        {/* 12. Conditionally render the Chatbot */}
        {/* It will only appear if the user is authenticated */}
        {isAuthenticated && <Chatbot />}
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;