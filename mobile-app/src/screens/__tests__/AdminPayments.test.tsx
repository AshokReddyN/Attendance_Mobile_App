import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import AdminPayments from '../AdminPayments';
import paymentService from '../../services/paymentService';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from '../../context/AuthContext';

jest.mock('../../services/paymentService');
import { Alert } from 'react-native';

jest.mock('../../services/paymentService');

const Stack = createStackNavigator();

const TestNavigator = () => (
  <NavigationContainer>
    <AuthProvider>
      <Stack.Navigator>
        <Stack.Screen name="AdminPayments" component={AdminPayments} />
      </Stack.Navigator>
    </AuthProvider>
  </NavigationContainer>
);

describe('AdminPaymentsScreen', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should display loading indicator initially', () => {
    (paymentService.getAllMonthlyPayments as jest.Mock).mockResolvedValue(new Promise(() => {}));
    const { getByText } = render(<TestNavigator />);
    expect(getByText('Loading payments...')).toBeTruthy();
  });

  it('should display payments when data is available', async () => {
    const mockPayments = [
      { userId: '1', userName: 'Test User 1', totalAmount: 100, status: 'Paid' },
      { userId: '2', userName: 'Test User 2', totalAmount: 120, status: 'Unpaid' },
    ];
    (paymentService.getAllMonthlyPayments as jest.Mock).mockResolvedValue(mockPayments);
    const { getByText } = render(<TestNavigator />);

    await waitFor(() => {
      expect(getByText('Test User 1')).toBeTruthy();
      expect(getByText('Test User 2')).toBeTruthy();
    });
  });

  it('should display error message on fetch failure', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    (paymentService.getAllMonthlyPayments as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    render(<TestNavigator />);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'Failed to fetch');
    });
  });
});
