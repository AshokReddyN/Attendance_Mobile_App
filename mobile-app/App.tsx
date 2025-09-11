import 'react-native-gesture-handler'; // This must be at the very top
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { COLORS } from './src/constants/theme';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor={COLORS.white} />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
