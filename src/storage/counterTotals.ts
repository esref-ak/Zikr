import AsyncStorage from '@react-native-async-storage/async-storage';

export type CounterTotals = Record<string, number>;

const COUNTER_TOTALS_KEY = '@zikr/counter-totals';

function normalizeTotals(value: unknown): CounterTotals {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value).reduce<CounterTotals>((totals, [key, rawCount]) => {
    const count = typeof rawCount === 'number' ? rawCount : Number(rawCount);

    if (Number.isFinite(count) && count > 0) {
      totals[key] = Math.floor(count);
    }

    return totals;
  }, {});
}

export async function loadCounterTotals(): Promise<CounterTotals> {
  const raw = await AsyncStorage.getItem(COUNTER_TOTALS_KEY);

  if (!raw) {
    return {};
  }

  try {
    return normalizeTotals(JSON.parse(raw));
  } catch {
    return {};
  }
}

export async function saveCounterTotals(totals: CounterTotals) {
  await AsyncStorage.setItem(COUNTER_TOTALS_KEY, JSON.stringify(normalizeTotals(totals)));
}
