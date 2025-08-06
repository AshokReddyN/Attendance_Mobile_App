import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import eventService from '../services/eventService';
import { Event } from '../types';
import { useSafeAsyncOperation } from '../context/CrashReportingContext';
import crashDetectionService from '../services/crashDetectionService';

type MemberDashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MemberDashboard'
>;

const MemberDashboard = () => {
  // Temporarily disabled screen tracking to prevent infinite loop
  // useScreenTracking('MemberDashboard');
  const { logout } = useAuth();
  const navigation = useNavigation<MemberDashboardNavigationProp>();
  const safeAsyncOperation = useSafeAsyncOperation();
  const [todaysEvent, setTodaysEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOptingIn, setIsOptingIn] = useState(false);

  const headerRight = useCallback(() => {
    return <Button onPress={logout} title="Logout" />;
  }, [logout]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight,
    });
    
    // Set screen name directly without hooks
    crashDetectionService.setCurrentScreen('MemberDashboard');
  }, [navigation, headerRight]);

  useEffect(() => {
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
  }, []);

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
      return <ActivityIndicator testID="activity-indicator" size="large" color="#0000ff" />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (!todaysEvent) {
      return <Text style={styles.noEventText}>No active event today.</Text>;
    }

    return (
      <View style={styles.eventContainer}>
        <Text style={styles.eventTitle}>Today's Active Event</Text>
        <Text style={styles.detailText}>Name: {todaysEvent.name}</Text>
        <Text style={styles.detailText}>Price: {typeof todaysEvent.price === 'number' ? `₹${todaysEvent.price.toFixed(2)}` : 'Price not available'}</Text>
        <Text style={styles.detailText}>
          Ends at: {new Date(todaysEvent.endAt).toLocaleTimeString()}
        </Text>
        <Button
          title={todaysEvent.isOptedIn ? 'Opted-In' : 'Opt-In'}
          onPress={handleOptIn}
          disabled={todaysEvent.isOptedIn || isOptingIn}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Member!</Text>
      {renderEventDetails()}
      <View style={styles.navigationButton}>
        <Button
          title="View My Participation History"
          onPress={() => navigation.navigate('MyParticipation')}
        />
      </View>
      <View style={styles.navigationButton}>
        <Button
          title="View My Payments"
          onPress={() => navigation.navigate('Payments')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  eventContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  noEventText: {
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginTop: 20,
  },
  logoutButton: {
    marginTop: 20,
  },
  navigationButton: {
    marginTop: 20,
  },
});

export default MemberDashboard;
