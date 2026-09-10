import "7.css/dist/7.css";
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import TimerDisplay from './src/components/Timer/TimerDisplay';
import SettingsModal from './src/components/Settings/SettingsModal';
import { vibrate, playWorkEndSound, playBreakEndSound } from './src/utils/utils';
import { dictionaries } from './src/locales/dictionary';

export default function App() {
  const [lang, setLang] = useState('uk');
  const t = (key) => dictionaries[lang][key] || key;

  const [phase, setPhase] = useState('work'); // 'work', 'break', 'long_break'
  const [sessionCount, setSessionCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [showSettings, setShowSettings] = useState(false);

  const [config, setConfig] = useState({
    workTime: 25 * 60,
    breakTime: 5 * 60,
    longBreakTime: 15 * 60,
    sessionsUntilLongBreak: 4,
    autoStartBreak: true,
    applyImmediately: false,
    isDebug: false,
  });

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      const tickSpeed = config.isDebug ? 1000 / 60 : 1000;
      interval = setInterval(() => setTimeLeft((time) => time - 1), tickSpeed);
    } else if (isActive && timeLeft === 0) {
      vibrate();
      if (phase === 'work') {
        playWorkEndSound();
      } else {
        playBreakEndSound();
      }
      handlePhaseSwitch();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, config.isDebug, phase]);

  const handlePhaseSwitch = () => {
    if (phase === 'work') {
      const nextSessionCount = sessionCount + 1;
      setSessionCount(nextSessionCount);
      
      if (nextSessionCount >= config.sessionsUntilLongBreak) {
        setPhase('long_break');
        setTimeLeft(config.longBreakTime);
        setSessionCount(0);
      } else {
        setPhase('break');
        setTimeLeft(config.breakTime);
      }
      if (!config.autoStartBreak) setIsActive(false);
    } else {
      playBreakEndSound(); 
      setPhase('work');
      setTimeLeft(config.workTime);
      setIsActive(false);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSessionCount(0);
    setPhase('work');
    setTimeLeft(config.workTime);
  };

  const handleSaveSettings = (newConfig) => {
    setConfig(newConfig);
    setShowSettings(false);

    if (newConfig.applyImmediately) {
      if (phase === 'work') setTimeLeft(newConfig.workTime);
      else if (phase === 'break') setTimeLeft(newConfig.breakTime);
      else setTimeLeft(newConfig.longBreakTime);
      setIsActive(false);
    }
  };

  const getTotalDuration = () => {
    if (phase === 'work') return config.workTime;
    if (phase === 'break') return config.breakTime;
    return config.longBreakTime;
  };

  const progress = timeLeft / getTotalDuration();

  const getThemeConfig = () => {
    if (phase === 'work') {
      return {
        background: 'linear-gradient(135deg, #09477b 0%, #1a72bb 50%, #0d3259 100%)',
        titleBarColor: '#1c6ea4' 
      };
    } else if (phase === 'break') {
      return {
        background: 'linear-gradient(135deg, #107c10 0%, #16c60c 50%, #0b4d0b 100%)',
        titleBarColor: '#107c10'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #5c2d91 0%, #881798 50%, #32145a 100%)',
        titleBarColor: '#5c2d91'
      };
    }
  };

  const theme = getThemeConfig();

return (
    <View style={{
      flex: 1,
      height: '100vh',
      width: '100vw',
      background: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .window, .title-bar {
          transition: all 0.6s ease-in-out;
        }
      `}} />

      <TimerDisplay 
        phase={phase} 
        timeLeft={timeLeft} 
        t={t} 
        isActive={isActive} 
        progress={progress}
        titleBarColor={theme.titleBarColor}
        onToggle={() => setIsActive(!isActive)}
        onReset={resetTimer}
        openSettings={() => setShowSettings(true)}
      />

      <SettingsModal 
        visible={showSettings} 
        onClose={() => setShowSettings(false)}
        config={config}
        onSave={handleSaveSettings}
        lang={lang}
        setLang={setLang}
        t={t}
      />

    </View>
  );
}