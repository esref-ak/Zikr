import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { PracticeCard } from '../components/PracticeCard';
import { ScreenHeader } from '../components/ScreenHeader';
import type { CounterTotals } from '../storage/counterTotals';
import { colors, radius, spacing } from '../theme';
import { ContentCategory, PracticeItem } from '../types';

type FilterKey = 'all' | ContentCategory | 'custom';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'zikr', label: 'Zikir' },
  { key: 'dua', label: 'Dua' },
  { key: 'ayet', label: 'Ayet' },
  { key: 'custom', label: 'Kayıtlı' },
];

type LibraryScreenProps = {
  counterTotals: CounterTotals;
  items: PracticeItem[];
  onSelectPractice: (item: PracticeItem) => void;
};

export function LibraryScreen({ counterTotals, items, onSelectPractice }: LibraryScreenProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR');

    return items.filter((item) => {
      const haystack = [item.title, item.arabic, item.latin, item.meaning, item.note]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('tr-TR');
      const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'custom' ? item.source === 'custom' : item.category === filter);

      return matchesQuery && matchesFilter;
    });
  }, [filter, items, query]);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        eyebrow="Kütüphane"
        title="Zikir, dua ve ayetler"
        subtitle="Hazır kayıtları ve kendi eklediklerini sayaç için seçebilirsin."
      />

      <TextInput
        onChangeText={setQuery}
        placeholder="Ara"
        placeholderTextColor={colors.mutedLight}
        style={styles.searchInput}
        value={query}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        {FILTERS.map((item) => {
          const selected = item.key === filter;

          return (
            <Pressable
              accessibilityRole="button"
              key={item.key}
              onPress={() => setFilter(item.key)}
              style={[styles.filterChip, selected && styles.filterChipSelected]}
            >
              <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {visibleItems.length > 0 ? (
        visibleItems.map((item) => (
          <PracticeCard
            item={item}
            key={item.id}
            lifetimeTotal={counterTotals[item.id] ?? 0}
            onSelect={onSelectPractice}
          />
        ))
      ) : (
        <EmptyState
          icon="search-outline"
          text="Arama veya filtreyi değiştirerek tekrar bak."
          title="Kayıt bulunamadı"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 112,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
    height: 50,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  filters: {
    marginBottom: spacing.lg,
  },
  filterChip: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  filterChipSelected: {
    backgroundColor: colors.emerald,
    borderColor: colors.emerald,
  },
  filterText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  filterTextSelected: {
    color: colors.surface,
  },
});
