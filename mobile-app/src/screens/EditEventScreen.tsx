import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
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
import { Button, Input, Card, Icon, LoadingSpinner } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';

type EditEventNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditEvent'
>;

type EditEventRouteProp = RouteProp<RootStackParamList, 'EditEvent'>;

const EditEventScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [endTime, setEndTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation<EditEventNavigationProp>();
  const route = useRoute<EditEventRouteProp>();
  const { event } = route.params;

  useEffect(() => {
    if (event) {
      setName(event.name);
      setPrice(event.price.toString());
      setEndTime(new Date(event.endAt));
    }
  }, [event]);

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
      endAt: endTime.toISOString(),
    };

    try {
      setIsSubmitting(true);
      await eventService.updateEvent(event.id, eventData);
      Alert.alert('Success', 'Event updated successfully.');
      navigation.navigate('AdminDashboard');
    } catch (error) {
      Alert.alert(
        'API Error',
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || endTime;
    setShowTimePicker(Platform.OS === 'ios');
    setEndTime(currentTime);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Edit Event</Text>
            <Text style={styles.subtitle}>
              Update the event details and settings
            </Text>
          </View>

          <Card variant="elevated" style={styles.formCard}>
            <Text style={styles.sectionTitle}>Event Details</Text>
            
            <Input
              label="Event Name"
              placeholder="Enter event name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="off"
              leftIcon={<Icon name="event" size={20} color={COLORS.primary} />}
            />

            <Input
              label="Price (₹)"
              placeholder="Enter event price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              leftIcon={<Icon name="money" size={20} color={COLORS.primary} />}
            />

            <View style={styles.timePickerSection}>
              <Text style={styles.timePickerLabel}>End Time</Text>
              <View style={styles.timePickerContainer}>
                <View style={styles.timeDisplay}>
                  <Icon name="clock" size={20} color={COLORS.primary} />
                  <Text style={styles.timeText}>{formatTime(endTime)}</Text>
                </View>
                <Button
                  title="Change Time"
                  onPress={() => setShowTimePicker(true)}
                  variant="outline"
                  size="small"
                />
              </View>
            </View>

            {showTimePicker && (
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  testID="timePicker"
                  value={endTime}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={onTimeChange}
                />
              </View>
            )}
          </Card>

          <View style={styles.actionsSection}>
            <Button
              title="Update Event"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.submitButton}
            />
            
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="ghost"
              style={styles.cancelButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
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
  formCard: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  timePickerSection: {
    marginBottom: SPACING.md,
  },
  timePickerLabel: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium as any,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.gray50,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  timeText: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
  },
  pickerContainer: {
    alignItems: 'center',
    marginTop: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
  },
  actionsSection: {
    gap: SPACING.md,
  },
  submitButton: {
    marginBottom: SPACING.sm,
  },
  cancelButton: {
    marginTop: SPACING.sm,
  },
});

export default EditEventScreen;
