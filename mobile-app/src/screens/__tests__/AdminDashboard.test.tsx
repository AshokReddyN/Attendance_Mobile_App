import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AdminDashboard from '../AdminDashboard';
import eventService from '../../services/eventService';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateEventScreen from '../CreateEventScreen';

jest.mock('../../services/eventService');

const Stack = createStackNavigator();

const TestNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('AdminDashboard', () => {
  it('should render the tab navigator with Events and Payments tabs', async () => {
    const { findByText } = render(<TestNavigator />);

    // Check for the tab labels
    const eventsTab = await findByText('Manage Events');
    const paymentsTab = await findByText('View Payments');

    expect(eventsTab).toBeTruthy();
    expect(paymentsTab).toBeTruthy();
  });
});
