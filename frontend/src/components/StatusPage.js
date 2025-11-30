import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import UserStatusTracker from './UserStatusTracker';

const StatusPage = () => {
  const [startupData, setStartupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");

        const res = await axios.get('http://localhost:5000/api/dashboard/my-application', {
          headers: { 'x-auth-token': token }
        });
        setStartupData(res.data);
      } catch (err) {
        setError("Could not load application data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  // Real-time updates
  useEffect(() => {
    if (!startupData) return;

    const socket = io('http://localhost:5000');
    socket.emit('joinRoom', startupData._id);

    socket.on('statusUpdate', (data) => {
      console.log("Real-time update received:", data);
      setStartupData(prev => ({
        ...prev,
        applicationStatus: data.applicationStatus,
        statusTimeline: data.statusTimeline
      }));
    });

    return () => socket.disconnect();
  }, [startupData?._id]);

  if (loading) return <div style={{padding: '20px'}}>Loading status...</div>;
  if (error) return <div style={{padding: '20px', color: 'red'}}>{error}</div>;
  if (!startupData) return <div style={{padding: '20px'}}>No application found.</div>;

  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
      <h2>Application Status</h2>
      <div style={{marginBottom: '20px'}}>
        <strong>Startup Name:</strong> {startupData.startupName}
      </div>
      
      <UserStatusTracker 
        currentStatus={startupData.applicationStatus} 
        timeline={startupData.statusTimeline} 
      />
    </div>
  );
};

export default StatusPage;