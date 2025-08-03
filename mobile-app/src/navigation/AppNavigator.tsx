import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import MemberDashboard from '../screens/MemberDashboard';
import AdminDashboard from '../screens/AdminDashboard';
import CreateEventScreen from '../screens/CreateEventScreen';
import EventDetails from '../screens/EventDetails';
import { Event } from '../types';

// Define the types for the route parameters for each screen in the stack.
// This provides type safety for navigation and route props.
export type RootStackParamList = {
  Login: undefined;
  Registration: undefined; // This screen does not receive any parameters.
  MemberDashboard: undefined;
  AdminDashboard: undefined;
  EventDetails: { event: Event };
  CreateEvent: undefined;
  // Future screens can be added here, e.g., Login: undefined, Home: { userId: string }
};

// Create the stack navigator.
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    // The Stack.Navigator component contains all the screens of the navigator.
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Login', // Set the header title for this screen.
        }}
      />
      <Stack.Screen
        name="Registration"
        component={RegistrationScreen}
        options={{
          title: 'Create an Account', // Set the header title for this screen.
        }}
      />
      <Stack.Screen
        name="MemberDashboard"
        component={MemberDashboard}
        options={{ title: 'Member Dashboard' }}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{ title: 'Admin Dashboard' }}
      />
      <Stack.Screen
        name="EventDetails"
        component={EventDetails}
        options={{ title: 'Event Details' }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{ title: 'Create Event' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
