import * as SecureStore from 'expo-secure-store';
import tokenService from '../tokenService';
import { AuthResponse } from '../authService';

// Mock the expo-secure-store module
jest.mock('expo-secure-store');

describe('tokenService', () => {
  const mockAuthData: AuthResponse = {
    token: 'test-token',
    user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'member' },
  };

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  describe('saveAuthData', () => {
    it('should save the auth data to secure store', async () => {
      await tokenService.saveAuthData(mockAuthData);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_data', JSON.stringify(mockAuthData));
      expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAuthData', () => {
    it('should retrieve and parse auth data from secure store', async () => {
      // Mock the implementation of getItemAsync for this test
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(JSON.stringify(mockAuthData));

      const result = await tokenService.getAuthData();

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('auth_data');
      expect(SecureStore.getItemAsync).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAuthData);
    });

    it('should return null if no data is found', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const result = await tokenService.getAuthData();

      expect(result).toBeNull();
    });
  });

  describe('removeAuthData', () => {
    it('should remove the auth data from secure store', async () => {
      await tokenService.removeAuthData();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_data');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(1);
    });
  });
});
