import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import eventService from '../services/eventService';
import { Event } from '../types';
import { Button, Card, Header } from '../components';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

type MemberDashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MemberDashboard'
>;

const MemberDashboard = () => {
  const { logout, authData } = useAuth();
  const navigation = useNavigation<MemberDashboardNavigationProp>();
  const [todaysEvent, setTodaysEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOptingIn, setIsOptingIn] = useState(false);

  useLayoutEffect(() => {
    if (authData) {
      navigation.setOptions({
        headerRight: () => (
          <Button
            title="Logout"
            onPress={logout}
            variant="ghost"
            size="small"
          />
        ),
      });
    }
  }, [navigation, logout, authData]);

  useEffect(() => {
    // Only fetch today's event if user is authenticated
    if (!authData) return;

    const fetchTodaysEvent = async () => {
      try {
        setIsLoading(true);
        const event = await eventService.getTodaysEvent();
        setTodaysEvent(event);
        setError(null);
      } catch (e) {
        setError('Failed to fetch today\'s event.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodaysEvent();
  }, [authData]);

  const handleOptIn = async () => {
    if (!todaysEvent) return;

    setIsOptingIn(true);
    try {
      await eventService.optInToEvent(todaysEvent.id);
      setTodaysEvent({ ...todaysEvent, isOptedIn: true });
      Alert.alert('Success', 'You have successfully opted in to the event.');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      Alert.alert('Opt-In Failed', errorMessage);
    } finally {
      setIsOptingIn(false);
    }
  };

  const renderEventDetails = () => {
    if (isLoading) {
      return (
        <Card variant="elevated" style={styles.loadingCard}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading today's event...</Text>
          </View>
        </Card>
      );
    }

    if (error) {
      return (
        <Card variant="outlined" style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      );
    }

    if (!todaysEvent) {
      return (
        <Card variant="outlined" style={styles.noEventCard}>
          <Text style={styles.noEventText}>No active event today.</Text>
          <Text style={styles.noEventSubtext}>Check back later for new events!</Text>
        </Card>
      );
    }

    return (
      <Card variant="elevated" style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>Today's Active Event</Text>
          <View style={styles.eventStatus}>
            <View style={[styles.statusDot, todaysEvent.isOptedIn && styles.statusDotOptedIn]} />
            <Text style={styles.statusText}>
              {todaysEvent.isOptedIn ? 'Opted In' : 'Available'}
            </Text>
          </View>
        </View>
        
        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Event Name:</Text>
            <Text style={styles.detailValue}>{todaysEvent.name}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>
              {typeof todaysEvent.price === 'number' ? `₹${todaysEvent.price.toFixed(2)}` : 'Price not available'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ends at:</Text>
            <Text style={styles.detailValue}>
              {new Date(todaysEvent.endAt).toLocaleTimeString()}
            </Text>
          </View>
        </View>

        <Button
          title={todaysEvent.isOptedIn ? 'Already Opted-In' : 'Opt-In to Event'}
          onPress={handleOptIn}
          disabled={todaysEvent.isOptedIn || isOptingIn}
          loading={isOptingIn}
          variant={todaysEvent.isOptedIn ? 'outline' : 'primary'}
          style={styles.optInButton}
        />
      </Card>
    );
  };

  // Don't render anything if user is not authenticated
  if (!authData) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
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
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.welcomeSubtitle}>
            {authData.user.name || 'Member'}
          </Text>
        </View>

        {renderEventDetails()}

        <View style={styles.navigationSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <Card variant="elevated" style={styles.actionCard}>
            <Button
              title="View My Participation History"
              onPress={() => navigation.navigate('MyParticipation')}
              variant="outline"
              style={styles.actionButton}
            />
          </Card>

          <Card variant="elevated" style={styles.actionCard}>
            <Button
              title="View My Payments"
              onPress={() => navigation.navigate('Payments')}
              variant="outline"
              style={styles.actionButton}
            />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.md,
  },
  welcomeTitle: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.bold as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  welcomeSubtitle: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textSecondary,
  },
  loadingCard: {
    marginBottom: SPACING.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textSecondary,
  },
  errorCard: {
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  errorText: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.error,
    textAlign: 'center',
    padding: SPACING.md,
  },
  noEventCard: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
    padding: SPACING.lg,
  },
  noEventText: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  noEventSubtext: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
  eventCard: {
    marginBottom: SPACING.lg,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  eventTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.bold as any,
    color: COLORS.textPrimary,
  },
  eventStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray400,
    marginRight: SPACING.xs,
  },
  statusDotOptedIn: {
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  eventDetails: {
    marginBottom: SPACING.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.medium as any,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.semibold as any,
  },
  optInButton: {
    marginTop: SPACING.sm,
  },
  navigationSection: {
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  actionCard: {
    marginBottom: SPACING.md,
  },
  actionButton: {
    width: '100%',
  },
});

export default MemberDashboard;
