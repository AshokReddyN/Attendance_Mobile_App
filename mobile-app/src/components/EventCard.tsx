import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from './Card';
import Button from './Button';
import Icon from './Icon';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onPress?: () => void;
  onEdit?: () => void;
  onOptIn?: () => void;
  onOptOut?: () => void;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  isOptingIn?: boolean;
  isOptingOut?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onEdit,
  onOptIn,
  onOptOut,
  showActions = false,
  variant = 'default',
  isOptingIn = false,
  isOptingOut = false,
}) => {
  const formatDate = (dateInput: string | number | Date) => {
    const date = new Date(dateInput);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateInput: string | number | Date) => {
    const date = new Date(dateInput);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = () => {
    const now = new Date();
    const endTime = new Date(event.endAt);
    
    if (now > endTime) {
      return COLORS.error;
    }
    
    if (event.isOptedIn) {
      return COLORS.success;
    }
    
    return COLORS.warning;
  };

  const getStatusText = () => {
    const now = new Date();
    const endTime = new Date(event.endAt);
    
    if (now > endTime) {
      return 'Expired';
    }
    
    if (event.isOptedIn) {
      return 'Opted In';
    }
    
    return 'Active';
  };

  const getStatusIcon = () => {
    const now = new Date();
    const endTime = new Date(event.endAt);
    
    if (now > endTime) {
      return 'close';
    }
    
    if (event.isOptedIn) {
      return 'check';
    }
    
    return 'event';
  };

  if (variant === 'compact') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card variant="elevated" style={styles.compactCard}>
          <View style={styles.compactHeader}>
            <View style={styles.compactTitleSection}>
              <Text style={styles.compactTitle} numberOfLines={1}>
                {event.name}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15' }]}>
                <Icon name={getStatusIcon()} size={12} color={getStatusColor()} />
                <Text style={[styles.statusText, { color: getStatusColor() }]}>
                  {getStatusText()}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.compactDetails}>
            <View style={styles.compactDetailRow}>
              <Icon name="clock" size={14} color={COLORS.textSecondary} />
              <Text style={styles.compactDetailText}>
                {formatDate(event.endAt)} at {formatTime(event.endAt)}
              </Text>
            </View>
            
            {typeof event.price === 'number' && (
              <View style={styles.compactDetailRow}>
                <Icon name="money" size={14} color={COLORS.textSecondary} />
                <Text style={styles.compactDetailText}>
                  ₹{event.price.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  if (variant === 'featured') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card variant="elevated" style={styles.featuredCard}>
          <View style={styles.featuredHeader}>
            <View style={styles.featuredTitleSection}>
              <Text style={styles.featuredTitle} numberOfLines={2}>
                {event.name}
              </Text>
              <View style={[styles.featuredStatusBadge, { backgroundColor: getStatusColor() + '20' }]}>
                <Icon name={getStatusIcon()} size={16} color={getStatusColor()} />
                <Text style={[styles.featuredStatusText, { color: getStatusColor() }]}>
                  {getStatusText()}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.featuredDetails}>
            <View style={styles.featuredDetailRow}>
              <Icon name="calendar" size={18} color={COLORS.primary} />
              <Text style={styles.featuredDetailText}>
                {formatDate(event.endAt)}
              </Text>
            </View>
            
            <View style={styles.featuredDetailRow}>
              <Icon name="clock" size={18} color={COLORS.primary} />
              <Text style={styles.featuredDetailText}>
                Ends at {formatTime(event.endAt)}
              </Text>
            </View>
            
            {typeof event.price === 'number' && (
              <View style={styles.featuredDetailRow}>
                <Icon name="money" size={18} color={COLORS.primary} />
                <Text style={styles.featuredDetailText}>
                  ₹{event.price.toFixed(2)}
                </Text>
              </View>
            )}
          </View>

          {showActions && (
            <View style={styles.featuredActions}>
              {onEdit && (
                <Button
                  title="Edit"
                  onPress={onEdit}
                  variant="outline"
                  size="small"
                  style={{ flex: 1, marginRight: SPACING.xs }}
                />
              )}
            </View>
          )}

          {onOptIn && !event.isOptedIn && (
            <View style={styles.featuredOptIn}>
              <Button
                title={isOptingIn ? "Opting In..." : "Opt In to Event"}
                onPress={onOptIn}
                variant="primary"
                loading={isOptingIn}
                disabled={isOptingIn}
                style={styles.optInButton}
              />
            </View>
          )}

          {onOptOut && event.isOptedIn && (
            <View style={styles.featuredOptOut}>
              <Button
                title={isOptingOut ? "Opting Out..." : "Opt Out of Event"}
                onPress={onOptOut}
                variant="outline"
                loading={isOptingOut}
                disabled={isOptingOut}
                style={styles.optOutButton}
              />
            </View>
          )}

          {event.isOptedIn && !onOptOut && (
            <View style={styles.optedInStatus}>
              <Icon name="check-circle" size={16} color={COLORS.success} />
              <Text style={styles.optedInText}>Successfully Opted In</Text>
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  }

  // Default variant
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title} numberOfLines={2}>
              {event.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15' }]}>
              <Icon name={getStatusIcon()} size={14} color={getStatusColor()} />
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon name="calendar" size={16} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>
              {formatDate(event.endAt)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon name="clock" size={16} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.detailLabel}>Ends at:</Text>
            <Text style={styles.detailValue}>
              {formatTime(event.endAt)}
            </Text>
          </View>
          
          {typeof event.price === 'number' && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Icon name="money" size={16} color={COLORS.textSecondary} />
              </View>
              <Text style={styles.detailLabel}>Price:</Text>
              <Text style={styles.detailValue}>
                ₹{event.price.toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        {showActions && (
          <View style={styles.actions}>
            {onEdit && (
              <Button
                title="Edit Event"
                onPress={onEdit}
                variant="outline"
                size="small"
                style={{ flex: 1, marginRight: SPACING.xs }}
              />
            )}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Default variant styles
  card: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.md,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: TYPOGRAPHY.lg * 1.3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 70,
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  statusText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.medium as any,
  },
  details: {
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  detailIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.medium as any,
    marginRight: SPACING.sm,
    minWidth: 60,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.semibold as any,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },

  // Compact variant styles
  compactCard: {
    marginBottom: SPACING.sm,
    padding: SPACING.md,
  },
  compactHeader: {
    marginBottom: SPACING.sm,
  },
  compactTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  compactTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
    flex: 1,
  },
  compactDetails: {
    marginBottom: SPACING.sm,
  },
  compactDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  compactDetailText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },

  // Featured variant styles
  featuredCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.xl,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  featuredHeader: {
    marginBottom: SPACING.lg,
  },
  featuredTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  featuredTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.bold as any,
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: TYPOGRAPHY.xl * 1.3,
  },
  featuredStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 80,
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  featuredStatusText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium as any,
  },
  featuredDetails: {
    marginBottom: SPACING.lg,
  },
  featuredDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  featuredDetailText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.medium as any,
    marginLeft: SPACING.md,
  },
  featuredActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  featuredOptIn: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  optInButton: {
    width: '100%',
  },
  featuredOptOut: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  optOutButton: {
    width: '100%',
  },
  optedInStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  optedInText: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.success,
    fontWeight: TYPOGRAPHY.medium as any,
  },
});

export default EventCard; 