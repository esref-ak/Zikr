import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIVE_PRACTICE_KEY = '@zikr/active-practice-id';

export async function loadActivePracticeId() {
  return AsyncStorage.getItem(ACTIVE_PRACTICE_KEY);
}

export async function saveActivePracticeId(id: string) {
  await AsyncStorage.setItem(ACTIVE_PRACTICE_KEY, id);
}
