import axios from 'axios';
import { Event, NewEvent } from '../types';
import tokenService from './tokenService';

// TODO: Replace with your actual API URL from a configuration file
const API_URL = 'http://192.168.29.139:5004/api'; // For Android emulator

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const authData = await tokenService.getAuthData();
    if (authData) {
      config.headers.Authorization = `Bearer ${authData.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getEvents = async (): Promise<{ events: Event[] }> => {
  try {
    const response = await apiClient.get<{ events: Event[] }>('/events');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An error occurred while fetching events.');
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

const createEvent = async (eventData: NewEvent): Promise<Event> => {
  try {
    const response = await apiClient.post<Event>('/events', eventData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || 'An error occurred while creating the event.'
      );
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

const cloneEvent = async (eventData: NewEvent): Promise<Event> => {
  try {
    const response = await apiClient.post<Event>('/events/clone', eventData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message ||
          'An error occurred while cloning the event.'
      );
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

const updateEvent = async (
  id: string,
  eventData: Partial<NewEvent>
): Promise<Event> => {
  try {
    const response = await apiClient.put<Event>(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message ||
          'An error occurred while updating the event.'
      );
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

const eventService = {
  getEvents,
  createEvent,
  cloneEvent,
  updateEvent,
};

export default eventService;
