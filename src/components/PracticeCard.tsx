import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing } from '../theme';
import { ContentCategory, PracticeItem } from '../types';
import { speakPracticeItem } from '../utils/speech';

const categoryLabels: Record<ContentCategory, string> = {
  zikr: 'Zikir',
  dua: 'Dua',
  ayet: 'Ayet',
  esma: 'Esmâ',
};

const categoryColors: Record<ContentCategory, string> = {
  zikr: colors.emerald,
  dua: colors.teal,
  ayet: colors.rose,
  esma: colors.gold,
};

type PracticeCardProps = {
  item: PracticeItem;
  lifetimeTotal?: number;
  onSelect: (item: PracticeItem) => void;
  onDelete?: (id: string) => void;
  onEdit?: (item: PracticeItem) => void;
};

const DOUBLE_PRESS_DELAY = 280;

export function PracticeCard({
  item,
  lifetimeTotal,
  onSelect,
  onDelete,
  onEdit,
}: PracticeCardProps) {
  const accent = categoryColors[item.category];
  const lastPressRef = useRef(0);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  useEffect(() => clearPendingPress, []);

  const handlePress = () => {
    if (!onEdit) {
      onSelect(item);
      return;
    }

    const now = Date.now();

    if (now - lastPressRef.current < DOUBLE_PRESS_DELAY) {
      clearPendingPress();
      lastPressRef.current = 0;
      onEdit(item);
      return;
    }

    lastPressRef.current = now;
    clearPendingPress();
    pressTimerRef.current = setTimeout(() => {
      lastPressRef.current = 0;
      pressTimerRef.current = null;
      onSelect(item);
    }, DOUBLE_PRESS_DELAY);
  };

  return (
    <Pressable accessibilityRole="button" onPress={handlePress} style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.badge, { backgroundColor: `${accent}18` }]}>
          <Text style={[styles.badgeText, { color: accent }]}>{categoryLabels[item.category]}</Text>
        </View>
        <View style={styles.topMeta}>
          {typeof lifetimeTotal === 'number' ? (
            <Text style={styles.totalMeta}>{lifetimeTotal} toplam</Text>
          ) : null}
          <Text style={styles.target}>{item.target ? `${item.target} hedef` : 'Serbest'}</Text>
        </View>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      {item.arabic ? <Text style={styles.arabic}>{item.arabic}</Text> : null}
      {item.latin ? <Text style={styles.latin}>{item.latin}</Text> : null}
      {item.meaning ? <Text style={styles.meaning}>{item.meaning}</Text> : null}

      <View style={styles.footer}>
        <Text style={styles.note} numberOfLines={1}>
          {item.note ?? (item.source === 'custom' ? 'Kişisel kayıt' : 'Hazır içerik')}
        </Text>
        <View style={styles.footerActions}>
          <Pressable
            accessibilityLabel={`${item.title} sesli dinle`}
            accessibilityRole="button"
            onPress={(event) => {
              event.stopPropagation();
              void speakPracticeItem(item);
            }}
            style={styles.iconButton}
          >
            <Ionicons color={colors.emerald} name="volume-medium-outline" size={18} />
          </Pressable>
          {onEdit ? (
            <Pressable
              accessibilityLabel={`${item.title} düzenle`}
              accessibilityRole="button"
              onPress={(event) => {
                event.stopPropagation();
                clearPendingPress();
                onEdit(item);
              }}
              style={styles.iconButton}
            >
              <Ionicons color={colors.gold} name="create-outline" size={18} />
            </Pressable>
          ) : null}
          {onDelete ? (
            <Pressable
              accessibilityLabel={`${item.title} sil`}
              accessibilityRole="button"
              onPress={(event) => {
                event.stopPropagation();
                onDelete(item.id);
              }}
              style={styles.iconButton}
            >
              <Ionicons color={colors.danger} name="trash-outline" size={18} />
            </Pressable>
          ) : (
            <Ionicons color={colors.emerald} name="arrow-forward-circle" size={24} />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.soft,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  badge: {
    borderRadius: radius.sm,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
  },
  target: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  topMeta: {
    alignItems: 'flex-end',
    flexShrink: 0,
    gap: 2,
  },
  totalMeta: {
    color: colors.emerald,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  title: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  arabic: {
    color: colors.emeraldDark,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 38,
    marginTop: 10,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  latin: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 8,
  },
  meaning: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  footer: {
    alignItems: 'center',
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
  },
  note: {
    color: colors.gold,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginRight: spacing.sm,
  },
  footerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: radius.sm,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
});
