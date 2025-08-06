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
    (paymentService.getMyMonthlyPayments as jest.Mock).mockResolvedValue(new Promise(() => {}));
    const { getByText } = render(<TestNavigator />);
    expect(getByText('Loading payments...')).toBeTruthy();
  });

  it('should display payments when data is available', async () => {
    const mockPayments = [
      { memberId: '1', name: 'Test User 1', totalOwed: 100, status: 'Paid' },
      { memberId: '2', name: 'Test User 2', totalOwed: 120, status: 'unpaid' },
    ];
    (paymentService.getMyMonthlyPayments as jest.Mock).mockResolvedValue(mockPayments);
    const { getByText } = render(<TestNavigator />);

    await waitFor(() => {
      expect(getByText('Test User 1')).toBeTruthy();
      expect(getByText('Test User 2')).toBeTruthy();
    });
  });

  it('should display error message on fetch failure', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    (paymentService.getMyMonthlyPayments as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    render(<TestNavigator />);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'Failed to fetch');
    });
  });
});
