// src/components/EventLog.jsx
import React, { useRef, useEffect } from 'react';
import './EventLog.css';

const TYPE_ICONS = { info: '●', warn: '▲', error: '✕', cmd: '→' };

export default function EventLog({ logs }) {
  const boxRef = useRef(null);

  // Auto-scroll to top (newest first)
  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = 0;
  }, [logs.length]);

  return (
    <div className="card log-card">
      <div className="card-title">
        Event Log
        <span className="log-count">{logs.length}</span>
      </div>

      <div className="log-box" ref={boxRef}>
        {logs.length === 0 && (
          <div className="log-empty">No events yet…</div>
        )}
        {logs.map(entry => (
          <div key={entry.id} className={`log-entry log-${entry.type}`}>
            <span className="log-icon">{TYPE_ICONS[entry.type] || '●'}</span>
            <span className="log-time">{entry.time}</span>
            <span className="log-msg">{entry.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
