import { Ionicons } from '@expo/vector-icons';
import { useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ScrollTopButton } from '../components/ScrollTopButton';
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<FlatList<PracticeItem>>(null);

  const visibleNames = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR');

    if (!normalizedQuery) {
      return ESMA_UL_HUSNA;
    }

    return ESMA_UL_HUSNA.filter((item) =>
      [item.title, item.arabic, item.latin, item.meaning, item.note]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('tr-TR')
        .includes(normalizedQuery),
    );
  }, [query]);

  return (
    <View style={styles.screen}>
      <FlatList
        data={visibleNames}
        extraData={counterTotals}
        keyExtractor={(item) => item.id}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        contentContainerStyle={styles.content}
        onScroll={(event) => setShowScrollTop(event.nativeEvent.contentOffset.y > 420)}
        ref={scrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
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

          </>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => onSelectPractice(item)}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <View style={styles.nameCopy}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
              </View>
              <Text style={styles.arabic} numberOfLines={2}>
                {item.arabic}
              </Text>
            </View>

            <Text style={styles.meaning}>{item.meaning}</Text>

            {item.note ? (
              <View style={styles.purposeBox}>
                <Text style={styles.purposeLabel}>Niyet</Text>
                <Text style={styles.purposeText}>{item.note}</Text>
              </View>
            ) : null}

            <View style={styles.cardFooter}>
              <Text style={styles.total}>Toplam {counterTotals[item.id] ?? 0}</Text>
              <Ionicons color={colors.emerald} name="arrow-forward-circle" size={22} />
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="sparkles-outline"
            text="Farklı bir kelimeyle tekrar ara."
            title="Eşleşme yok"
          />
        }
      />
      <ScrollTopButton
        onPress={() => scrollRef.current?.scrollToOffset({ offset: 0, animated: true })}
        visible={showScrollTop}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
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
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  nameCopy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 22,
  },
  arabic: {
    color: colors.emeraldDark,
    flexShrink: 1,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 32,
    maxWidth: 112,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  meaning: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  purposeBox: {
    backgroundColor: colors.surfaceTint,
    borderColor: colors.line,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  purposeLabel: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
    marginBottom: 3,
  },
  purposeText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  cardFooter: {
    alignItems: 'center',
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  total: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
  },
});
