import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import tokenService from '../services/tokenService';
import { AuthResponse } from '../services/authService';

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
  const [initialRoute, setInitialRoute] = useState<'Splash' | 'Login' | 'AdminDashboard' | 'MemberDashboard'>('Splash');

  useEffect(() => {
    const checkAuth = async () => {
      const authData = await tokenService.getAuthData();
      if (authData) {
        setInitialRoute(authData.user.role === 'admin' ? 'AdminDashboard' : 'MemberDashboard');
      } else {
        setInitialRoute('Login');
      }
    };

    // A small delay to make the splash screen visible for a moment
    setTimeout(checkAuth, 1000);
  }, []);

  if (initialRoute === 'Splash') {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="MemberDashboard" component={MemberDashboard} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
