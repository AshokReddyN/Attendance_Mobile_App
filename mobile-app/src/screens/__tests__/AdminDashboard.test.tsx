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
  it('should navigate to CreateEventScreen on button press', async () => {
    (eventService.getEvents as jest.Mock).mockResolvedValue([]);
    const { getByText, findByText } = render(<TestNavigator />);

    await waitFor(() => expect(getByText('All Events')).toBeTruthy());

    fireEvent.press(getByText('+ Create'));

    await waitFor(() => {
        expect(findByText('Create New Event')).toBeTruthy();
    });
  });
});
