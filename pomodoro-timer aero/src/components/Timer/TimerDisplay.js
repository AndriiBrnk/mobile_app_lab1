import React from 'react';
import { formatTime } from '../../utils/utils';
import TimerControls from './TimerControls';

export default function TimerDisplay({ phase, timeLeft, t, isActive, progress, titleBarColor, onToggle, onReset, openSettings }) {
  const getPhaseText = () => {
    if (phase === 'work') return t('work_mode');
    if (phase === 'break') return t('break_mode');
    return t('long_break_mode');
  };

  const percent = (1 - progress) * 100;

  return (
    <div className="window active" style={{ width: 440, boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
      <div className="title-bar" style={{ backgroundColor: titleBarColor, transition: 'background-color 0.6s ease' }}>
        <div className="title-bar-text">Pomodoro - {getPhaseText()}</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize" disabled></button>
          <button aria-label="Close"></button>
        </div>
      </div>

      <div className="window-body has-space">
        <h2 style={{ textAlign: 'center', marginTop: 5, marginBottom: 15, color: '#222' }}>
          {getPhaseText()}
        </h2>

        <div style={{ backgroundColor: '#fff', border: '1px solid #abadb3', borderRadius: 3, padding: '15px 0', marginBottom: 15, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)' }}>
          <h1 style={{ textAlign: 'center', fontSize: 72, margin: 0, fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
            {formatTime(timeLeft)}
          </h1>
        </div>

        <div role="progressbar" className={isActive ? "animate" : "paused"} style={{ marginBottom: 20 }}>
          <div style={{ width: `${percent}%` }}></div>
        </div>

        <TimerControls 
          isActive={isActive} 
          onToggle={onToggle} 
          onReset={onReset} 
          openSettings={openSettings} 
          t={t} 
        />
      </div>
    </div>
  );
}