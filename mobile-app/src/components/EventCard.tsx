import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from './Card';
import Button from './Button';
import Icon from './Icon';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  variant?: 'default' | 'compact';
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onEdit,
  onDelete,
  showActions = false,
  variant = 'default',
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

  if (variant === 'compact') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card variant="elevated" style={styles.compactCard}>
          <View style={styles.compactHeader}>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {event.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
            </View>
          </View>
          
          <View style={styles.compactDetails}>
            <View style={styles.compactDetailRow}>
              <Icon name="clock" size={16} color={COLORS.textSecondary} />
              <Text style={styles.compactDetailText}>
                {formatDate(event.endAt)} at {formatTime(event.endAt)}
              </Text>
            </View>
            
            {typeof event.price === 'number' && (
              <View style={styles.compactDetailRow}>
                <Icon name="money" size={16} color={COLORS.textSecondary} />
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

  return (
    <Card variant="elevated" style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title} numberOfLines={2}>
              {event.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={20} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>
              {formatDate(event.endAt)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="clock" size={20} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>
              Ends at {formatTime(event.endAt)}
            </Text>
          </View>
          
          {typeof event.price === 'number' && (
            <View style={styles.detailRow}>
              <Icon name="money" size={20} color={COLORS.textSecondary} />
              <Text style={styles.detailText}>
                ₹{event.price.toFixed(2)}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {showActions && (
        <View style={styles.actions}>
          {onEdit && (
            <Button
              title="Edit"
              onPress={onEdit}
              variant="outline"
              size="small"
              style={{ flex: 1 }}
            />
          )}
          {onDelete && (
            <Button
              title="Delete"
              onPress={onDelete}
              variant="outline"
              size="small"
              style={{ flex: 1, borderColor: COLORS.error }}
            />
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  compactCard: {
    marginBottom: SPACING.sm,
  },
  header: {
    marginBottom: SPACING.md,
  },
  compactHeader: {
    marginBottom: SPACING.sm,
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
  },
  compactTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  statusText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.medium as any,
  },
  details: {
    marginBottom: SPACING.md,
  },
  compactDetails: {
    marginBottom: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  compactDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  detailText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  compactDetailText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
});

export default EventCard; 