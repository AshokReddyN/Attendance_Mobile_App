import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ScrollView } from 'react-native';
import eventService from '../services/eventService';
import { Participation } from '../types';
import { Card, Icon, LoadingSpinner, EmptyState } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';

const MyParticipationScreen = () => {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipations = async () => {
      try {
        setIsLoading(true);
        const fetchedParticipations = await eventService.getMyParticipations();
        setParticipations(fetchedParticipations);
        setError(null);
      } catch (e) {
        setError('Failed to fetch participation history.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipations();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderParticipationItem = ({ item }: { item: Participation }) => (
    <Card variant="elevated" style={styles.participationCard}>
      <View style={styles.participationHeader}>
        <View style={styles.eventIconContainer}>
          <Icon name="event" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.eventInfo}>
          <Text style={styles.eventName}>{item.eventName}</Text>
          <Text style={styles.eventDate}>{formatDate(item.eventDate)}</Text>
        </View>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>
            ₹{typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.participationDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <Icon name="calendar" size={16} color={COLORS.textSecondary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Event Date</Text>
            <Text style={styles.detailValue}>{formatDate(item.eventDate)}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <Icon name="clock" size={16} color={COLORS.textSecondary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Opted-in Time</Text>
            <Text style={styles.detailValue}>{formatTime(item.optedInAt)}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <Icon name="money" size={16} color={COLORS.textSecondary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Event Price</Text>
            <Text style={styles.detailValue}>
              ₹{typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner text="Loading your participation history..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="alert-circle"
          title="Unable to Load History"
          subtitle={error}
          variant="compact"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Participation History</Text>
          <Text style={styles.subtitle}>
            Track all the events you've participated in
          </Text>
        </View>

        {participations.length === 0 ? (
          <EmptyState
            icon="calendar-check"
            title="No Participation History"
            subtitle="You haven't participated in any events yet. Your participation history will appear here once you start joining events."
            variant="default"
          />
        ) : (
          <View style={styles.participationsContainer}>
            <View style={styles.participationsHeader}>
              <Text style={styles.sectionTitle}>Recent Participations</Text>
              <Text style={styles.participationCount}>{participations.length} events</Text>
            </View>
            
            <FlatList
              data={participations}
              keyExtractor={(item) => item.eventId}
              renderItem={renderParticipationItem}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.participationsList}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.bold as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lg * 1.4,
  },
  participationsContainer: {
    marginBottom: SPACING.lg,
  },
  participationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
  },
  participationCount: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  participationsList: {
    gap: SPACING.md,
  },
  participationCard: {
    marginBottom: SPACING.sm,
  },
  participationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  eventIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  eventDate: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  priceBadge: {
    backgroundColor: COLORS.success + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.success + '30',
  },
  priceText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.success,
  },
  participationDetails: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.medium as any,
    marginBottom: SPACING.xs,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium as any,
    color: COLORS.textPrimary,
  },
});

export default MyParticipationScreen;
