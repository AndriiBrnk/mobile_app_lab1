import React from 'react';
import { Text } from 'react-native';
import { t } from '../../locales/dictionary';
import { formatTime } from '../../utils/utils';

export default function TimerDisplay({ isWorking, timeLeft, t }) {
  return (
    <>
      <Text className="text-white text-3xl font-bold mb-8">
        {isWorking ? t('work_mode') : t('break_mode')}
      </Text>
      
      <Text className="text-white text-8xl font-bold mb-12 tracking-widest">
        {formatTime(timeLeft)}
      </Text>
    </>
  );
}