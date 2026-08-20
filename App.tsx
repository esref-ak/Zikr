import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { BottomTabs } from './src/components/BottomTabs';
import { AYAH_DUA_LIBRARY, READY_ZIKR } from './src/data/presets';
import { useCustomItems } from './src/hooks/useCustomItems';
import { useCounterTotals } from './src/hooks/useCounterTotals';
import { AsmaScreen } from './src/screens/AsmaScreen';
import { CounterScreen } from './src/screens/CounterScreen';
import { CustomScreen } from './src/screens/CustomScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { loadActivePracticeId, saveActivePracticeId } from './src/storage/activePractice';
import { colors } from './src/theme';
import { PracticeItem, TabKey } from './src/types';

export default function App() {
  const { height, width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [activePractice, setActivePractice] = useState<PracticeItem>(READY_ZIKR[0]);
  const didRestoreActivePracticeRef = useRef(false);
  const {
    addItem,
    isReady: isCustomReady,
    items: customItems,
    removeItem,
    updateItem,
  } = useCustomItems();
  const {
    addToTotal,
    clearTotal,
    isReady: isCounterReady,
    totals: counterTotals,
  } = useCounterTotals();

  const practiceItems = useMemo(
    () => [...READY_ZIKR, ...AYAH_DUA_LIBRARY, ...customItems],
    [customItems],
  );

  useEffect(() => {
    if (!isCustomReady || didRestoreActivePracticeRef.current) {
      return;
    }

    didRestoreActivePracticeRef.current = true;
    loadActivePracticeId()
      .then((storedId) => {
        const storedPractice = practiceItems.find((item) => item.id === storedId);

        if (storedPractice) {
          setActivePractice(storedPractice);
        }
      })
      .catch(() => undefined);
  }, [isCustomReady, practiceItems]);

  useEffect(() => {
    const syncedPractice = practiceItems.find((item) => item.id === activePractice.id);

    if (syncedPractice && syncedPractice !== activePractice) {
      setActivePractice(syncedPractice);
    }
  }, [activePractice, practiceItems]);

  const handleSelectPractice = (item: PracticeItem) => {
    setActivePractice(item);
    void saveActivePracticeId(item.id);
    setActiveTab('counter');
  };

  const handleDeleteCustomItem = async (id: string, clearCounterTotal: boolean) => {
    await removeItem(id);

    if (clearCounterTotal) {
      clearTotal(id);
    }

    if (activePractice.id === id) {
      const fallbackPractice = READY_ZIKR[0];
      setActivePractice(fallbackPractice);
      void saveActivePracticeId(fallbackPractice.id);
    }
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'counter':
        return (
          <CounterScreen
            activePractice={activePractice}
            counterTotals={counterTotals}
            isCounterReady={isCounterReady}
            lifetimeTotal={counterTotals[activePractice.id] ?? 0}
            onCountChange={addToTotal}
            onSelectPractice={handleSelectPractice}
            practiceItems={practiceItems}
          />
        );
      case 'library':
        return (
          <LibraryScreen
            counterTotals={counterTotals}
            items={practiceItems}
            onSelectPractice={handleSelectPractice}
          />
        );
      case 'asma':
        return <AsmaScreen counterTotals={counterTotals} onSelectPractice={handleSelectPractice} />;
      case 'custom':
        return (
          <CustomScreen
            counterTotals={counterTotals}
            customItems={customItems}
            isCustomReady={isCustomReady}
            onAdd={addItem}
            onDelete={handleDeleteCustomItem}
            onSelectPractice={handleSelectPractice}
            onUpdate={updateItem}
          />
        );
      case 'home':
      default:
        return (
          <HomeScreen
            activePractice={activePractice}
            counterTotals={counterTotals}
            customCount={customItems.length}
            onNavigate={setActiveTab}
          />
        );
    }
  };

  const isDesktopWebPreview = Platform.OS === 'web' && width >= 768 && height >= 700;

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <View style={[styles.appStage, isDesktopWebPreview && styles.webStage]}>
        <LinearGradient
          colors={[colors.background, '#FDFBF6']}
          style={[styles.background, isDesktopWebPreview && styles.webPhone]}
        >
          <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={styles.safeArea}>
            <View style={styles.screen}>{renderScreen()}</View>
            <BottomTabs activeTab={activeTab} onChange={setActiveTab} />
            <StatusBar style="dark" />
          </SafeAreaView>
        </LinearGradient>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appStage: {
    flex: 1,
    backgroundColor: colors.background,
  },
  background: {
    flex: 1,
  },
  webStage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  webPhone: {
    width: '100%',
    maxWidth: 430,
    height: '100%',
    maxHeight: 932,
    borderColor: colors.line,
    borderRadius: 34,
    borderWidth: 1,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
});
