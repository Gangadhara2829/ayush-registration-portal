import React from 'react';
import './UserStatusTracker.css';

const STATUS_STEPS = ['Submitted', 'Verified', 'Accepted', 'Approved'];

const UserStatusTracker = ({ currentStatus, timeline = [] }) => {
  
  const getStepClass = (step, index) => {
    if (currentStatus === 'Rejected') return ''; // Don't highlight normal steps if rejected
    
    const currentIndex = STATUS_STEPS.indexOf(currentStatus);
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return '';
  };

  return (
    <div className="status-tracker-wrapper">
      
      {currentStatus === 'Rejected' ? (
        <div className="alert alert-danger" style={{color: '#721c24', backgroundColor: '#f8d7da', padding: '15px', borderRadius: '5px', marginBottom: '20px'}}>
          <strong>Application Rejected</strong>
          <p>Please check the history below for details.</p>
        </div>
      ) : (
        <ul className="status-tracker-container">
          {STATUS_STEPS.map((step, index) => (
            <li key={step} className={`status-step ${getStepClass(step, index)}`}>
              <div className="status-icon">
                {getStepClass(step, index) === 'completed' ? '✓' : index + 1}
              </div>
              <div className="status-label">{step}</div>
            </li>
          ))}
        </ul>
      )}

      <div className="timeline-logs">
        <h4>History & Comments</h4>
        {timeline && timeline.length > 0 ? (
          <ul>
            {[...timeline].reverse().map((log, i) => (
              <li key={i} className="timeline-log-item">
                <strong>{log.status}</strong>
                <span className="date">{new Date(log.date).toLocaleString()}</span>
                {log.comment && <div className="comment">Note: {log.comment}</div>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No history available.</p>
        )}
      </div>
    </div>
  );
};

export default UserStatusTracker;