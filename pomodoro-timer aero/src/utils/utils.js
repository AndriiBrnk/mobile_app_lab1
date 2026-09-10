import { Vibration } from 'react-native';
import { Audio } from 'expo-av';

export const vibrate = (ms = 500) => {
  Vibration.vibrate(ms);
};

export const formatTime = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');

  return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`;
};

export const secondsToHMS = (totalSeconds) => {
  return {
    h: Math.floor(totalSeconds / 3600).toString(),
    m: Math.floor((totalSeconds % 3600) / 60).toString(),
    s: (totalSeconds % 60).toString(),
  };
};

const playAudioFile = async (fileName) => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: `/${fileName}` },
      { shouldPlay: true }
    );
    await sound.playAsync();
  } catch (error) {
    console.log('err sound play:', error);
  }
};

export const playWorkEndSound = async () => {
  await playAudioFile('work-end.mp3');
};

export const playBreakEndSound = async () => {
  await playAudioFile('break-end.mp3');
};