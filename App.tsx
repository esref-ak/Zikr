import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
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
import { colors } from './src/theme';
import { PracticeItem, TabKey } from './src/types';

export default function App() {
  const { height, width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [activePractice, setActivePractice] = useState<PracticeItem>(READY_ZIKR[0]);
  const { addItem, isReady: isCustomReady, items: customItems, removeItem } = useCustomItems();
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

  const handleSelectPractice = (item: PracticeItem) => {
    setActivePractice(item);
    setActiveTab('counter');
  };

  const handleDeleteCustomItem = async (id: string, clearCounterTotal: boolean) => {
    await removeItem(id);

    if (clearCounterTotal) {
      clearTotal(id);
    }

    if (activePractice.id === id) {
      setActivePractice(READY_ZIKR[0]);
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
            onSelectPractice={handleSelectPractice}
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
