// src/App.jsx
// ============================================================
// Root component — wires all panels together (WS or Firebase)
// ============================================================
import React, { useState, useCallback, useEffect } from 'react';
import './App.css';

import useESP32        from './hooks/useESP32';
import useFirebaseESP32 from './hooks/useFirebaseESP32';
import Header          from './components/Header';
import PhaseCard       from './components/PhaseCard';
import MotorControlCard from './components/MotorControlCard';
import GpioCard        from './components/GpioCard';
import SystemInfoCard  from './components/SystemInfoCard';
import EventLog        from './components/EventLog';
import ConfigModal     from './components/ConfigModal';

export default function App() {
  const [config, setConfig]         = useState({ connectionType: 'ws', ip: '', port: 81, autoReconnect: true });
  const [showConfig, setShowConfig] = useState(false);

  // Dynamic hook based on config
  const wsHook = useESP32(config);
  const firebaseHook = useFirebaseESP32(config.firebaseConfig, config.deviceId);
  const hook = config.connectionType === 'ws' ? wsHook : firebaseHook;
  const { state, logs, sendCmd, connect } = hook;

  // Auto-connect on valid config change
  useEffect(() => {
    if ((config.connectionType === 'ws' && config.ip) || 
        (config.connectionType === 'firebase' && config.firebaseConfig && config.deviceId)) {
      connect?.();
    }
  }, [config, connect]);

  // ---- Commands ------------------------------------------------
  const handleStart = useCallback(() => {
    sendCmd('MOTOR_ON');
  }, [sendCmd]);

  const handleStop = useCallback(() => {
    sendCmd('MOTOR_OFF');
  }, [sendCmd]);

  const handleToggleAuto = useCallback(() => {
    sendCmd('SET_AUTO', { value: !state.autoMode });
  }, [sendCmd, state.autoMode]);

  const handleResetFault = useCallback(() => {
    sendCmd('RESET_FAULT');
  }, [sendCmd]);

  const handleConfigSave = useCallback((newConfig) => {
    setConfig(newConfig);
    setShowConfig(false);
  }, []);

  return (
    <div className="app">
      {/* Fault alert banner */}
      {state.faultActive && (
        <div className="fault-banner" role="alert">
          ⚠ {state.faultMsg || 'Phase fault — motor stopped for protection'}
        </div>
      )}

      {/* Header */}
      <Header
        state={state}
        connectionType={config.connectionType}
        onConfigClick={() => setShowConfig(true)}
        onConnectClick={connect}
      />

      {/* Main 2-column grid */}
      <div className="grid-main">
        <PhaseCard phases={state.phases} voltage={state.voltage} autoMode={state.autoMode} />
        <MotorControlCard
          state={state}
          onStart={handleStart}
          onStop={handleStop}
          onToggleAuto={handleToggleAuto}
          onResetFault={handleResetFault}
        />
      </div>

      {/* Bottom 3-column grid */}
      <div className="grid-bottom">
        <GpioCard phases={state.phases} motorOn={state.motorOn} />
        <SystemInfoCard state={state} />
        <EventLog logs={logs} />
      </div>

      {/* Config modal */}
      {showConfig && (
        <ConfigModal
          config={config}
          onSave={handleConfigSave}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  );
}

