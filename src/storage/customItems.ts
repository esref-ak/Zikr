import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomPracticeItem } from '../types';

const CUSTOM_ITEMS_KEY = '@zikr/custom-items';

export async function loadCustomItems(): Promise<CustomPracticeItem[]> {
  const raw = await AsyncStorage.getItem(CUSTOM_ITEMS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as CustomPracticeItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveCustomItems(items: CustomPracticeItem[]) {
  await AsyncStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(items));
}
