import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows } from '../theme';
import { TabKey } from '../types';

type IoniconName = keyof typeof Ionicons.glyphMap;

type TabItem = {
  key: TabKey;
  label: string;
  icon: IoniconName;
};

const TABS: TabItem[] = [
  { key: 'home', label: 'Ana', icon: 'home-outline' },
  { key: 'counter', label: 'Sayaç', icon: 'radio-button-on-outline' },
  { key: 'library', label: 'Zikir', icon: 'book-outline' },
  { key: 'asma', label: 'Esmâ', icon: 'sparkles-outline' },
  { key: 'custom', label: 'Ekle', icon: 'add-circle-outline' },
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
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <Ionicons
              color={isActive ? colors.surface : colors.muted}
              name={tab.icon}
              size={21}
            />
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
    borderRadius: radius.xl,
    borderWidth: 1,
    bottom: 14,
    elevation: 5,
    flexDirection: 'row',
    gap: 4,
    marginHorizontal: 14,
    overflow: 'hidden',
    padding: 6,
    position: 'absolute',
    shadowOpacity: 0.1,
  },
  tab: {
    alignItems: 'center',
    borderRadius: radius.lg,
    minWidth: 58,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(14, 111, 92, 0.96)',
  },
  label: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: 2,
  },
  activeLabel: {
    color: colors.surface,
  },
});
