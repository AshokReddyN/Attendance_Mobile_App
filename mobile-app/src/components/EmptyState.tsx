import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'compact';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'search',
  title,
  subtitle,
  action,
  variant = 'default',
}) => {
  return (
    <View style={[styles.container, variant === 'compact' && styles.compactContainer]}>
      <View style={styles.iconContainer}>
        <Icon 
          name={icon} 
          size={variant === 'compact' ? 48 : 64} 
          color={COLORS.gray400} 
        />
      </View>
      
      <Text style={[styles.title, variant === 'compact' && styles.compactTitle]}>
        {title}
      </Text>
      
      {subtitle && (
        <Text style={[styles.subtitle, variant === 'compact' && styles.compactSubtitle]}>
          {subtitle}
        </Text>
      )}
      
      {action && (
        <View style={styles.actionContainer}>
          {action}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  compactContainer: {
    padding: SPACING.lg,
  },
  iconContainer: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  compactTitle: {
    fontSize: TYPOGRAPHY.lg,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: TYPOGRAPHY.base * 1.5,
  },
  compactSubtitle: {
    fontSize: TYPOGRAPHY.sm,
    marginBottom: SPACING.md,
  },
  actionContainer: {
    alignItems: 'center',
  },
});

export default EmptyState; 