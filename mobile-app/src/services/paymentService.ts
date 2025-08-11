import axios from 'axios';
import { MemberMonthlyPayment } from '../types';
import tokenService from './tokenService';

// TODO: Replace with your actual API URL from a configuration file
const API_URL = 'http://192.168.1.7:5004/api'; // For Android emulator

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

const getMyMonthlyPayments = async (month:string): Promise<MemberMonthlyPayment[]> => {
  try {
    const response = await apiClient.get<{ payments: MemberMonthlyPayment[] }>(
      '/payments/monthly?userId=me&month=' + month
    );
    return response.data.payments;
  } catch (error) {
    console.error('Error fetching monthly payments:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message ||
          'An error occurred while fetching your monthly payments.'
      );
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

const updatePaymentStatus = async (
  memberId: string,
  month: string,
  status: 'Paid' | 'Unpaid'
): Promise<{ payment: MemberMonthlyPayment }> => {
  try {
    const response = await apiClient.post<{ payment: MemberMonthlyPayment }>(
      '/payments/monthly/status',
      {
        userId:memberId,
        month,
        paymentStatus:status,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating payment status:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message ||
          'An error occurred while updating the payment status.'
      );
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

const paymentService = {
  getMyMonthlyPayments,
  updatePaymentStatus,
};

export default paymentService;
