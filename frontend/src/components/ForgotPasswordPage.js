import React from 'react';
import { Link } from 'react-router-dom';

// A simple placeholder component for the "Forgot Password" page
const ForgotPasswordPage = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center', maxWidth: '500px', margin: '40px auto' }}>
      <h1>Reset Your Password</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        Enter the email address associated with your account, and we'll send you a link to reset your password.
      </p>
      <form>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>Email Address</label>
          <input type="email" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', boxSizing: 'border-box' }} placeholder="you@example.com" />
        </div>
        <button type="submit" className="auth-btn" style={{ width: '100%' }}>Send Reset Link</button>
      </form>
      <Link to="/login" style={{ marginTop: '20px', display: 'inline-block' }}>← Back to Login</Link>
    </div>
  );
};

export default ForgotPasswordPage;
