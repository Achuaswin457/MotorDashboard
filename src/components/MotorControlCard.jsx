// src/components/MotorControlCard.jsx
import React from 'react';
import './MotorControlCard.css';

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <div className="toggle-row">
      <span className="toggle-label">{label}</span>
      <div className={`toggle-switch ${checked ? 'on' : 'off'}`} onClick={onChange} role="switch" aria-checked={checked}>
        <div className="toggle-track" />
        <div className="toggle-thumb" />
      </div>
    </div>
  );
}

export default function MotorControlCard({ state, onStart, onStop, onToggleAuto, onResetFault }) {
  const { motorOn, autoMode, mode, timerProgress, faultActive, phases } = state;
  const allOk = phases.R && phases.Y && phases.B;

  const motorStateClass = motorOn ? 'on' : faultActive ? 'fault' : 'off';

  const statusLabel = faultActive ? 'FAULT' : motorOn ? 'Motor ON' : 'Motor OFF';
  const statusSub   = faultActive
    ? state.faultMsg
    : `Mode: ${mode}  ·  Relay D2: ${motorOn ? 'HIGH' : 'LOW'}`;

  return (
    <div className="card motor-card">
      <div className="card-title">Motor Control</div>

      {/* Status display */}
      <div className={`motor-status motor-status--${motorStateClass}`}>
        <div className={`motor-icon motor-icon--${motorStateClass}`}>
          <span className={motorOn ? 'spin-icon' : ''} style={{ display: 'inline-block' }}>⚙</span>
        </div>
        <div className="motor-info">
          <h2 className="motor-label">{statusLabel}</h2>
          <p className="motor-sub">{statusSub}</p>
        </div>
        {motorOn && (
          <div className="motor-on-pulse" />
        )}
      </div>

      {/* Auto-start confirmation timer */}
      {autoMode && allOk && !motorOn && timerProgress > 0 && mode !== 'FAULT' && (
        <div className="timer-section">
          <div className="timer-header">
            <span>Auto-start in…</span>
            <span className="timer-val">{(5 - Math.round((timerProgress / 100) * 5))}s</span>
          </div>
          <div className="timer-bar-bg">
            <div className="timer-bar-fill" style={{ width: `${timerProgress}%` }} />
          </div>
        </div>
      )}

      {/* Fault reset */}
      {faultActive && (
        <button className="btn btn-reset" onClick={onResetFault}>
          ↺ Reset Fault
        </button>
      )}

      {/* Start / Stop */}
      <div className="controls-row">
        <button
          className="btn btn-start"
          onClick={onStart}
          disabled={motorOn || !allOk || autoMode || faultActive}
          title={autoMode ? 'Disable Auto Mode to use manual start' : !allOk ? 'All 3 phases must be present' : ''}
        >
          ▶ Start
        </button>
        <button
          className="btn btn-stop"
          onClick={onStop}
          disabled={!motorOn && !faultActive}
        >
          ■ Stop
        </button>
      </div>

      {/* Auto Mode toggle */}
      <ToggleSwitch
        checked={autoMode}
        onChange={onToggleAuto}
        label="Auto Mode (3-phase sensing)"
      />
      {autoMode && (
        <p className="auto-hint">
          Starts after 5 s stable · Stops instantly on phase loss · 200 ms fault response
        </p>
      )}
      {!autoMode && (
        <p className="auto-hint manual-hint">
          Manual mode — Start/Stop via buttons above or app commands
        </p>
      )}
    </div>
  );
}
