import { useCallback, useEffect, useRef, useState } from 'react';
import { CounterTotals, loadCounterTotals, saveCounterTotals } from '../storage/counterTotals';
import { showStorageAlert } from '../utils/storageAlerts';

function applyDelta(totals: CounterTotals, id: string, amount: number) {
  const currentTotal = totals[id] ?? 0;
  const nextTotal = Math.max(currentTotal + amount, 0);

  if (nextTotal === 0) {
    const nextTotals = { ...totals };
    delete nextTotals[id];
    return nextTotals;
  }

  return {
    ...totals,
    [id]: nextTotal,
  };
}

function addPendingDelta(deltas: Record<string, number>, id: string, amount: number) {
  const nextDelta = (deltas[id] ?? 0) + amount;
  const nextDeltas = { ...deltas };

  if (nextDelta === 0) {
    delete nextDeltas[id];
  } else {
    nextDeltas[id] = nextDelta;
  }

  return nextDeltas;
}

export function useCounterTotals() {
  const [totals, setTotals] = useState<CounterTotals>({});
  const [isReady, setIsReady] = useState(false);
  const clearedIdsRef = useRef<Set<string>>(new Set());
  const isReadyRef = useRef(false);
  const pendingDeltasRef = useRef<Record<string, number>>({});
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const totalsRef = useRef<CounterTotals>({});

  const enqueueSave = useCallback((nextTotals: CounterTotals) => {
    const snapshot = { ...nextTotals };

    saveQueueRef.current = saveQueueRef.current
      .catch(() => undefined)
      .then(() => saveCounterTotals(snapshot))
      .catch(() => {
        showStorageAlert(
          'counter-save',
          'Sayaç kaydedilemedi',
          'Son sayaç değişikliği cihaz depolamasına yazılamadı.',
        );
      });

    void saveQueueRef.current;
  }, []);

  useEffect(() => {
    let mounted = true;

    loadCounterTotals()
      .catch((): CounterTotals => {
        showStorageAlert(
          'counter-load',
          'Sayaç yüklenemedi',
          'Kayıtlı sayaç toplamları cihazdan okunamadı.',
        );
        return {};
      })
      .then((storedTotals) => {
        if (!mounted) {
          return;
        }

        let nextTotals = { ...storedTotals };

        Object.entries(pendingDeltasRef.current).forEach(([id, delta]) => {
          nextTotals = applyDelta(nextTotals, id, delta);
        });

        clearedIdsRef.current.forEach((id) => {
          delete nextTotals[id];
        });

        const shouldPersist =
          Object.keys(pendingDeltasRef.current).length > 0 || clearedIdsRef.current.size > 0;

        pendingDeltasRef.current = {};
        clearedIdsRef.current.clear();
        isReadyRef.current = true;
        totalsRef.current = nextTotals;
        setTotals(nextTotals);
        setIsReady(true);

        if (shouldPersist) {
          enqueueSave(nextTotals);
        }
      });

    return () => {
      mounted = false;
    };
  }, [enqueueSave]);

  const persist = useCallback(
    (nextTotals: CounterTotals) => {
      totalsRef.current = nextTotals;
      setTotals(nextTotals);

      if (isReadyRef.current) {
        enqueueSave(nextTotals);
      }
    },
    [enqueueSave],
  );

  const addToTotal = useCallback(
    (id: string, amount: number) => {
      const cleanAmount = Math.trunc(amount);

      if (!id || cleanAmount === 0) {
        return totalsRef.current[id] ?? 0;
      }

      const nextTotals = applyDelta(totalsRef.current, id, cleanAmount);

      if (!isReadyRef.current) {
        pendingDeltasRef.current = addPendingDelta(
          pendingDeltasRef.current,
          id,
          cleanAmount,
        );
      }

      persist(nextTotals);
      return nextTotals[id] ?? 0;
    },
    [persist],
  );

  const clearTotal = useCallback(
    (id: string) => {
      if (!id) {
        return;
      }

      const nextTotals = { ...totalsRef.current };
      delete nextTotals[id];
      delete pendingDeltasRef.current[id];

      if (!isReadyRef.current) {
        clearedIdsRef.current.add(id);
      }

      persist(nextTotals);
    },
    [persist],
  );

  return {
    addToTotal,
    clearTotal,
    isReady,
    totals,
  };
}
