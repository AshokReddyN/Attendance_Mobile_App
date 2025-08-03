import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import MemberDashboard from '../screens/MemberDashboard';
import AdminDashboard from '../screens/AdminDashboard';

export type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  MemberDashboard: undefined;
  AdminDashboard: undefined;
  Splash: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { authData, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator>
      {authData ? (
        // User is logged in, show the correct dashboard
        authData.user.role === 'admin' ? (
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Dashboard' }} />
        ) : (
          <Stack.Screen name="MemberDashboard" component={MemberDashboard} options={{ title: 'Member Dashboard' }} />
        )
      ) : (
        // User is not logged in, show the auth flow
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Registration" component={RegistrationScreen} options={{ title: 'Create Account' }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
