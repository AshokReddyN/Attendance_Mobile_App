import { COLORS, TYPOGRAPHY } from './theme';

export const navigationTheme = {
  dark: false,
  colors: {
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.white,
    text: COLORS.textPrimary,
    border: COLORS.gray200,
    notification: COLORS.error,
  },
};

export const screenOptions = {
  headerStyle: {
    backgroundColor: COLORS.white,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  headerTitleStyle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
  },
  headerTintColor: COLORS.primary,
  headerBackTitleVisible: false,
  cardStyle: {
    backgroundColor: COLORS.background,
  },
}; 