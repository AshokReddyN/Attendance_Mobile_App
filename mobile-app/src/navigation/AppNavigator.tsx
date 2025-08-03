import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from '../screens/RegistrationScreen';
import MemberDashboard from '../screens/MemberDashboard';
import AdminDashboard from '../screens/AdminDashboard';

// Define the types for the route parameters for each screen in the stack.
// This provides type safety for navigation and route props.
export type RootStackParamList = {
  Registration: undefined; // This screen does not receive any parameters.
  MemberDashboard: undefined;
  AdminDashboard: undefined;
  // Future screens can be added here, e.g., Login: undefined, Home: { userId: string }
};

// Create the stack navigator.
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    // The Stack.Navigator component contains all the screens of the navigator.
    <Stack.Navigator initialRouteName="Registration">
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
    </Stack.Navigator>
  );
};

export default AppNavigator;
