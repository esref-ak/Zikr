import { Ionicons } from '@expo/vector-icons';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ScrollTopButton } from '../components/ScrollTopButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { ESMA_UL_HUSNA } from '../data/presets';
import type { CounterTotals } from '../storage/counterTotals';
import { colors, radius, shadows, spacing } from '../theme';
import { PracticeItem } from '../types';
import { speakPracticeItem } from '../utils/speech';

type AsmaScreenProps = {
  counterTotals: CounterTotals;
  onSelectPractice: (item: PracticeItem) => void;
};

export function AsmaScreen({ counterTotals, onSelectPractice }: AsmaScreenProps) {
  const [query, setQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

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
      <ScrollView
        contentContainerStyle={styles.content}
        onScroll={(event) => setShowScrollTop(event.nativeEvent.contentOffset.y > 420)}
        ref={scrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
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
          visibleNames.map((item) => (
            <Pressable
              accessibilityRole="button"
              key={item.id}
              onPress={() => onSelectPractice(item)}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <View style={styles.numberBox}>
                  <Text style={styles.number}>{item.id.replace('esma-', '')}</Text>
                </View>
                <View style={styles.nameCopy}>
                  <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.latin}>{item.latin}</Text>
                </View>
                <Text style={styles.arabic} numberOfLines={2}>
                  {item.arabic}
                </Text>
                <Pressable
                  accessibilityLabel={`${item.title} sesli dinle`}
                  accessibilityRole="button"
                  onPress={(event) => {
                    event.stopPropagation();
                    void speakPracticeItem(item);
                  }}
                  style={styles.listenButton}
                >
                  <Ionicons color={colors.emerald} name="volume-medium-outline" size={18} />
                </Pressable>
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
          ))
        ) : (
          <EmptyState
            icon="sparkles-outline"
            text="Farklı bir kelimeyle tekrar ara."
            title="Eşleşme yok"
          />
        )}
      </ScrollView>
      <ScrollTopButton
        onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
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
  latin: {
    color: colors.emerald,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 18,
    marginTop: 3,
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
  listenButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceTint,
    borderColor: colors.line,
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
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
