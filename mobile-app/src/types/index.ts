export interface Event {
  id: string;
  name: string;
  date: string;
  price: number;
  optInCount: number;
  status: 'open' | 'closed';
}
