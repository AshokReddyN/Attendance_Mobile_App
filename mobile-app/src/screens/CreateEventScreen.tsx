import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import eventService from '../services/eventService';
import { RootStackParamList } from '../navigation/AppNavigator';

type CreateEventNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreateEvent'
>;

type CreateEventRouteProp = RouteProp<RootStackParamList, 'CreateEvent'>;

const CreateEventScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [endTime, setEndTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const navigation = useNavigation<CreateEventNavigationProp>();
  const route = useRoute<CreateEventRouteProp>();

  const isCloning = route.params?.event !== undefined;

  useEffect(() => {
    if (isCloning && route.params?.event) {
      const { event } = route.params;
      setName(event.name);
      setPrice(event.price.toString());
      const originalEndTime = new Date(event.endAt);
      const newEndTime = new Date();
      newEndTime.setHours(originalEndTime.getHours());
      newEndTime.setMinutes(originalEndTime.getMinutes());
      newEndTime.setSeconds(originalEndTime.getSeconds());
      setEndTime(newEndTime);
    }
  }, [isCloning, route.params]);

  const handleSubmit = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Validation Error', 'Event name and price are required.');
      return;
    }
    if (isNaN(parseFloat(price))) {
      Alert.alert('Validation Error', 'Price must be a valid number.');
      return;
    }

    const eventData = {
      name: name.trim(),
      price: parseFloat(price),
      date: new Date().toISOString(),
      endAt: endTime.toISOString(),
    };

    try {
      if (isCloning) {
        await eventService.cloneEvent(eventData);
        Alert.alert('Success', 'Event cloned successfully.');
      } else {
        await eventService.createEvent(eventData);
        Alert.alert('Success', 'Event created successfully.');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'API Error',
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.'
      );
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || endTime;
    setShowTimePicker(Platform.OS === 'ios');
    setEndTime(currentTime);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isCloning ? 'Clone Event' : 'Create New Event'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <View style={styles.timePickerContainer}>
        <Text style={styles.timePickerLabel}>End Time:</Text>
        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
          <Text style={styles.timeText}>{endTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
      </View>
      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isCloning ? 'Clone Event' : 'Create Event'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timePickerLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  timeText: {
    fontSize: 16,
    color: '#007BFF',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateEventScreen;
