import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { EventCard, Card, Button } from './index';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { Event } from '../types';

// Sample event data for demonstration
const sampleEvents: Event[] = [
  {
    id: '1',
    name: 'Team Building Workshop',
    date: '2024-01-15',
    endAt: '2024-01-15T18:00:00Z',
    price: 1500,
    optInCount: 25,
    status: 'open',
    isOptedIn: true,
  },
  {
    id: '2',
    name: 'Annual Sports Meet',
    date: '2024-01-20',
    endAt: '2024-01-20T16:00:00Z',
    price: 500,
    optInCount: 45,
    status: 'open',
    isOptedIn: false,
  },
  {
    id: '3',
    name: 'Tech Conference 2024',
    date: '2024-01-10',
    endAt: '2024-01-10T17:00:00Z',
    price: 2500,
    optInCount: 120,
    status: 'closed',
    isOptedIn: false,
  },
];

const EventCardExamples = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>EventCard Variants</Text>
          <Text style={styles.subtitle}>
            Showcasing different EventCard designs and layouts
          </Text>
        </View>

        {/* Featured Variant */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Event</Text>
          <Text style={styles.sectionDescription}>
            Large, prominent display for important events
          </Text>
          <EventCard
            event={sampleEvents[0]}
            variant="featured"
            onPress={() => console.log('Featured event pressed')}
            onEdit={() => console.log('Edit featured event')}
            onDelete={() => console.log('Delete featured event')}
            showActions={true}
          />
        </View>

        {/* Default Variant */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default Event</Text>
          <Text style={styles.sectionDescription}>
            Standard event card with detailed information
          </Text>
          <EventCard
            event={sampleEvents[1]}
            variant="default"
            onPress={() => console.log('Default event pressed')}
            onEdit={() => console.log('Edit default event')}
            onDelete={() => console.log('Delete default event')}
            showActions={true}
          />
        </View>

        {/* Compact Variant */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compact Events</Text>
          <Text style={styles.sectionDescription}>
            Space-efficient cards for lists and grids
          </Text>
          {sampleEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              variant="compact"
              onPress={() => console.log('Compact event pressed:', event.name)}
            />
          ))}
        </View>

        {/* Status Examples */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Variations</Text>
          <Text style={styles.sectionDescription}>
            Different event statuses and their visual representation
          </Text>
          
          <Card variant="elevated" style={styles.statusCard}>
            <Text style={styles.statusTitle}>Event Status Indicators</Text>
            <View style={styles.statusExamples}>
              <View style={styles.statusExample}>
                <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
                <Text style={styles.statusExampleText}>Active & Available</Text>
              </View>
              <View style={styles.statusExample}>
                <View style={[styles.statusDot, { backgroundColor: COLORS.warning }]} />
                <Text style={styles.statusExampleText}>Active & Opted In</Text>
              </View>
              <View style={styles.statusExample}>
                <View style={[styles.statusDot, { backgroundColor: COLORS.error }]} />
                <Text style={styles.statusExampleText}>Expired</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Usage Guidelines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage Guidelines</Text>
          <Card variant="outlined" style={styles.guidelinesCard}>
            <Text style={styles.guidelineTitle}>When to use each variant:</Text>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>
                <Text style={styles.guidelineHighlight}>Featured:</Text> Important events, hero sections, main content areas
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>
                <Text style={styles.guidelineHighlight}>Default:</Text> Standard event displays, detailed views, forms
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>
                <Text style={styles.guidelineHighlight}>Compact:</Text> Lists, grids, space-constrained layouts
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.md,
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
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  sectionDescription: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: TYPOGRAPHY.base * 1.4,
  },
  statusCard: {
    padding: SPACING.lg,
  },
  statusTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  statusExamples: {
    gap: SPACING.sm,
  },
  statusExample: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusExampleText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
  },
  guidelinesCard: {
    padding: SPACING.lg,
  },
  guidelineTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  guidelineBullet: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.bold as any,
    marginTop: 2,
  },
  guidelineText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: TYPOGRAPHY.base * 1.4,
  },
  guidelineHighlight: {
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.semibold as any,
  },
});

export default EventCardExamples; 