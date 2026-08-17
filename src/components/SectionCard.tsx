import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing } from '../theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

type SectionCardProps = {
  title: string;
  subtitle: string;
  meta?: string;
  icon: IoniconName;
  accent?: string;
  onPress: () => void;
};

export function SectionCard({
  title,
  subtitle,
  meta,
  icon,
  accent = colors.emerald,
  onPress,
}: SectionCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: accent }]}>
        <Ionicons color={colors.surface} name={icon} size={23} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      </View>
      <Ionicons color={colors.mutedLight} name="chevron-forward" size={19} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.soft,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: radius.md,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  copy: {
    flex: 1,
  },
  title: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
  meta: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 6,
  },
});
