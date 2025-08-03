import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import MemberDashboard from '../MemberDashboard';
import eventService from '../../services/eventService';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from '../../context/AuthContext';

jest.mock('../../services/eventService');

const Stack = createStackNavigator();

const TestNavigator = () => (
  <NavigationContainer>
    <AuthProvider>
      <Stack.Navigator>
        <Stack.Screen name="MemberDashboard" component={MemberDashboard} />
      </Stack.Navigator>
    </AuthProvider>
  </NavigationContainer>
);

describe('MemberDashboard', () => {
  it('should display loading indicator initially', () => {
    (eventService.getTodaysEvent as jest.Mock).mockResolvedValue(new Promise(() => {}));
    const { getByTestId } = render(<TestNavigator />);
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('should display event details when an event is available', async () => {
    const mockEvent = {
      id: '1',
      name: 'Test Event',
      price: 10,
      endAt: new Date().toISOString(),
    };
    (eventService.getTodaysEvent as jest.Mock).mockResolvedValue(mockEvent);
    const { getByText } = render(<TestNavigator />);

    await waitFor(() => {
      expect(getByText("Today's Active Event")).toBeTruthy();
      expect(getByText('Name: Test Event')).toBeTruthy();
      expect(getByText('Price: $10.00')).toBeTruthy();
    });
  });

  it('should display "No active event today" when no event is available', async () => {
    (eventService.getTodaysEvent as jest.Mock).mockResolvedValue(null);
    const { getByText } = render(<TestNavigator />);

    await waitFor(() => {
      expect(getByText('No active event today.')).toBeTruthy();
    });
  });

  it('should display error message on fetch failure', async () => {
    (eventService.getTodaysEvent as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    const { getByText } = render(<TestNavigator />);

    await waitFor(() => {
      expect(getByText('Failed to fetch today\'s event.')).toBeTruthy();
    });
  });
});
