// src/components/PhaseCard.jsx
import React from 'react';
import './PhaseCard.css';

// Mini SVG sine-wave for each phase
function Waveform({ color, active }) {
  const W = 120, H = 28, amp = active ? 10 : 2;
  const pts = Array.from({ length: 61 }, (_, i) => {
    const x = (i / 60) * W;
    const y = H - amp * Math.sin((i / 60) * Math.PI * 4);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg className="phase-waveform" viewBox={`0 0 ${W} ${H * 2}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" opacity={active ? 0.85 : 0.25} />
    </svg>
  );
}

const PHASE_COLORS = { R: '#e74c3c', Y: '#f39c12', B: '#3498db' };

export default function PhaseCard({ phases, voltage, autoMode }) {
  const allOk = phases.R && phases.Y && phases.B;

  return (
    <div className="card phase-card">
      <div className="card-title">Phase Status</div>

      <div className="phases-row">
        {['R', 'Y', 'B'].map(p => (
          <div key={p} className={`phase-item ${phases[p] ? 'active' : 'inactive'}`}>
            <div className={`phase-orb phase-orb--${p} ${phases[p] ? 'active' : ''}`}>{p}</div>
            <Waveform color={PHASE_COLORS[p]} active={phases[p]} />
            <span className="phase-voltage">
              {phases[p] ? `${voltage[p]}V` : '—'}
            </span>
            <span className={`phase-badge ${phases[p] ? 'ok' : 'fail'}`}>
              {phases[p] ? '● OK' : '✕ FAIL'}
            </span>
          </div>
        ))}
      </div>

      {autoMode && !allOk && (
        <div className="phase-warning">
          ⚠ Waiting for all phases before auto-start…
        </div>
      )}

      <div className="phase-summary">
        <span>{Object.values(phases).filter(Boolean).length}/3 phases active</span>
        <span className={`phase-summary-status ${allOk ? 'ok' : 'fail'}`}>
          {allOk ? 'HEALTHY' : 'FAULT'}
        </span>
      </div>
    </div>
  );
}
