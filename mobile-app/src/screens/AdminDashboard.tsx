import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AdminEvents from './AdminEvents';
import AdminPayments from './AdminPayments';
import { useAuth } from '../context/AuthContext';
import { Button, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const Tab = createMaterialTopTabNavigator();

type AdminDashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminDashboard'
>;


const AdminDashboard = () => {
    const { logout, authData } = useAuth();
    const navigation = useNavigation<AdminDashboardNavigationProp>();

    React.useLayoutEffect(() => {
        if (authData) {
          navigation.setOptions({
            headerRight: () => <Button onPress={logout} title="Logout" />,
          });
        }
      }, [navigation, logout, authData]);


  // Don't render anything if user is not authenticated
  if (!authData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Tab.Navigator>
      <Tab.Screen name="Events" component={AdminEvents} />
      <Tab.Screen name="Payments" component={AdminPayments} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminDashboard;
