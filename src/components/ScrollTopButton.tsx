import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius, shadows } from '../theme';

type ScrollTopButtonProps = {
  visible: boolean;
  onPress: () => void;
};

export function ScrollTopButton({ visible, onPress }: ScrollTopButtonProps) {
  return (
    <Pressable
      accessibilityLabel="Yukarı çık"
      accessibilityRole="button"
      onPress={onPress}
      pointerEvents={visible ? 'auto' : 'none'}
      style={[styles.button, !visible && styles.hidden]}
    >
      <Ionicons color={colors.surface} name="arrow-up" size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    ...shadows.soft,
    alignItems: 'center',
    backgroundColor: colors.emerald,
    borderRadius: radius.md,
    bottom: 88,
    height: 46,
    justifyContent: 'center',
    position: 'absolute',
    right: 18,
    width: 46,
  },
  hidden: {
    opacity: 0,
  },
});
