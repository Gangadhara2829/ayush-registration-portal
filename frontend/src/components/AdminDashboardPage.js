import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminStatusPanel from './AdminStatusPanel';

const AdminDashboardPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      // Use the full backend URL for cross-origin API call
      const res = await axios.get('http://localhost:5000/api/admin/applications', {
        headers: { 'x-auth-token': token }
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Error loading applications:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
         alert("Access Denied. You must be logged in as an Official.");
      } else {
         alert("Failed to load applications. Server may be offline.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) return <div style={{padding: '20px'}}>Loading dashboard...</div>;

  return (
    <div style={{padding: '20px'}}>
      <h2>Admin Dashboard</h2>
      <p>Review and manage startup applications.</p>
      
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div style={{display: 'grid', gap: '20px'}}>
          {applications.map(app => (
            <div key={app._id} style={{border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: 'white'}}>
              <h4>{app.startupName}</h4>
              <p><strong>Founder:</strong> {app.founderName} | <strong>Email:</strong> {app.email}</p>
              <p><strong>Current Status:</strong> <span style={{fontWeight: 'bold', color: '#007bff'}}>{app.applicationStatus}</span></p>
              
              {/* --- PASS THE DOCUMENTS HERE --- */}
              <AdminStatusPanel 
                startupId={app._id} 
                documents={app.documents || {}} // Pass documents with fallback
                onUpdate={fetchApplications} // Refresh list after update
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;