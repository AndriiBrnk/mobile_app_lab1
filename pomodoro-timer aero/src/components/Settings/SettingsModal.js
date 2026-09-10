import React, { useState, useEffect } from 'react';
import { Modal, View, Text } from 'react-native';
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

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
        
        <div className="window active" style={{ width: 400 }}>
          <div className="title-bar">
            <div className="title-bar-text">{t('settings')}</div>
            <div className="title-bar-controls">
              <button aria-label="Close" onClick={onClose}></button>
            </div>
          </div>

          <div className="window-body has-space">
            <fieldset style={{ marginBottom: 10 }}>
              <legend>{t('language')}</legend>
              <div style={{ display: 'flex', gap: 15 }}>
                <div>
                  <input type="radio" id="lang-uk" name="lang" checked={lang === 'uk'} onChange={() => setLang('uk')} />
                  <label htmlFor="lang-uk">УКР</label>
                </div>
                <div>
                  <input type="radio" id="lang-en" name="lang" checked={lang === 'en'} onChange={() => setLang('en')} />
                  <label htmlFor="lang-en">EN</label>
                </div>
              </div>
            </fieldset>

            <fieldset style={{ marginBottom: 10 }}>
              <legend>{t('time')}</legend>
              <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>{t('work_settings')}</label>
                <input type="text" style={{ width: 60, textAlign: 'center' }} value={inputWork.m} onChange={e => setInputWork({...inputWork, m: e.target.value})} />
              </div>
              <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>{t('break_settings')}</label>
                <input type="text" style={{ width: 60, textAlign: 'center' }} value={inputBreak.m} onChange={e => setInputBreak({...inputBreak, m: e.target.value})} />
              </div>
              <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>{t('long_break_settings')}</label>
                <input type="text" style={{ width: 60, textAlign: 'center' }} value={inputLongBreak.m} onChange={e => setInputLongBreak({...inputLongBreak, m: e.target.value})} />
              </div>
            </fieldset>

            <fieldset style={{ marginBottom: 15 }}>
              <legend>{t('options')}</legend>
              <div className="group">
                <div>
                  <input type="checkbox" id="auto-break" checked={localConfig.autoStartBreak} onChange={(e) => setLocalConfig({...localConfig, autoStartBreak: e.target.checked})} />
                  <label htmlFor="auto-break">{t('auto_break')}</label>
                </div>
                <div>
                  <input type="checkbox" id="immediate-apply" checked={localConfig.applyImmediately} onChange={(e) => setLocalConfig({...localConfig, applyImmediately: e.target.checked})} />
                  <label htmlFor="immediate-apply">{t('immediate_apply')}</label>
                </div>
                <div>
                  <input type="checkbox" id="debug-mode" checked={localConfig.isDebug} onChange={(e) => setLocalConfig({...localConfig, isDebug: e.target.checked})} />
                  <label htmlFor="debug-mode">{t('debug_mode')}</label>
                </div>
              </div>
            </fieldset>

            <section style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
              <button className="default" onClick={handleSave}>{t('save')}</button>
              <button onClick={onClose}>Cancel</button>
            </section>
          </div>
        </div>

      </View>
    </Modal>
  );
}