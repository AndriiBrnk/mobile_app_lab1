import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { secondsToHMS } from '../../utils/utils';

export default function SettingsModal({ visible, onClose, config, onSave, lang, setLang, t }) {
  const [localConfig, setLocalConfig] = useState(config);
  const [inputWork, setInputWork] = useState(secondsToHMS(config.workTime));
  const [inputBreak, setInputBreak] = useState(secondsToHMS(config.breakTime));
  const [inputLongBreak, setInputLongBreak] = useState(secondsToHMS(config.longBreakTime));

  useEffect(() => {
    if (visible) {
      setLocalConfig(config);
      setInputWork(secondsToHMS(config.workTime));
      setInputBreak(secondsToHMS(config.breakTime));
      setInputLongBreak(secondsToHMS(config.longBreakTime));
    }
  }, [visible, config]);

  const handleSave = () => {
    const calcTime = (timeObj) => (parseInt(timeObj.h) || 0) * 3600 + (parseInt(timeObj.m) || 0) * 60 + (parseInt(timeObj.s) || 0);
    
    onSave({
      ...localConfig,
      workTime: calcTime(inputWork),
      breakTime: calcTime(inputBreak),
      longBreakTime: calcTime(inputLongBreak),
    });
  };

  // Зручний інпут з кнопками + та -
  const NumberInput = ({ value, onChange, placeholder }) => {
    const numValue = parseInt(value) || 0;
    const increment = () => onChange(String(Math.min(numValue + 1, 99)));
    const decrement = () => onChange(String(Math.max(numValue - 1, 0)));

    return (
      <View className="flex-1 items-center border border-gray-300 rounded-lg overflow-hidden flex-row">
        <TouchableOpacity onPress={decrement} className="bg-gray-200 px-3 py-2"><Text className="text-lg font-bold">-</Text></TouchableOpacity>
        <TextInput 
          className="flex-1 text-center py-2 text-lg" 
          placeholder={placeholder} 
          keyboardType="numeric" 
          value={value} 
          onChangeText={onChange} 
        />
        <TouchableOpacity onPress={increment} className="bg-gray-200 px-3 py-2"><Text className="text-lg font-bold">+</Text></TouchableOpacity>
      </View>
    );
  };

  const TimeInputGroup = ({ label, state, setState }) => (
    <View className="mb-6">
      <Text className="text-lg font-semibold mb-2 text-gray-700">{label}</Text>
      <View className="flex-row space-x-2">
        <NumberInput placeholder={t('hours')} value={state.h} onChange={(v) => setState({...state, h: v})} />
        <NumberInput placeholder={t('minutes')} value={state.m} onChange={(v) => setState({...state, m: v})} />
        <NumberInput placeholder={t('seconds')} value={state.s} onChange={(v) => setState({...state, s: v})} />
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/60 p-4">
        {/* Модалка тепер по центру і має скрол, якщо контенту багато */}
        <View className="bg-white rounded-3xl w-full max-w-lg max-h-[90%] overflow-hidden shadow-2xl">
          <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
            <Text className="text-2xl font-bold">{t('settings')}</Text>
            <TouchableOpacity onPress={onClose} className="bg-gray-100 rounded-full p-2">
              <Text className="text-gray-600 font-bold px-2">X</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView className="p-6">
            <View className="flex-row justify-between items-center mb-6 bg-blue-50 p-4 rounded-xl">
              <Text className="text-lg font-semibold text-blue-900">{t('language')}</Text>
              <View className="flex-row space-x-2">
                <TouchableOpacity onPress={() => setLang('uk')} className={`px-4 py-2 rounded-lg ${lang === 'uk' ? 'bg-blue-600' : 'bg-gray-200'}`}><Text className={lang === 'uk' ? 'text-white' : 'text-gray-700'}>УКР</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setLang('en')} className={`px-4 py-2 rounded-lg ${lang === 'en' ? 'bg-blue-600' : 'bg-gray-200'}`}><Text className={lang === 'en' ? 'text-white' : 'text-gray-700'}>EN</Text></TouchableOpacity>
              </View>
            </View>

            <TimeInputGroup label={t('work_settings')} state={inputWork} setState={setInputWork} />
            <TimeInputGroup label={t('break_settings')} state={inputBreak} setState={setInputBreak} />
            <TimeInputGroup label={t('long_break_settings')} state={inputLongBreak} setState={setInputLongBreak} />

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg text-gray-700 flex-1">{t('sessions_count')}</Text>
              <View className="w-24">
                 <NumberInput value={String(localConfig.sessionsUntilLongBreak)} onChange={(v) => setLocalConfig({...localConfig, sessionsUntilLongBreak: parseInt(v) || 1})} />
              </View>
            </View>

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg text-gray-700">{t('auto_break')}</Text>
              <Switch value={localConfig.autoStartBreak} onValueChange={(v) => setLocalConfig({...localConfig, autoStartBreak: v})} />
            </View>

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg text-gray-700">{t('immediate_apply')}</Text>
              <Switch value={localConfig.applyImmediately} onValueChange={(v) => setLocalConfig({...localConfig, applyImmediately: v})} />
            </View>

            <View className="flex-row justify-between items-center mb-8 bg-red-50 p-4 rounded-xl border border-red-100">
              <Text className="text-lg text-red-900 font-semibold">{t('debug_mode')}</Text>
              <Switch value={localConfig.isDebug} onValueChange={(v) => setLocalConfig({...localConfig, isDebug: v})} trackColor={{ true: '#ef4444' }} />
            </View>
          </ScrollView>

          <View className="p-6 border-t border-gray-100">
            <TouchableOpacity className="bg-blue-600 py-4 rounded-xl items-center shadow-lg" onPress={handleSave}>
              <Text className="text-white text-xl font-bold">{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}