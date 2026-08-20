import * as Speech from 'expo-speech';
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

export async function speakPracticeItem(item: PracticeItem) {
  const speech = getSpeechText(item);

  if (!speech.text) {
    return;
  }

  await Speech.stop();
  Speech.speak(speech.text, {
    language: speech.language,
    pitch: 1,
    rate: speech.rate,
    volume: 1,
  });
}
