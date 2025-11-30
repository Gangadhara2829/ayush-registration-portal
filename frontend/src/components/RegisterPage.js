import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  // State for text inputs
  const [formData, setFormData] = useState({
    startupName: '',
    sector: '',
    founderName: '',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
  });
  // New state specifically for file inputs
  const [files, setFiles] = useState({
    registrationCertificate: null,
    founderId: null,
    complianceDocs: null,
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { startupName, sector, founderName, contactNumber, email, password, confirmPassword, location } = formData;

  const onTextChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onFileChange = e => setFiles({ ...files, [e.target.name]: e.target.files });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return; 
    }
    
    // Use FormData to send both text and files
    const data = new FormData();
    // Append all text fields
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    // Append all file fields
    if (files.registrationCertificate) data.append('registrationCertificate', files.registrationCertificate[0]);
    if (files.founderId) data.append('founderId', files.founderId[0]);
    if (files.complianceDocs) {
        for (let i = 0; i < files.complianceDocs.length; i++) {
            data.append('complianceDocs', files.complianceDocs[i]);
        }
    }

    setError('');
    setSuccessMessage('');
    try {
      // Set the correct headers for multipart/form-data
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      await axios.post('http://localhost:5000/api/auth/register', data, config);
      
      setSuccessMessage('Successfully created your application! Redirecting to login page...');
      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      setError(err.response.data.msg || 'Registration failed. Please try again.');
      console.error('Registration failed:', err.response.data);
    }
  };

  return (
    <div className="registration-form">
      <h2>AYUSH Startup Registration Form</h2>
      
      {successMessage && <p className="form-success">{successMessage}</p>}
      <form onSubmit={onSubmit}>
        {error && <p className="form-error">{error}</p>}
        <div className="form-grid">
          {/* Text Inputs */}
          <div className="form-group">
            <label>Startup Name:</label>
            <input type="text" name="startupName" value={startupName} onChange={onTextChange} required />
          </div>
          <div className="form-group">
            <label>Sector:</label>
            <input type="text" name="sector" value={sector} onChange={onTextChange} required />
          </div>
          <div className="form-group">
            <label>Founder Name:</label>
            <input type="text" name="founderName" value={founderName} onChange={onTextChange} required />
          </div>
          <div className="form-group">
            <label>Contact Number:</label>
            <input type="tel" name="contactNumber" value={contactNumber} onChange={onTextChange} required />
          </div>
          <div className="form-group full-width">
            <label>Email:</label>
            <input type="email" name="email" value={email} onChange={onTextChange} required />
          </div>
          <div className="form-group">
            <label>State / City:</label>
            <input type="text" name="location" value={location} onChange={onTextChange} required />
          </div>
          <div className="form-group">
            <label>Create Password:</label>
            <input type="password" name="password" value={password} onChange={onTextChange} required minLength="6" />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input type="password" name="confirmPassword" value={confirmPassword} onChange={onTextChange} required minLength="6" />
          </div>
        </div>

        <div className="file-upload-section">
          <h3>Documents Upload Section</h3>
          {/* File Inputs */}
          <div className="form-group">
            <label>Startup Registration Certificate (PDF, JPG, PNG)</label>
            <input type="file" name="registrationCertificate" onChange={onFileChange} accept=".pdf,.jpeg,.jpg,.png" />
          </div>
          <div className="form-group">
            <label>Founder Aadhaar/PAN (PDF, JPG, PNG)</label>
            <input type="file" name="founderId" onChange={onFileChange} accept=".pdf,.jpeg,.jpg,.png" />
          </div>
          <div className="form-group">
            <label>Compliance Documents (Multiple Files)</label>
            <input type="file" name="complianceDocs" onChange={onFileChange} multiple />
          </div>
        </div>
        
        <button type="submit" className="auth-btn full-width">Register Now</button>
      </form>
    </div>
  );
};

export default RegisterPage;

