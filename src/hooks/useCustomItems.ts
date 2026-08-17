import { useCallback, useEffect, useState } from 'react';
import { CustomPracticeInput, CustomPracticeItem } from '../types';
import { loadCustomItems, saveCustomItems } from '../storage/customItems';

export function useCustomItems() {
  const [items, setItems] = useState<CustomPracticeItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadCustomItems()
      .then((storedItems) => {
        if (mounted) {
          setItems(storedItems);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(async (nextItems: CustomPracticeItem[]) => {
    setItems(nextItems);
    await saveCustomItems(nextItems);
  }, []);

  const addItem = useCallback(
    async (input: CustomPracticeInput) => {
      const item: CustomPracticeItem = {
        ...input,
        id: `custom-${Date.now()}`,
        source: 'custom',
        createdAt: new Date().toISOString(),
      };

      await persist([item, ...items]);
      return item;
    },
    [items, persist],
  );

  const removeItem = useCallback(
    async (id: string) => {
      await persist(items.filter((item) => item.id !== id));
    },
    [items, persist],
  );

  return {
    items,
    isReady,
    addItem,
    removeItem,
  };
}
