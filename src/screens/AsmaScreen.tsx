import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ScreenHeader } from '../components/ScreenHeader';
import { ESMA_UL_HUSNA } from '../data/presets';
import type { CounterTotals } from '../storage/counterTotals';
import { colors, radius, shadows, spacing } from '../theme';
import { PracticeItem } from '../types';

type AsmaScreenProps = {
  counterTotals: CounterTotals;
  onSelectPractice: (item: PracticeItem) => void;
};

export function AsmaScreen({ counterTotals, onSelectPractice }: AsmaScreenProps) {
  const [query, setQuery] = useState('');

  const visibleNames = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR');

    if (!normalizedQuery) {
      return ESMA_UL_HUSNA;
    }

    return ESMA_UL_HUSNA.filter((item) =>
      [item.title, item.arabic, item.latin, item.meaning]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('tr-TR')
        .includes(normalizedQuery),
    );
  }, [query]);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        eyebrow="Esmâ"
        title="Esmâü'l-Hüsna"
        subtitle="Allah’ın güzel isimleri, okunuşları ve kısa anlamları."
      />

      <TextInput
        onChangeText={setQuery}
        placeholder="İsim veya anlam ara"
        placeholderTextColor={colors.mutedLight}
        style={styles.searchInput}
        value={query}
      />

      {visibleNames.length > 0 ? (
        visibleNames.map((item, index) => (
          <Pressable
            accessibilityRole="button"
            key={item.id}
            onPress={() => onSelectPractice(item)}
            style={styles.card}
          >
            <View style={styles.numberBox}>
              <Text style={styles.number}>{String(index + 1).padStart(2, '0')}</Text>
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.latin}>{item.latin}</Text>
              <Text style={styles.meaning}>{item.meaning}</Text>
              <Text style={styles.total}>Toplam {counterTotals[item.id] ?? 0}</Text>
            </View>
            <Text style={styles.arabic}>{item.arabic}</Text>
          </Pressable>
        ))
      ) : (
        <EmptyState icon="sparkles-outline" text="Farklı bir kelimeyle tekrar ara." title="Eşleşme yok" />
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
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  card: {
    ...shadows.soft,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  numberBox: {
    alignItems: 'center',
    backgroundColor: colors.goldSoft,
    borderRadius: radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  number: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  copy: {
    flex: 1,
  },
  title: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  latin: {
    color: colors.emerald,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 3,
  },
  meaning: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  total: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 5,
  },
  arabic: {
    color: colors.emeraldDark,
    fontSize: 23,
    fontWeight: '800',
    minWidth: 74,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
