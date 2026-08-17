import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

type EmptyStateProps = {
  icon?: IoniconName;
  title: string;
  text: string;
};

export function EmptyState({ icon = 'leaf-outline', title, text }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons color={colors.emerald} name={icon} size={26} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.surfaceTint,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.goldSoft,
    borderRadius: radius.xl,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  title: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: spacing.md,
  },
  text: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
    textAlign: 'center',
  },
});
