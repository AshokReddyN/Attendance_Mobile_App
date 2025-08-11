import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import eventService from '../services/eventService';
import { Event } from '../types';
import { Button, Card, Header, EventCard, EmptyState } from '../components';
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
        <EmptyState
          icon="event"
          title="No Active Events"
          subtitle="There are no events scheduled for today. Check back later for new events!"
        />
      );
    }

    return (
      <EventCard
        event={todaysEvent}
        variant="featured"
        onPress={() => {
          // Could navigate to event details if needed
        }}
      />
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

        <View style={styles.eventSection}>
          <Text style={styles.sectionTitle}>Today's Event</Text>
          {renderEventDetails()}
        </View>

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
  eventSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
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
  navigationSection: {
    marginTop: SPACING.md,
  },
  actionCard: {
    marginBottom: SPACING.md,
  },
  actionButton: {
    width: '100%',
  },
});

export default MemberDashboard;
