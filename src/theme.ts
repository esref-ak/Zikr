import { ViewStyle } from 'react-native';

export const colors = {
  background: '#F7F3EA',
  backgroundSoft: '#EFE9DB',
  surface: '#FFFFFF',
  surfaceTint: '#FBF7EF',
  ink: '#17221F',
  muted: '#637169',
  mutedLight: '#97A39B',
  emerald: '#0E6F5C',
  emeraldDark: '#08483E',
  teal: '#1A8A83',
  gold: '#C9952C',
  goldSoft: '#F4E2B8',
  rose: '#8A3C56',
  roseSoft: '#F2D8E0',
  line: '#E4DED0',
  success: '#287A4C',
  danger: '#B54646',
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 26,
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
};

export const shadows = {
  soft: {
    shadowColor: '#10201B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  } satisfies ViewStyle,
};
