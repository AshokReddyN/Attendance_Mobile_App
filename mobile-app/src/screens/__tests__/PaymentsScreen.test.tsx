import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import PaymentsScreen from '../PaymentsScreen';
import paymentService from '../../services/paymentService';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from '../../context/AuthContext';

jest.mock('../../services/paymentService');

const Stack = createStackNavigator();

const TestNavigator = () => (
  <NavigationContainer>
    <AuthProvider>
      <Stack.Navigator>
        <Stack.Screen name="Payments" component={PaymentsScreen} />
      </Stack.Navigator>
    </AuthProvider>
  </NavigationContainer>
);

describe('PaymentsScreen', () => {
  it('should display loading indicator initially', () => {
    (paymentService.getMyMonthlyPayments as jest.Mock).mockResolvedValue(new Promise(() => {}));
    const { getByTestId } = render(<TestNavigator />);
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('should display payments when data is available', async () => {
    const mockPayments = [
      { userId: '1', userName: 'Test User', month: '2023-01', totalAmount: 100, status: 'Paid' },
      { userId: '1', userName: 'Test User', month: '2023-02', totalAmount: 120, status: 'Unpaid' },
    ];
    (paymentService.getMyMonthlyPayments as jest.Mock).mockResolvedValue(mockPayments);
    const { getByText } = render(<TestNavigator />);

    await waitFor(() => {
      expect(getByText('Month: 2023-01')).toBeTruthy();
      expect(getByText('Month: 2023-02')).toBeTruthy();
    });
  });

  it('should display "No payment history" when no data is available', async () => {
    (paymentService.getMyMonthlyPayments as jest.Mock).mockResolvedValue([]);
    const { getByText } = render(<TestNavigator />);

    await waitFor(() => {
      expect(getByText('No payment history found.')).toBeTruthy();
    });
  });

  it('should display error message on fetch failure', async () => {
    (paymentService.getMyMonthlyPayments as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    const { getByText } = render(<TestNavigator />);

    await waitFor(() => {
      expect(getByText('Failed to fetch your monthly payments.')).toBeTruthy();
    });
  });
});
