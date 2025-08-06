import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AdminEvents from './AdminEvents';
import AdminPayments from './AdminPayments';
import CrashReportsScreen from './CrashReportsScreen';
import { useAuth } from '../context/AuthContext';
import { Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useScreenTracking } from '../context/CrashReportingContext';

const Tab = createMaterialTopTabNavigator();

type AdminDashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminDashboard'
>;


const AdminDashboard = () => {
    useScreenTracking('AdminDashboard');
    const { logout } = useAuth();
    const navigation = useNavigation<AdminDashboardNavigationProp>();

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => <Button onPress={logout} title="Logout" />,
        });
      }, [navigation, logout]);


  return (
    <Tab.Navigator>
      <Tab.Screen name="Events" component={AdminEvents} />
      <Tab.Screen name="Payments" component={AdminPayments} />
      <Tab.Screen name="Crash Reports" component={CrashReportsScreen} />
    </Tab.Navigator>
  );
};

export default AdminDashboard;
