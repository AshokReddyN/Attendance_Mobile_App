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
            component={AdminDashboard}
            options={{ title: 'Admin Dashboard' }}
          />
          <Stack.Screen
            name="CreateEvent"
            component={CreateEventScreen}
            options={{ title: 'Create Event' }}
          />
          <Stack.Screen
            name="EditEvent"
            component={EditEventScreen}
            options={{ title: 'Edit Event' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="MemberDashboard"
            component={MemberDashboard}
            options={{ title: 'Member Dashboard' }}
          />
          <Stack.Screen
            name="MyParticipation"
            component={MyParticipationScreen}
            options={{ title: 'My Participation' }}
          />
          <Stack.Screen
            name="Payments"
            component={PaymentsScreen}
            options={{ title: 'My Payments' }}
          />
        </>
      )}
      <Stack.Screen
        name="EventDetails"
        component={EventDetails}
        options={{ title: 'Event Details' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
