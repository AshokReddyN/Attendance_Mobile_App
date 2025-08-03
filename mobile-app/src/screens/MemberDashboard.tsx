import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type MemberDashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MemberDashboard'
>;

const MemberDashboard = () => {
  const { logout } = useAuth();
  const navigation = useNavigation<MemberDashboardNavigationProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button onPress={logout} title="Logout" />,
    });
  }, [navigation, logout]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Member!</Text>
      <Text>This is your dashboard.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 20,
  },
});

export default MemberDashboard;
