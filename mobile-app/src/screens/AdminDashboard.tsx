import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AdminEvents from './AdminEvents';
import AdminPayments from './AdminPayments';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button } from '../components';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

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
            headerRight: () => (
              <Button
                title="Logout"
                onPress={logout}
                variant="ghost"
                size="small"
              />
            ),
          });
        }
      }, [navigation, logout, authData]);

  // Don't render anything if user is not authenticated
  if (!authData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIndicatorStyle: styles.tabIndicator,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
        }}
      >
        <Tab.Screen 
          name="Events" 
          component={AdminEvents}
          options={{
            tabBarLabel: 'Manage Events',
          }}
        />
        <Tab.Screen 
          name="Payments" 
          component={AdminPayments}
          options={{
            tabBarLabel: 'View Payments',
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    backgroundColor: COLORS.white,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  tabLabel: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium as any,
    textTransform: 'none',
  },
  tabIndicator: {
    backgroundColor: COLORS.primary,
    height: 3,
  },
});

export default AdminDashboard;
