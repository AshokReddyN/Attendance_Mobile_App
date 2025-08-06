import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import MemberDashboard from '../screens/MemberDashboard';
import AdminDashboard from '../screens/AdminDashboard';
import CreateEventScreen from '../screens/CreateEventScreen';
import EditEventScreen from '../screens/EditEventScreen';
import EventDetails from '../screens/EventDetails';
import MyParticipationScreen from '../screens/MyParticipationScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import CrashReportsScreen from '../screens/CrashReportsScreen';
import ErrorBoundary from '../components/ErrorBoundary';
import { Event } from '../types';

// Define the types for the route parameters for each screen in the stack.
export type RootStackParamList = {
  MemberDashboard: undefined;
  AdminDashboard: undefined;
  EventDetails: { event: Event };
  CreateEvent: { event?: Event };
  EditEvent: { event: Event };
  MyParticipation: undefined;
  Payments: undefined;
  CrashReports: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { authData } = useAuth();
  const isAdmin = authData?.user.role === 'admin';

  return (
    <Stack.Navigator
      initialRouteName={isAdmin ? 'AdminDashboard' : 'MemberDashboard'}
    >
      {isAdmin ? (
        <>
          <Stack.Screen
            name="AdminDashboard"
            options={{ title: 'Admin Dashboard' }}
          >
            {(props) => (
              <ErrorBoundary>
                <AdminDashboard {...props} />
              </ErrorBoundary>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="CreateEvent"
            options={{ title: 'Create Event' }}
          >
            {(props) => (
              <ErrorBoundary>
                <CreateEventScreen {...props} />
              </ErrorBoundary>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="EditEvent"
            options={{ title: 'Edit Event' }}
          >
            {(props) => (
              <ErrorBoundary>
                <EditEventScreen {...props} />
              </ErrorBoundary>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="CrashReports"
            options={{ title: 'Crash Reports' }}
          >
            {(props) => (
              <ErrorBoundary>
                <CrashReportsScreen {...props} />
              </ErrorBoundary>
            )}
          </Stack.Screen>
        </>
      ) : (
        <>
          <Stack.Screen
            name="MemberDashboard"
            options={{ title: 'Member Dashboard' }}
          >
            {(props) => (
              <ErrorBoundary>
                <MemberDashboard {...props} />
              </ErrorBoundary>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="MyParticipation"
            options={{ title: 'My Participation' }}
          >
            {(props) => (
              <ErrorBoundary>
                <MyParticipationScreen {...props} />
              </ErrorBoundary>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Payments"
            options={{ title: 'My Payments' }}
          >
            {(props) => (
              <ErrorBoundary>
                <PaymentsScreen {...props} />
              </ErrorBoundary>
            )}
          </Stack.Screen>
        </>
      )}
      <Stack.Screen
        name="EventDetails"
        options={{ title: 'Event Details' }}
      >
        {(props) => (
          <ErrorBoundary>
            <EventDetails {...props} />
          </ErrorBoundary>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AppNavigator;
