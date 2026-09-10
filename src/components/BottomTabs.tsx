import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, shadows } from '../theme';
import { TabKey } from '../types';

type TabItem = {
  key: TabKey;
  label: string;
  symbol: string;
};

const TABS: TabItem[] = [
  { key: 'home', label: 'Ana', symbol: '⌂' },
  { key: 'counter', label: 'Sayaç', symbol: '◎' },
  { key: 'library', label: 'Zikirler', symbol: '≡' },
  { key: 'asma', label: 'Esmâ', symbol: '✦' },
  { key: 'custom', label: 'Ekle', symbol: '+' },
];

type BottomTabsProps = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export function BottomTabs({ activeTab, onChange }: BottomTabsProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <View style={[styles.symbolWrap, isActive && styles.activeSymbolWrap]}>
              <Text style={[styles.symbol, isActive && styles.activeSymbol]}>{tab.symbol}</Text>
            </View>
            <Text style={[styles.label, isActive && styles.activeLabel]} numberOfLines={1}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...shadows.soft,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.74)',
    borderColor: 'rgba(228, 222, 208, 0.76)',
    borderRadius: 24,
    borderWidth: 1,
    bottom: 10,
    elevation: 5,
    flexDirection: 'row',
    left: 12,
    overflow: 'hidden',
    paddingHorizontal: 5,
    paddingVertical: 7,
    position: 'absolute',
    right: 12,
    shadowOpacity: 0.1,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  symbolWrap: {
    alignItems: 'center',
    borderRadius: 12,
    height: 31,
    justifyContent: 'center',
    width: 38,
  },
  activeSymbolWrap: {
    backgroundColor: colors.emerald,
  },
  symbol: {
    color: colors.muted,
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 24,
  },
  activeSymbol: {
    color: colors.surface,
  },
  label: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: 3,
  },
  activeLabel: {
    color: colors.emeraldDark,
  },
});
