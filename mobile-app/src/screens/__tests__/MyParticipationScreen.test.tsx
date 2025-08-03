import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import MyParticipationScreen from '../MyParticipationScreen';
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
        <Stack.Screen name="MyParticipation" component={MyParticipationScreen} />
      </Stack.Navigator>
    </AuthProvider>
  </NavigationContainer>
);

describe('MyParticipationScreen', () => {
  it('should display loading indicator initially', () => {
    (eventService.getMyParticipations as jest.Mock).mockResolvedValue(new Promise(() => {}));
    const { getByTestId } = render(<TestNavigator />);
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('should display participation history when data is available', async () => {
    const mockParticipations = [
      { id: '1', eventName: 'Test Event 1', eventDate: new Date().toISOString(), eventPrice: 10, optInTime: new Date().toISOString() },
      { id: '2', eventName: 'Test Event 2', eventDate: new Date().toISOString(), eventPrice: 20, optInTime: new Date().toISOString() },
    ];
    (eventService.getMyParticipations as jest.Mock).mockResolvedValue(mockParticipations);
    const { getByText } = render(<TestNavigator />);

    await waitFor(() => {
      expect(getByText('Test Event 1')).toBeTruthy();
      expect(getByText('Test Event 2')).toBeTruthy();
    });
  });

  it('should display "No participation history" when no data is available', async () => {
    (eventService.getMyParticipations as jest.Mock).mockResolvedValue([]);
    const { getByText } = render(<TestNavigator />);

    await waitFor(() => {
      expect(getByText('No participation history found.')).toBeTruthy();
    });
  });

  it('should display error message on fetch failure', async () => {
    (eventService.getMyParticipations as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    const { getByText } = render(<TestNavigator />);

    await waitFor(() => {
      expect(getByText('Failed to fetch participation history.')).toBeTruthy();
    });
  });
});
