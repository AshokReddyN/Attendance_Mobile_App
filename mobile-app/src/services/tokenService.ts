import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

/**
 * Saves the authentication token to secure storage.
 * @param token The JWT token to save.
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    // In a real application, you might want to log this error to a service
    console.error('Error saving the auth token', error);
    throw new Error('Failed to save authentication token.');
  }
};

/**
 * Retrieves the authentication token from secure storage.
 * @returns The token, or null if it doesn't exist.
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting the auth token', error);
    throw new Error('Failed to retrieve authentication token.');
  }
};

/**
 * Removes the authentication token from secure storage.
 */
export const removeToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing the auth token', error);
    throw new Error('Failed to remove authentication token.');
  }
};

const tokenService = {
  saveToken,
  getToken,
  removeToken,
};

export default tokenService;
