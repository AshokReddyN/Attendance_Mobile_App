import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import AppNavigator from './AppNavigator'; // Import the main app navigator

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined; // Represents the authentication flow (Login, Registration)
  App: undefined; // Represents the main application flow
};

const Stack = createStackNavigator<RootStackParamList>();

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Registration"
      component={RegistrationScreen}
      options={{ title: 'Create Account' }}
    />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { authData, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authData ? (
        // User is logged in, show the main app navigator
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        // User is not logged in, show the auth flow
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
