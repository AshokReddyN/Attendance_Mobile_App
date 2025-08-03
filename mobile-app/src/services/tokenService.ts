import * as SecureStore from 'expo-secure-store';
import { AuthResponse } from './authService'; // Import the interface

const AUTH_DATA_KEY = 'auth_data';

/**
 * Saves the authentication data (token and user info) to secure storage.
 * @param authData The authentication data to save.
 */
export const saveAuthData = async (authData: AuthResponse): Promise<void> => {
  try {
    await SecureStore.setItemAsync(AUTH_DATA_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Error saving the auth data', error);
    throw new Error('Failed to save authentication data.');
  }
};

/**
 * Retrieves the authentication data from secure storage.
 * @returns The auth data, or null if it doesn't exist.
 */
export const getAuthData = async (): Promise<AuthResponse | null> => {
  try {
    const authDataString = await SecureStore.getItemAsync(AUTH_DATA_KEY);
    if (authDataString) {
      return JSON.parse(authDataString) as AuthResponse;
    }
    return null;
  } catch (error) {
    console.error('Error getting the auth data', error);
    // It's good practice to also remove the item if it's corrupted
    await SecureStore.deleteItemAsync(AUTH_DATA_KEY);
    throw new Error('Failed to retrieve authentication data.');
  }
};

/**
 * Removes the authentication data from secure storage.
 */
export const removeAuthData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(AUTH_DATA_KEY);
  } catch (error) {
    console.error('Error removing the auth data', error);
    throw new Error('Failed to remove authentication data.');
  }
};

const tokenService = {
  saveAuthData,
  getAuthData,
  removeAuthData,
};

export default tokenService;
