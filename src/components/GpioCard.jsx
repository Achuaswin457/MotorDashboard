// src/components/GpioCard.jsx
import React from 'react';
import './GpioCard.css';

const PINS = [
  { pin: 'D12', gpio: 'GPIO12', label: 'Phase R',  dir: 'IN',  key: 'R', color: '#e74c3c' },
  { pin: 'D13', gpio: 'GPIO13', label: 'Phase Y',  dir: 'IN',  key: 'Y', color: '#f39c12' },
  { pin: 'D14', gpio: 'GPIO14', label: 'Phase B',  dir: 'IN',  key: 'B', color: '#3498db' },
  { pin: 'D2',  gpio: 'GPIO2',  label: 'Relay OUT', dir: 'OUT', key: 'relay', color: '#7dc97d' },
];

export default function GpioCard({ phases, motorOn }) {
  const vals = {
    R:     phases.R,
    Y:     phases.Y,
    B:     phases.B,
    relay: motorOn,
  };

  return (
    <div className="card gpio-card">
      <div className="card-title">GPIO Pin Map — ESP32</div>
      <div className="gpio-list">
        {PINS.map(({ pin, gpio, label, dir, key, color }) => {
          const high = vals[key];
          return (
            <div key={pin} className={`gpio-row ${high ? 'high' : 'low'}`}>
              <div className="gpio-led" style={{ '--led-color': high ? color : '#444', '--led-glow': high ? color : 'transparent' }} />
              <div className="gpio-details">
                <span className="gpio-pin">{pin}</span>
                <span className="gpio-gpio">{gpio}</span>
                <span className="gpio-label">{label}</span>
              </div>
              <div className="gpio-right">
                <span className={`gpio-dir dir-${dir.toLowerCase()}`}>{dir}</span>
                <span className={`gpio-val val-${high ? 'high' : 'low'}`}>
                  {high ? 'HIGH' : 'LOW'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="gpio-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: 'var(--green-light)' }} />
          HIGH = 3.3 V
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#666' }} />
          LOW = 0 V / GND
        </span>
      </div>
    </div>
  );
}
