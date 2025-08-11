import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import eventService from '../services/eventService';
import { Event } from '../types';
import { Button, EventCard, EmptyState, LoadingSpinner } from '../components';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

type AdminEventsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminDashboard'
>;

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<AdminEventsNavigationProp>();

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await eventService.getEvents();
      setEvents(response.events);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'An unknown error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  const handleEditEvent = (event: Event) => {
    navigation.navigate('EditEvent', { event });
  };

  const handleDeleteEvent = (event: Event) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Add delete logic here
              Alert.alert('Success', 'Event deleted successfully');
              fetchEvents(); // Refresh the list
            } catch (error) {
              Alert.alert('Error', 'Failed to delete event');
            }
          }
        }
      ]
    );
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      variant="default"
      onPress={() => navigation.navigate('EventDetails', { event: item })}
      onEdit={() => handleEditEvent(item)}
      onDelete={() => handleDeleteEvent(item)}
      showActions={true}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner text="Loading events..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Events</Text>
        <Button
          title="+ Create Event"
          onPress={() => navigation.navigate('CreateEvent')}
          variant="primary"
          size="small"
        />
      </View>
      
      {events.length === 0 ? (
        <EmptyState
          icon="event"
          title="No Events Found"
          subtitle="Create your first event to get started!"
          action={
            <Button
              title="Create Event"
              onPress={() => navigation.navigate('CreateEvent')}
              variant="primary"
            />
          }
        />
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.bold as any,
    color: COLORS.textPrimary,
  },
  listContainer: {
    padding: SPACING.md,
  },
});

export default AdminEvents;
