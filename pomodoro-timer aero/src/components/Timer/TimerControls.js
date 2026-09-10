import React from 'react';

export default function TimerControls({ isActive, onToggle, onReset, openSettings, t }) {
  return (
    <section style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginTop: 15 }}>
      <button className={isActive ? "" : "default"} onClick={onToggle} style={{ flex: 1 }}>
        {isActive ? t('pause') : t('start')}
      </button>
      <button onClick={onReset} style={{ flex: 1 }}>
        {t('reset')}
      </button>
      <button onClick={openSettings} style={{ flex: 1 }}>
        {t('settings')}
      </button>
    </section>
  );
}