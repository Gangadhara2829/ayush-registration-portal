// src/components/StatusStepper.jsx
import React from 'react';

const STAGES = ['Submitted', 'Reviewing Application', 'Approved', 'Rejected', 'Successful'];

export default function StatusStepper({ current }) {
  const currentIndex = Math.max(0, STAGES.indexOf(current));

  return (
    <div className="stepper">
      {STAGES.map((s, i) => {
        const isActive = i <= currentIndex && !(current === 'Rejected' && i > STAGES.indexOf('Rejected'));
        const isRejected = current === 'Rejected' && i >= STAGES.indexOf('Rejected') && i !== STAGES.indexOf('Successful');
        return (
          <div key={s} className={`step ${isActive ? 'active' : ''} ${isRejected ? 'rejected' : ''}`}>
            <div className="dot">{i + 1}</div>
            <div className="label">{s}</div>
            {i < STAGES.length - 1 && <div className="bar" />}
          </div>
        );
      })}
      <style>{`
        .stepper { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
        .step { position:relative; display:flex; align-items:center; }
        .dot {
          width:28px; height:28px; border-radius:50%;
          border:2px solid #bbb; display:flex; align-items:center; justify-content:center;
          font-size:12px; font-weight:600; background:#fff; color:#777;
        }
        .label { margin:0 10px 0 8px; font-size:14px; white-space:nowrap; color:#666; }
        .bar {
          width:56px; height:3px; background:#ddd; border-radius:2px; margin-right:8px;
        }
        .step.active .dot { border-color:#0a7cff; color:#0a7cff; }
        .step.active ~ .step .bar { background:#ddd; }
        .step.active .bar { background:#0a7cff; }
        .step.rejected .dot { border-color:#e74c3c; color:#e74c3c; }
        .step.rejected .bar { background:#e74c3c; }
      `}</style>
    </div>
  );
}
