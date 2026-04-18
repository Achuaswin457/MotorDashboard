// src/components/Header.jsx
import React from 'react';
import './Header.css';

export default function Header({ state, simMode, onConfigClick, onConnectClick }) {
  const { connected, connecting } = state;

  const statusClass = connected ? 'connected' : connecting ? 'connecting' : 'disconnected';
  const statusLabel = connected    ? `Live · ${state.uptime > 0 ? 'ESP32' : 'Connected'}`
                    : connecting   ? 'Connecting…'
                    : simMode      ? 'Simulation'
                    :                'Disconnected';

  return (
    <header className="dashboard-header">
      <div className="header-brand">
        <div className="header-logo">⚡</div>
        <div>
          <h1 className="header-title">Motor Control Dashboard</h1>
          <p className="header-sub">ESP32-WROOM · 3-Phase Monitor · IoT Remote Control</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          className={`conn-btn conn-btn--${statusClass}`}
          onClick={connected ? undefined : onConnectClick}
          title={connected ? 'Connected to ESP32' : 'Click to connect'}
        >
          <span className={`conn-dot ${connecting || simMode ? 'pulse' : ''}`} />
          {statusLabel}
        </button>

        <button className="config-btn" onClick={onConfigClick} title="Connection settings">
          ⚙
        </button>
      </div>
    </header>
  );
}
