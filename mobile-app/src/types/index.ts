import { ReactNode } from "react";

export interface Event {
  endAt: string | number | Date;
  id:string;
  name:string;
  date: string;
  price: number;
  optInCount: number;
  status: 'open' | 'closed';
  isOptedIn?: boolean;
}

export type NewEvent = {
  name: string;
  price: number;
  date: string;
  endAt: string;
};

export interface MemberMonthlyPayment {
  userName: string;
  paymentStatus: string;
  totalAmount: number;
  userId: string;
  month: string;
  status: 'paid' | 'unpaid';
}

export interface EventParticipant {
  optedInAt: string | number | Date;
  memberId: string;
  name: string;
  optInAt: string;
}

export interface Participation {
  eventId: string;
  eventName: string;
  eventDate: string;
  price: number;
  optedInAt: string;
}
