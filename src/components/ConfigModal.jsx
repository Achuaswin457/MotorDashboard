// src/components/ConfigModal.jsx
import React, { useState } from 'react';
import './ConfigModal.css';

export default function ConfigModal({ config, onSave, onClose }) {
  const [connectionType, setConnectionType] = useState(config.connectionType || 'ws');
  const [ip,            setIp]            = useState(config.ip || '');
  const [port,          setPort]          = useState(config.port || 81);
  const [autoReconnect, setAutoReconnect] = useState(config.autoReconnect !== false);
  const [firebaseConfig, setFirebaseConfig] = useState(config.firebaseConfig || '{}');
  const [deviceId,      setDeviceId]      = useState(config.deviceId || '');

  const handleSave = () => {
    const newConfig = { connectionType };
    if (connectionType === 'ws') {
      newConfig.ip = ip;
      newConfig.port = Number(port);
      newConfig.autoReconnect = autoReconnect;
    } else if (connectionType === 'firebase') {
      try {
        newConfig.firebaseConfig = JSON.parse(firebaseConfig);
        newConfig.deviceId = deviceId;
      } catch {
        alert('Invalid Firebase config JSON');
        return;
      }
    }
    onSave(newConfig);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>⚙ Connection Settings</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Connection Type</label>
            <select value={connectionType} onChange={e => setConnectionType(e.target.value)}>
              <option value="ws">Direct WebSocket (ESP32 local)</option>
              <option value="firebase">Firebase Realtime DB (Cloud)</option>
            </select>
          </div>

          {connectionType === 'ws' && (
            <>
              <div className="form-group">
                <label>ESP32 IP Address</label>
                <input
                  type="text"
                  placeholder="e.g. 192.168.1.100"
                  value={ip}
                  onChange={e => setIp(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>WebSocket Port</label>
                <input
                  type="number"
                  value={port}
                  onChange={e => setPort(e.target.value)}
                  min={1} max={65535}
                />
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  id="auto-reconnect"
                  checked={autoReconnect}
                  onChange={e => setAutoReconnect(e.target.checked)}
                />
                <label htmlFor="auto-reconnect">Auto-reconnect on disconnect</label>
              </div>
            </>
          )}

          {connectionType === 'firebase' && (
            <>
              <div className="form-group">
                <label>Device ID</label>
                <input
                  type="text"
                  placeholder="e.g. motor-001"
                  value={deviceId}
                  onChange={e => setDeviceId(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Firebase Config JSON</label>
                <textarea
                  rows="6"
                  placeholder='{
  "apiKey": "...",
  "authDomain": "...",
  "databaseURL": "...",
  "projectId": "..."
}'
                  value={firebaseConfig}
                  onChange={e => setFirebaseConfig(e.target.value)}
                />
                <small>Get from Firebase Console &amp;gt; Project Settings &amp;gt; SDK setup</small>
              </div>
            </>
          )}

          <div className="setup-hint">
            <div className="hint-title">Quick Start</div>
            <div className="hint-steps">
              <div className="hint-step">
                <span className="hint-num">{connectionType === 'ws' ? '1' : '2'}</span>
                <span>{connectionType === 'ws' ? 'Flash ESP32 sketch, get IP from Serial' : 'Setup Firebase project, paste config above'}</span>
              </div>
              <div className="hint-step">
                <span className="hint-num">{connectionType === 'ws' ? '2' : '3'}</span>
                <span>Save settings → Connect</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-connect" onClick={handleSave}>Save & Connect</button>
        </div>
      </div>
    </div>
  );
}

