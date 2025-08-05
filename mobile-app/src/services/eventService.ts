import axios from 'axios';
import { Event, EventParticipant, NewEvent, Participation } from '../types';
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

const getTodaysEvent = async (): Promise<Event | null> => {
  try {
    const response = await apiClient.get<Event>('/events?today=true');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // It's possible the server returns a 404 if no event is scheduled for today.
      // We'll treat this as a "not found" and not an error.
      if (error.response.status === 404) {
        return null;
      }
      throw new Error(
        error.response.data.message ||
          "An error occurred while fetching today's event."
      );
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

const closeEvent = async (id: string): Promise<Event> => {
  try {
    const response = await apiClient.post<Event>(`/events/${id}/close`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message ||
          'An error occurred while closing the event.'
      );
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

const getEventParticipants = async (
  eventId: string
): Promise<{ participants: EventParticipant[] }> => {
  try {
    const response = await apiClient.get<{ participants: EventParticipant[] }>(
      `/events/${eventId}/participants`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching event participants:', error); 
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message ||
          'An error occurred while fetching event participants.'
      );
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

const optInToEvent = async (eventId: string): Promise<void> => {
  try {
    await apiClient.post(`/events/${eventId}/optin`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message ||
          'An error occurred while opting in to the event.'
      );
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

const getMyParticipations = async (): Promise<Participation[]> => {
  try {
    const response = await apiClient.get<{ participations: Participation[] }>(
      '/users/me/participations'
    );
    return response.data.participations;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message ||
          'An error occurred while fetching your participation history.'
      );
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

const eventService = {
  getEvents,
  getTodaysEvent,
  createEvent,
  cloneEvent,
  updateEvent,
  closeEvent,
  getEventParticipants,
  optInToEvent,
  getMyParticipations,
};

export default eventService;
