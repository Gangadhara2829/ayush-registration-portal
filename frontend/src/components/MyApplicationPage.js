import React from 'react';
import { Link } from 'react-router-dom';

// A simple placeholder component for the "My Application" page
const MyApplicationPage = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>My Application Details</h1>
      <p>This page will display the full details of your submitted application, including uploaded documents and current status.</p>
      <p>Once your application is submitted, you can review it here.</p>
      <Link to="/dashboard" style={{ marginTop: '20px', display: 'inline-block' }}>← Back to Profile</Link>
    </div>
  );
};

export default MyApplicationPage;
