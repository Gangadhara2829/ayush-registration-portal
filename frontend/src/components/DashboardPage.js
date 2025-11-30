import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for handling the edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    startupName: '',
    sector: '',
    founderName: '',
    contactNumber: '',
  });

  useEffect(() => {
    const fetchStartupData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/dashboard/me', config);
        setStartup(res.data);
        // Pre-fill the form data with the fetched profile information
        setFormData({
            startupName: res.data.startupName,
            sector: res.data.sector,
            founderName: res.data.founderName,
            contactNumber: res.data.contactNumber,
        });
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchStartupData();
  }, [navigate]);

  // Update form state as the user types in the input fields
  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle the save action
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const config = { headers: { 'x-auth-token': token, 'Content-Type': 'application/json' } };
      const body = JSON.stringify(formData);
      const res = await axios.put('http://localhost:5000/api/dashboard/me', body, config);
      
      setStartup(res.data); // Update the view with the newly saved data
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error('Failed to update profile:', err);
      // You can add a user-facing error message here
    }
  };

  if (loading) {
    return <div>Loading your profile...</div>;
  }

  if (!startup) {
    return <div>Could not load profile. Please try logging in again.</div>;
  }

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <nav className="dashboard-sidebar-nav">
          <Link to="/dashboard" className="active">My Profile</Link>
          <Link to="/my-application">My Application</Link>
          <Link to="/status">Status</Link>
        </nav>
      </aside>
      <main className="dashboard-main">
        <div className="profile-card">
          <div className="profile-header">
            <h2>My Profile</h2>
            {/* Conditionally render Edit/Save/Cancel buttons */}
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>Save</button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            )}
          </div>
          <div className="profile-details">
            {isEditing ? (
              // EDIT MODE: Display input fields
              <>
                <p><strong>Startup Name:</strong><input type="text" name="startupName" value={formData.startupName} onChange={handleInputChange} className="profile-input" /></p>
                <p><strong>Sector:</strong><input type="text" name="sector" value={formData.sector} onChange={handleInputChange} className="profile-input" /></p>
                <p><strong>Founder Name:</strong><input type="text" name="founderName" value={formData.founderName} onChange={handleInputChange} className="profile-input" /></p>
                <p><strong>Contact Number:</strong><input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="profile-input" /></p>
                <p><strong>Email:</strong> {startup.email} <small>(cannot be changed)</small></p>
              </>
            ) : (
              // VIEW MODE: Display static text
              <>
                <p><strong>Startup Name:</strong> {startup.startupName}</p>
                <p><strong>Sector:</strong> {startup.sector}</p>
                <p><strong>Founder Name:</strong> {startup.founderName}</p>
                <p><strong>Contact Number:</strong> {startup.contactNumber}</p>
                <p><strong>Email:</strong> {startup.email}</p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

