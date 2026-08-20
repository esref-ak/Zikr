import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PracticeCard } from '../components/PracticeCard';
import { ScrollTopButton } from '../components/ScrollTopButton';
import { ScreenHeader } from '../components/ScreenHeader';
import type { CounterTotals } from '../storage/counterTotals';
import { colors, radius, shadows, spacing } from '../theme';
import { PracticeItem } from '../types';
import { speakPracticeItem } from '../utils/speech';

const QUICK_TARGETS = [33, 99, 100, 313, 500, 1000];

function getCycleCount(count: number, target: number) {
  if (target <= 0 || count < target) {
    return count;
  }

  const cycleCount = count % target;
  return cycleCount === 0 ? target : cycleCount;
}

type CounterScreenProps = {
  activePractice: PracticeItem;
  counterTotals: CounterTotals;
  isCounterReady: boolean;
  lifetimeTotal: number;
  onCountChange: (id: string, amount: number) => number;
  practiceItems: PracticeItem[];
  onSelectPractice: (item: PracticeItem) => void;
};

export function CounterScreen({
  activePractice,
  counterTotals,
  isCounterReady,
  lifetimeTotal,
  onCountChange,
  practiceItems,
  onSelectPractice,
}: CounterScreenProps) {
  const [sessionTotal, setSessionTotal] = useState(0);
  const [target, setTarget] = useState(activePractice.target ?? 99);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const sessionTotalRef = useRef(0);

  useEffect(() => {
    sessionTotalRef.current = 0;
    setSessionTotal(0);
    setTarget(activePractice.target ?? 99);
  }, [activePractice.id, activePractice.target]);

  const count = useMemo(() => getCycleCount(sessionTotal, target), [sessionTotal, target]);
  const completedRounds = useMemo(() => {
    if (target <= 0) {
      return 0;
    }

    return Math.floor(sessionTotal / target);
  }, [sessionTotal, target]);

  const progress = useMemo(() => {
    if (!target) {
      return 0;
    }

    return Math.min(count / target, 1);
  }, [count, target]);

  const remaining = Math.max(target - count, 0);
  const targetStatus =
    remaining === 0
      ? `${target}/${target} tamamlandı`
      : completedRounds > 0
        ? `${completedRounds} tur tamamlandı, ${remaining} kaldı`
        : `${remaining} kaldı`;
  const tapButtonSub = isCounterReady ? targetStatus : 'Sayaç hazırlanıyor';

  const applySessionDelta = (amount: number) => {
    if (!isCounterReady) {
      return;
    }

    const nextSessionTotal = Math.max(sessionTotalRef.current + amount, 0);
    const appliedDelta = nextSessionTotal - sessionTotalRef.current;

    if (appliedDelta === 0) {
      return;
    }

    sessionTotalRef.current = nextSessionTotal;
    setSessionTotal(nextSessionTotal);
    onCountChange(activePractice.id, appliedDelta);
  };

  const subtractCount = () => {
    applySessionDelta(-1);
  };

  const showLifetimeTotal = () => {
    Alert.alert(
      'Genel toplam',
      `${activePractice.title} için bugüne kadar ${lifetimeTotal} defa zikrettin. Seans sayacını sıfırlamak bu toplamı değiştirmez.`,
    );
  };

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
        action={
          <View style={styles.headerActions}>
            <Pressable
              accessibilityLabel={`${activePractice.title} sesli dinle`}
              accessibilityRole="button"
              onPress={() => {
                void speakPracticeItem(activePractice);
              }}
              style={styles.headerIconButton}
            >
              <Ionicons color={colors.emerald} name="volume-medium-outline" size={21} />
            </Pressable>
            <Pressable
              accessibilityLabel="Seans sayacını sıfırla"
              accessibilityRole="button"
              onPress={() => {
                sessionTotalRef.current = 0;
                setSessionTotal(0);
              }}
              style={styles.headerIconButton}
            >
              <Ionicons color={colors.emerald} name="refresh-outline" size={22} />
            </Pressable>
          </View>
        }
        eyebrow="Sayaç"
        title={activePractice.title}
        subtitle={activePractice.note ?? activePractice.meaning}
      />

      <View style={styles.counterCard}>
        <View style={styles.arabicFrame}>
          <Text style={styles.arabic}>{activePractice.arabic ?? activePractice.title}</Text>
          {activePractice.latin ? <Text style={styles.latin}>{activePractice.latin}</Text> : null}
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        <View style={styles.counterMeta}>
          <View>
            <Text style={styles.counterValue}>{count}</Text>
            <Text style={styles.counterLabel}>çekilen</Text>
          </View>
          <View style={styles.metaBoxes}>
            <Pressable
              accessibilityRole="button"
              onPress={showLifetimeTotal}
              style={styles.totalBox}
            >
              <Text style={styles.totalValue}>{lifetimeTotal}</Text>
              <Text style={styles.totalLabel}>toplam zikir</Text>
            </Pressable>
            <View style={styles.targetBox}>
              <Text style={styles.targetValue}>{target}</Text>
              <Text style={styles.targetLabel}>hedef</Text>
            </View>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={!isCounterReady}
          onPress={() => applySessionDelta(1)}
          style={[styles.tapButton, !isCounterReady && styles.disabledButton]}
        >
          <Text style={styles.tapButtonText}>Zikret</Text>
          <Text style={styles.tapButtonSub}>{tapButtonSub}</Text>
        </Pressable>

        <View style={styles.counterActions}>
          <Pressable
            accessibilityRole="button"
            disabled={!isCounterReady || sessionTotalRef.current <= 0}
            onPress={subtractCount}
            style={[
              styles.smallAction,
              (!isCounterReady || sessionTotal <= 0) && styles.disabledAction,
            ]}
          >
            <Ionicons color={colors.ink} name="remove-outline" size={20} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={!isCounterReady || sessionTotal <= 0}
            onPress={() => applySessionDelta(-10)}
            style={[
              styles.smallAction,
              (!isCounterReady || sessionTotal <= 0) && styles.disabledAction,
            ]}
          >
            <Text style={styles.deltaText}>-10</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={!isCounterReady}
            onPress={() => applySessionDelta(10)}
            style={[styles.smallAction, !isCounterReady && styles.disabledAction]}
          >
            <Text style={styles.deltaText}>+10</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.blockTitle}>Hedef</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.targetScroll}>
        {QUICK_TARGETS.map((value) => {
          const selected = value === target;

          return (
            <Pressable
              accessibilityRole="button"
              key={value}
              onPress={() => {
                setTarget(value);
                setSessionTotal((currentTotal) => {
                  const nextSessionTotal = getCycleCount(currentTotal, value);
                  sessionTotalRef.current = nextSessionTotal;
                  return nextSessionTotal;
                });
              }}
              style={[styles.targetChip, selected && styles.targetChipSelected]}
            >
              <Text style={[styles.targetChipText, selected && styles.targetChipTextSelected]}>
                {value}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.blockTitle}>Sayaç için seç</Text>
      {practiceItems.slice(0, 6).map((item) => (
        <PracticeCard
          item={item}
          key={item.id}
          lifetimeTotal={counterTotals[item.id] ?? 0}
          onSelect={onSelectPractice}
        />
      ))}
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
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerIconButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  counterCard: {
    ...shadows.soft,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  arabicFrame: {
    backgroundColor: colors.surfaceTint,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
  },
  arabic: {
    color: colors.emeraldDark,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 48,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  latin: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  progressTrack: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: radius.sm,
    height: 10,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.gold,
    borderRadius: radius.sm,
    height: 10,
  },
  counterMeta: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  counterValue: {
    color: colors.ink,
    fontSize: 58,
    fontWeight: '900',
    letterSpacing: 0,
  },
  counterLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  targetBox: {
    alignItems: 'center',
    backgroundColor: colors.goldSoft,
    borderRadius: radius.md,
    minWidth: 82,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  metaBoxes: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  totalBox: {
    alignItems: 'center',
    backgroundColor: colors.surfaceTint,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    minWidth: 82,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  totalValue: {
    color: colors.emerald,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  totalLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  targetValue: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  targetLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  tapButton: {
    alignItems: 'center',
    backgroundColor: colors.emerald,
    borderRadius: radius.lg,
    marginTop: spacing.lg,
    minHeight: 118,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  tapButtonText: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  tapButtonSub: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 5,
  },
  disabledButton: {
    opacity: 0.62,
  },
  counterActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  smallAction: {
    alignItems: 'center',
    backgroundColor: colors.surfaceTint,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    height: 48,
    justifyContent: 'center',
  },
  disabledAction: {
    opacity: 0.5,
  },
  deltaText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  blockTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
    marginBottom: spacing.md,
  },
  targetScroll: {
    marginBottom: spacing.lg,
  },
  targetChip: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    marginRight: spacing.sm,
    minWidth: 70,
    paddingHorizontal: spacing.md,
  },
  targetChipSelected: {
    backgroundColor: colors.emerald,
    borderColor: colors.emerald,
  },
  targetChipText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
  },
  targetChipTextSelected: {
    color: colors.surface,
  },
});
