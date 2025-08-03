import axios from 'axios';
import { Event, NewEvent } from '../types';

// TODO: Replace with your actual API URL from a configuration file
const API_URL = 'http://192.168.29.139:5004/api'; // For Android emulator

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getEvents = async (): Promise<Event[]> => {
  try {
    const response = await apiClient.get<Event[]>('/events');
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

const eventService = {
  getEvents,
  createEvent,
};

export default eventService;
