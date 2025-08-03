import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import eventService from '../services/eventService';
import { Participation } from '../types';

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

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator testID="activity-indicator" size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {participations.length === 0 ? (
        <Text style={styles.noDataText}>No participation history found.</Text>
      ) : (
        <FlatList
          data={participations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.eventName}>{item.eventName}</Text>
              <Text>Date: {new Date(item.eventDate).toLocaleDateString()}</Text>
              <Text>Price: ${item.eventPrice.toFixed(2)}</Text>
              <Text>Opted-in at: {new Date(item.optInTime).toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default MyParticipationScreen;
