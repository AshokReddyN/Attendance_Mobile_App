import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import RootNavigator from '../RootNavigator';
import tokenService from '../../services/tokenService';
import { AuthResponse } from '../../services/authService';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';

// Mock the tokenService
jest.mock('../../services/tokenService');

// Mock the screens to avoid rendering their full content
jest.doMock('../../screens/SplashScreen', () => () => <Text>mock-SplashScreen</Text>);
jest.doMock('../../screens/LoginScreen', () => () => <Text>mock-LoginScreen</Text>);
jest.doMock('../../screens/MemberDashboard', () => () => <Text>mock-MemberDashboard</Text>);
jest.doMock('../../screens/AdminDashboard', () => () => <Text>mock-AdminDashboard</Text>);

describe('RootNavigator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders SplashScreen initially and then LoginScreen if not authenticated', async () => {
    (tokenService.getAuthData as jest.Mock).mockResolvedValue(null);

    const { getByText, queryByText } = render(
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    );

    // Initially, SplashScreen should be visible.
    // Since we mocked it, we can check for its mock representation.
    // Note: Due to the timeout in RootNavigator, we need to handle the async nature.
    expect(getByText('mock-SplashScreen')).toBeTruthy();

    // After the check, LoginScreen should be visible
    await waitFor(() => {
      expect(queryByText('mock-LoginScreen')).toBeTruthy();
    });
  });

  it('renders MemberDashboard if authenticated as a member', async () => {
    const mockAuthData: AuthResponse = {
      token: 'member-token',
      user: { id: '2', name: 'Member User', email: 'member@example.com', role: 'member' },
    };
    (tokenService.getAuthData as jest.Mock).mockResolvedValue(mockAuthData);

    const { findByText } = render(
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    );

    const dashboard = await findByText('mock-MemberDashboard');
    expect(dashboard).toBeTruthy();
  });

  it('renders AdminDashboard if authenticated as an admin', async () => {
    const mockAuthData: AuthResponse = {
      token: 'admin-token',
      user: { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    };
    (tokenService.getAuthData as jest.Mock).mockResolvedValue(mockAuthData);

    const { findByText } = render(
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    );

    const dashboard = await findByText('mock-AdminDashboard');
    expect(dashboard).toBeTruthy();
  });
});
