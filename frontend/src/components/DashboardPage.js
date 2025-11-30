// frontend/src/components/DashboardPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import MyApplicationPage from './MyApplicationPage';
import StatusPage from './StatusPage';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(
        `${API_BASE_URL}/api/dashboard/profile`,
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

      setProfile(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again later.');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const renderContent = () => {
    if (loading) return <p>Loading profile...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    if (!profile) {
      return <p>No profile data found.</p>;
    }

    if (activeTab === 'profile') {
      return (
        <>
          <h2>My Profile</h2>
          <p>
            <strong>Startup Name:</strong>{' '}
            {profile.startupName || '-'}
          </p>
          <p>
            <strong>Sector:</strong> {profile.sector || '-'}
          </p>
          <p>
            <strong>Founder Name:</strong>{' '}
            {profile.founderName || '-'}
          </p>
          <p>
            <strong>Contact Number:</strong>{' '}
            {profile.contactNumber || '-'}
          </p>
          <p>
            <strong>Email:</strong> {profile.email || '-'}
          </p>
        </>
      );
    }

    if (activeTab === 'application') {
      return <MyApplicationPage profile={profile} />;
    }

    if (activeTab === 'status') {
      return <StatusPage profile={profile} />;
    }

    return null;
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <nav className="dashboard-sidebar-nav">
          <button
            className={
              'sidebar-link ' +
              (activeTab === 'profile' ? 'active' : '')
            }
            onClick={() => setActiveTab('profile')}
          >
            My Profile
          </button>
          <button
            className={
              'sidebar-link ' +
              (activeTab === 'application' ? 'active' : '')
            }
            onClick={() => setActiveTab('application')}
          >
            My Application
          </button>
          <button
            className={
              'sidebar-link ' +
              (activeTab === 'status' ? 'active' : '')
            }
            onClick={() => setActiveTab('status')}
          >
            Status
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <div className="profile-card">{renderContent()}</div>
      </main>
    </div>
  );
};

export default DashboardPage;
