// src/components/SystemInfoCard.jsx
import React from 'react';
import './SystemInfoCard.css';

function StatItem({ label, value, valueClass }) {
  return (
    <div className="stat-item">
      <span className="stat-label">{label}</span>
      <span className={`stat-value ${valueClass || ''}`}>{value}</span>
    </div>
  );
}

function formatUptime(s) {
  const h   = Math.floor(s / 3600);
  const m   = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function SystemInfoCard({ state, simMode }) {
  const { motorOn, autoMode, mode, uptime, current, faultActive, rssi, tempC, phases } = state;
  const phaseCount = Object.values(phases).filter(Boolean).length;

  return (
    <div className="card sysinfo-card">
      <div className="card-title">System Info</div>

      {simMode && (
        <div className="sim-badge">⚡ Simulation Mode — configure ESP32 IP to connect live</div>
      )}

      <div className="stat-grid">
        <StatItem label="Uptime"   value={formatUptime(uptime)} />
        <StatItem label="Mode"     value={mode} valueClass={mode === 'RUNNING' ? 'val-green' : mode === 'FAULT' ? 'val-red' : ''} />
        <StatItem label="Auto"     value={autoMode ? 'ON' : 'OFF'} valueClass={autoMode ? 'val-green' : ''} />
        <StatItem label="Relay"    value={motorOn ? 'CLOSED' : 'OPEN'} valueClass={motorOn ? 'val-green' : ''} />
        <StatItem label="Phases"   value={`${phaseCount} / 3`} valueClass={phaseCount === 3 ? 'val-green' : 'val-red'} />
        <StatItem label="Fault"    value={faultActive ? 'ACTIVE' : 'NONE'} valueClass={faultActive ? 'val-red' : 'val-green'} />
        <StatItem label="Current"  value={motorOn ? `${current} A` : '0 A'} />
        <StatItem label="RSSI"     value={`${rssi} dBm`} valueClass={rssi > -70 ? 'val-green' : rssi > -85 ? 'val-yellow' : 'val-red'} />
        <StatItem label="ESP Temp" value={`${tempC} °C`} valueClass={tempC > 70 ? 'val-red' : ''} />
        <StatItem label="Protocol" value="WebSocket :81" />
        <StatItem label="Delay"    value="100 ms poll" />
        <StatItem label="Fault RT" value="≤ 200 ms" />
      </div>
    </div>
  );
}
