import { useCallback, useEffect, useRef, useState } from 'react';
import { CustomPracticeInput, CustomPracticeItem } from '../types';
import { loadCustomItems, saveCustomItems } from '../storage/customItems';
import { showStorageAlert } from '../utils/storageAlerts';

function mergePendingItems(
  storedItems: CustomPracticeItem[],
  pendingAdds: CustomPracticeItem[],
  pendingDeletes: Set<string>,
) {
  const addIds = new Set(pendingAdds.map((item) => item.id));
  const cleanStoredItems = storedItems.filter(
    (item) => !pendingDeletes.has(item.id) && !addIds.has(item.id),
  );

  return [...pendingAdds.filter((item) => !pendingDeletes.has(item.id)), ...cleanStoredItems];
}

export function useCustomItems() {
  const [items, setItems] = useState<CustomPracticeItem[]>([]);
  const [isReady, setIsReady] = useState(false);
  const isReadyRef = useRef(false);
  const itemsRef = useRef<CustomPracticeItem[]>([]);
  const pendingAddsRef = useRef<CustomPracticeItem[]>([]);
  const pendingDeletesRef = useRef<Set<string>>(new Set());
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  const updateItems = useCallback((nextItems: CustomPracticeItem[]) => {
    itemsRef.current = nextItems;
    setItems(nextItems);
  }, []);

  const enqueueSave = useCallback((nextItems: CustomPracticeItem[]) => {
    const snapshot = nextItems.map((item) => ({ ...item }));

    saveQueueRef.current = saveQueueRef.current
      .catch(() => undefined)
      .then(() => saveCustomItems(snapshot))
      .catch(() => {
        showStorageAlert(
          'custom-save',
          'Kişisel kayıt kaydedilemedi',
          'Kişisel defterindeki son değişiklik cihaz depolamasına yazılamadı.',
        );
      });

    void saveQueueRef.current;
  }, []);

  useEffect(() => {
    let mounted = true;

    loadCustomItems()
      .catch(() => {
        showStorageAlert(
          'custom-load',
          'Kişisel kayıtlar yüklenemedi',
          'Kendi defterindeki kayıtlar cihazdan okunamadı.',
        );
        return [];
      })
      .then((storedItems) => {
        if (!mounted) {
          return;
        }

        const nextItems = mergePendingItems(
          storedItems,
          pendingAddsRef.current,
          pendingDeletesRef.current,
        );
        const shouldPersist =
          pendingAddsRef.current.length > 0 || pendingDeletesRef.current.size > 0;

        pendingAddsRef.current = [];
        pendingDeletesRef.current.clear();
        isReadyRef.current = true;
        updateItems(nextItems);
        setIsReady(true);

        if (shouldPersist) {
          enqueueSave(nextItems);
        }
      });

    return () => {
      mounted = false;
    };
  }, [enqueueSave, updateItems]);

  const persist = useCallback(
    (nextItems: CustomPracticeItem[]) => {
      updateItems(nextItems);

      if (isReadyRef.current) {
        enqueueSave(nextItems);
      }
    },
    [enqueueSave, updateItems],
  );

  const addItem = useCallback(
    async (input: CustomPracticeInput) => {
      const item: CustomPracticeItem = {
        ...input,
        id: `custom-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        source: 'custom',
        createdAt: new Date().toISOString(),
      };

      const nextItems = [item, ...itemsRef.current.filter((currentItem) => currentItem.id !== item.id)];

      if (!isReadyRef.current) {
        pendingAddsRef.current = [
          item,
          ...pendingAddsRef.current.filter((currentItem) => currentItem.id !== item.id),
        ];
      }

      persist(nextItems);
      return item;
    },
    [persist],
  );

  const removeItem = useCallback(
    async (id: string) => {
      const nextItems = itemsRef.current.filter((item) => item.id !== id);

      if (!isReadyRef.current) {
        pendingDeletesRef.current.add(id);
        pendingAddsRef.current = pendingAddsRef.current.filter((item) => item.id !== id);
      }

      persist(nextItems);
    },
    [persist],
  );

  const updateItem = useCallback(
    async (id: string, input: CustomPracticeInput) => {
      const existingItem = itemsRef.current.find((item) => item.id === id);

      if (!existingItem) {
        return undefined;
      }

      const updatedItem: CustomPracticeItem = {
        ...existingItem,
        ...input,
        id: existingItem.id,
        source: 'custom',
        createdAt: existingItem.createdAt,
      };
      const nextItems = itemsRef.current.map((item) => (item.id === id ? updatedItem : item));

      if (!isReadyRef.current) {
        pendingAddsRef.current = pendingAddsRef.current.map((item) =>
          item.id === id ? updatedItem : item,
        );
      }

      persist(nextItems);
      return updatedItem;
    },
    [persist],
  );

  return {
    items,
    isReady,
    addItem,
    updateItem,
    removeItem,
  };
}
