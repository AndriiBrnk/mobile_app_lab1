import './global.css';
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import TimerDisplay from './src/components/Timer/TimerDisplay';
import TimerControls from './src/components/Timer/TimerControls';
import SettingsModal from './src/components/Settings/SettingsModal';
import { vibrate } from './src/utils/utils';
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
    isDebug: false, // Режим прискореного часу
  });

  // Відлік часу (з врахуванням режиму дебагу)
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      // Якщо увімкнено дебаг, час іде у 60 разів швидше (1 секунда = 1 хвилина)
      const tickSpeed = config.isDebug ? 1000 / 60 : 1000;
      interval = setInterval(() => setTimeLeft((time) => time - 1), tickSpeed);
    } else if (isActive && timeLeft === 0) {
      vibrate();
      handlePhaseSwitch();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, config.isDebug]);

  const handlePhaseSwitch = () => {
    if (phase === 'work') {
      const nextSessionCount = sessionCount + 1;
      setSessionCount(nextSessionCount);
      
      if (nextSessionCount >= config.sessionsUntilLongBreak) {
        setPhase('long_break');
        setTimeLeft(config.longBreakTime);
        setSessionCount(0); // Скидаємо лічильник сесій
      } else {
        setPhase('break');
        setTimeLeft(config.breakTime);
      }
      if (!config.autoStartBreak) setIsActive(false);
    } else {
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

  // Розрахунок прогресу для градієнта
  const getTotalDuration = () => {
    if (phase === 'work') return config.workTime;
    if (phase === 'break') return config.breakTime;
    return config.longBreakTime;
  };

  const progress = timeLeft / getTotalDuration();
  
  // Змінюємо кольори залежно від фази
  let gradientColors;
  if (phase === 'work') {
    gradientColors = [`rgba(239, 68, 68, ${progress})`, 'rgba(153, 27, 27, 1)']; // Червоний
  } else if (phase === 'break') {
    gradientColors = [`rgba(16, 185, 129, ${progress})`, 'rgba(4, 120, 87, 1)']; // Зелений
  } else {
    gradientColors = [`rgba(59, 130, 246, ${progress})`, 'rgba(30, 58, 138, 1)']; // Синій для довгої перерви
  }

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center p-6">
        
        {/* Передаємо t у TimerDisplay, щоб він теж знав про переклад */}
        <TimerDisplay phase={phase} timeLeft={timeLeft} t={t} />

        <TimerControls 
          isActive={isActive} 
          onToggle={() => setIsActive(!isActive)} 
          onReset={resetTimer} 
          t={t}
        />

        <TouchableOpacity onPress={() => setShowSettings(true)} className="mt-8 bg-black/20 px-6 py-2 rounded-full">
          <Text className="text-white text-lg">{t('settings')}</Text>
        </TouchableOpacity>

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
    </LinearGradient>
  );
}