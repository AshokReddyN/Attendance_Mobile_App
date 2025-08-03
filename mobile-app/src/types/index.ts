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
  memberId: string;
  name: string;
  totalOwed: number;
  status: 'paid' | 'unpaid';
}

export interface EventParticipant {
  memberId: string;
  name: string;
  optInAt: string;
}

export interface Participation {
  id: string;
  eventName: string;
  eventDate: string;
  eventPrice: number;
  optInTime: string;
}
