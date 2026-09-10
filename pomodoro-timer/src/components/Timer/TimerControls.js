import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { t } from '../../locales/dictionary';

export default function TimerControls({ isActive, onToggle, onReset, t }) {
  return (
    <View className="flex-row space-x-4 mb-8">
      <TouchableOpacity 
        className="bg-white/20 px-8 py-4 rounded-full"
        onPress={onToggle}
      >
        <Text className="text-white text-xl font-semibold">
          {isActive ? t('pause') : t('start')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="bg-white/20 px-8 py-4 rounded-full"
        onPress={onReset}
      >
        <Text className="text-white text-xl font-semibold">{t('reset')}</Text>
      </TouchableOpacity>
    </View>
  );
}