import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import eventService from '../services/eventService';
import { EventParticipant } from '../types';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Icon, LoadingSpinner, EmptyState } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';

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
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const { authData } = useAuth();
  const isAdmin = authData?.user.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      const fetchParticipants = async () => {
        try {
          setIsLoadingParticipants(true);
          const response = await eventService.getEventParticipants(event.id);
          setParticipants(response.participants);
        } catch (error) {
          Alert.alert(
            'Error',
            error instanceof Error
              ? error.message
              : 'An unknown error occurred.'
          );
        } finally {
          setIsLoadingParticipants(false);
        }
      };
      fetchParticipants();
    }
  }, [event.id, isAdmin]);

  const handleClone = () => {
    navigation.navigate('CreateEvent', { event });
  };

  const handleEdit = () => {
    navigation.navigate('EditEvent', { event });
  };

  const handleClose = () => {
    Alert.alert(
      'Close Event',
      'Are you sure you want to close this event? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Close Event',
          style: 'destructive',
          onPress: async () => {
            try {
              await eventService.closeEvent(event.id);
              setEventStatus('closed');
              Alert.alert('Success', 'Event has been closed successfully.');
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

  const formatDate = (dateInput: string | number | Date) => {
    const date = new Date(dateInput);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateInput: string | number | Date) => {
    const date = new Date(dateInput);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = () => {
    if (eventStatus === 'closed') {
      return COLORS.error;
    }
    return COLORS.success;
  };

  const getStatusIcon = () => {
    if (eventStatus === 'closed') {
      return 'close';
    }
    return 'check';
  };

  const renderParticipantItem = ({ item }: { item: EventParticipant }) => (
    <Card variant="default" style={styles.participantCard}>
      <View style={styles.participantHeader}>
        <View style={styles.participantAvatar}>
          <Icon name="user" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.participantInfo}>
          <Text style={styles.participantName}>{item.name}</Text>
          <Text style={styles.participantTime}>
            Opted in: {new Date(item.optedInAt).toLocaleString()}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{event.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15' }]}>
            <Icon name={getStatusIcon()} size={16} color={getStatusColor()} />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {eventStatus === 'open' ? 'Active' : 'Closed'}
            </Text>
          </View>
        </View>

        {/* Event Details Card */}
        <Card variant="elevated" style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Event Information</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon name="calendar" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Event Date</Text>
              <Text style={styles.detailValue}>{formatDate(event.endAt)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon name="clock" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>End Time</Text>
              <Text style={styles.detailValue}>{formatTime(event.endAt)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon name="money" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>₹{event.price.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon name="users" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Opt-in Count</Text>
              <Text style={styles.detailValue}>{event.optInCount} participants</Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <Card variant="elevated" style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <View style={styles.buttonGrid}>
            <Button
              title="Clone Event"
              onPress={handleClone}
              variant="outline"
              style={styles.actionButton}
            />
            
            {eventStatus === 'open' && (
              <>
                <Button
                  title="Edit Event"
                  onPress={handleEdit}
                  variant="primary"
                  style={styles.actionButton}
                />
                <Button
                  title="Close Event"
                  onPress={handleClose}
                  variant="outline"
                  style={[styles.actionButton, styles.closeButton]}
                />
              </>
            )}
          </View>
        </Card>

        {/* Participants Section (Admin Only) */}
        {isAdmin && (
          <Card variant="elevated" style={styles.participantsCard}>
            <Text style={styles.sectionTitle}>Participants</Text>
            
            {isLoadingParticipants ? (
              <LoadingSpinner text="Loading participants..." variant="inline" />
            ) : participants.length === 0 ? (
              <EmptyState
                icon="users"
                title="No Participants"
                subtitle="No one has opted in to this event yet."
                variant="compact"
              />
            ) : (
              <FlatList
                data={participants}
                keyExtractor={(item) => item.memberId}
                renderItem={renderParticipantItem}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.participantsList}
              />
            )}
          </Card>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.bold as any,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.md,
    lineHeight: TYPOGRAPHY['2xl'] * 1.3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 80,
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  statusText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium as any,
  },
  detailsCard: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.medium as any,
    marginBottom: SPACING.xs,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.semibold as any,
  },
  actionsCard: {
    marginBottom: SPACING.lg,
  },
  buttonGrid: {
    gap: SPACING.sm,
  },
  actionButton: {
    width: '100%',
  },
  closeButton: {
    borderColor: COLORS.error,
  },
  participantsCard: {
    marginBottom: SPACING.lg,
  },
  participantsList: {
    gap: SPACING.sm,
  },
  participantCard: {
    marginBottom: SPACING.sm,
  },
  participantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  participantTime: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
});

export default EventDetails;
