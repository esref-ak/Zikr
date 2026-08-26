import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { PracticeItem } from '../types';

const ARABIC_TEXT_PATTERN = /[\u0600-\u06FF]/;

function getSpeechText(item: PracticeItem) {
  const text = item.arabic?.trim() || item.latin?.trim() || item.title.trim();
  const hasArabic = ARABIC_TEXT_PATTERN.test(text);

  return {
    language: hasArabic ? 'ar-SA' : 'tr-TR',
    rate: hasArabic ? 0.74 : 0.86,
    text,
  };
}

export function speakPracticeItem(item: PracticeItem) {
  const speech = getSpeechText(item);

  if (!speech.text) {
    return;
  }

  const options = {
    language: speech.language,
    pitch: 1,
    rate: speech.rate,
    volume: 1,
  };

  if (Platform.OS === 'web') {
    Speech.speak(speech.text, options);
    return;
  }

  void Speech.stop()
    .then(() => {
      Speech.speak(speech.text, options);
    })
    .catch(() => {
      Speech.speak(speech.text, options);
    });
}
