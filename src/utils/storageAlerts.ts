import { Alert } from 'react-native';

const ALERT_THROTTLE_MS = 7000;
const lastAlertAtByKey: Record<string, number> = {};

export function showStorageAlert(key: string, title: string, message: string) {
  const now = Date.now();
  const lastAlertAt = lastAlertAtByKey[key] ?? 0;

  if (now - lastAlertAt < ALERT_THROTTLE_MS) {
    return;
  }

  lastAlertAtByKey[key] = now;
  Alert.alert(title, message);
}
