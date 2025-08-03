import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import eventService from '../services/eventService';

type EventDetailsRouteProp = RouteProp<RootStackParamList, 'EventDetails'>;
type EventDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EventDetails'
>;

const EventDetails = () => {
  const route = useRoute<EventDetailsRouteProp>();
  const navigation = useNavigation<EventDetailsNavigationProp>();
  const { event } = route.params;
  const [eventStatus, setEventStatus] = useState(event.status);

  const handleClone = () => {
    navigation.navigate('CreateEvent', { event });
  };

  const handleEdit = () => {
    navigation.navigate('EditEvent', { event });
  };

  const handleClose = () => {
    Alert.alert(
      'Close Event',
      'Are you sure you want to close this event?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await eventService.closeEvent(event.id);
              setEventStatus('closed');
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error
                  ? error.message
                  : 'An unknown error occurred.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.detail}>Date: {new Date(event.endAt).toLocaleDateString()}</Text>
      <Text style={styles.detail}>Price: ${event.price.toFixed(2)}</Text>
      <Text style={styles.detail}>Ends at: {new Date(event.endAt).toLocaleTimeString()}</Text>
      <Text style={styles.detail}>Status: {eventStatus}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cloneButton} onPress={handleClone}>
          <Text style={styles.cloneButtonText}>Clone Event</Text>
        </TouchableOpacity>
        {eventStatus === 'open' && (
          <>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
            >
              <Text style={styles.closeButtonText}>Close Event</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  cloneButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  cloneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginLeft: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginLeft: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EventDetails;
